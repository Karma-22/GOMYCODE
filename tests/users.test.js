const { test, describe } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('REST API Checkpoint Validation Suite', () => {

  // Test 1: Schema Structure
  test('1. User Schema should enforce name (required), email (unique & match), age and role', () => {
    const paths = User.schema.paths;
    assert.strictEqual(paths.name.instance, 'String');
    assert.strictEqual(paths.name.isRequired, true);
    assert.strictEqual(paths.email.instance, 'String');
    assert.strictEqual(paths.email.isRequired, true);
    assert.strictEqual(paths.age.instance, 'Number');
    assert.strictEqual(paths.role.instance, 'String');
  });

  // Test 2: Invalid Model Validation
  test('2. Missing name or email should fail schema validation', () => {
    const userWithoutName = new User({ email: 'test@example.com' });
    const err = userWithoutName.validateSync();
    assert.ok(err.errors.name);

    const userWithInvalidEmail = new User({ name: 'Bob', email: 'not-an-email' });
    const err2 = userWithInvalidEmail.validateSync();
    assert.ok(err2.errors.email);
  });

  // Test 3: GET /health
  test('3. GET /health should return 200 with UP status', async () => {
    const res = await request(app).get('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'UP');
  });

  // Test 4: GET /api/users
  test('4. GET /api/users should return 200 and array of users', async () => {
    const origFind = User.find;
    User.find = function() {
      return {
        sort: async function() {
          return [
            { _id: '1', name: 'Darius', email: 'darius@gmail.com', age: 24, role: 'admin' },
            { _id: '2', name: 'Alice', email: 'alice@gmail.com', age: 28, role: 'user' }
          ];
        }
      };
    };

    try {
      const res = await request(app).get('/api/users');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.count, 2);
      assert.strictEqual(res.body.data[0].name, 'Darius');
    } finally {
      User.find = origFind;
    }
  });

  // Test 5: POST /api/users - Success & Validation
  test('5. POST /api/users should create user or return 400 when missing required fields', async () => {
    // Missing required fields
    const resFail = await request(app).post('/api/users').send({ age: 20 });
    assert.strictEqual(resFail.status, 400);
    assert.strictEqual(resFail.body.success, false);

    // Successful creation
    const origFindOne = User.findOne;
    const origCreate = User.create;

    User.findOne = async () => null;
    User.create = async (doc) => ({ _id: 'mock_new_id', ...doc });

    try {
      const resSuccess = await request(app).post('/api/users').send({
        name: 'Kouassi Marc',
        email: 'marc.kouassi@gmail.com',
        age: 32,
        role: 'user'
      });

      assert.strictEqual(resSuccess.status, 201);
      assert.strictEqual(resSuccess.body.success, true);
      assert.strictEqual(resSuccess.body.data.name, 'Kouassi Marc');
      assert.strictEqual(resSuccess.body.data._id, 'mock_new_id');
    } finally {
      User.findOne = origFindOne;
      User.create = origCreate;
    }
  });

  // Test 6: PUT /api/users/:id
  test('6. PUT /api/users/:id should update user or return 404 if not found', async () => {
    const origFindByIdAndUpdate = User.findByIdAndUpdate;

    User.findByIdAndUpdate = async (id, update) => {
      if (id === 'nonexistent') return null;
      return { _id: id, name: 'Updated Name', ...update.$set };
    };

    try {
      const res404 = await request(app).put('/api/users/nonexistent').send({ name: 'Test' });
      assert.strictEqual(res404.status, 404);

      const res200 = await request(app).put('/api/users/valid_id').send({ age: 35 });
      assert.strictEqual(res200.status, 200);
      assert.strictEqual(res200.body.success, true);
      assert.strictEqual(res200.body.data.age, 35);
    } finally {
      User.findByIdAndUpdate = origFindByIdAndUpdate;
    }
  });

  // Test 7: DELETE /api/users/:id
  test('7. DELETE /api/users/:id should remove user or return 404 if not found', async () => {
    const origFindByIdAndDelete = User.findByIdAndDelete;

    User.findByIdAndDelete = async (id) => {
      if (id === 'not_found') return null;
      return { _id: id, name: 'Deleted User' };
    };

    try {
      const res404 = await request(app).delete('/api/users/not_found');
      assert.strictEqual(res404.status, 404);

      const res200 = await request(app).delete('/api/users/found_id');
      assert.strictEqual(res200.status, 200);
      assert.strictEqual(res200.body.success, true);
      assert.strictEqual(res200.body.data.name, 'Deleted User');
    } finally {
      User.findByIdAndDelete = origFindByIdAndDelete;
    }
  });
});
