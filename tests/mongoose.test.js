const { test, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const Person = require('../models/Person');
const {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  performClassicUpdate,
  performNewUpdate,
  removeById,
  removeManyMary,
  queryChain
} = require('../services/personService');

describe('Mongoose & NodeJS VS MongoDB Checkpoint Validation Suite', () => {

  // Test 1: Schema Verification
  test('1. Person Schema must strictly define name (required String), age (Number) and favoriteFoods (Array)', () => {
    const paths = Person.schema.paths;
    
    // name
    assert.ok(paths.name, 'name field must exist');
    assert.strictEqual(paths.name.instance, 'String');
    assert.strictEqual(paths.name.isRequired, true, 'name must be required');

    // age
    assert.ok(paths.age, 'age field must exist');
    assert.strictEqual(paths.age.instance, 'Number');

    // favoriteFoods
    assert.ok(paths.favoriteFoods, 'favoriteFoods field must exist');
    assert.strictEqual(paths.favoriteFoods.instance, 'Array');
  });

  // Test 2: Validation of Schema instantiation
  test('2. Instantiating Person without name should fail validation', () => {
    const invalidPerson = new Person({ age: 25, favoriteFoods: ['pizza'] });
    const validationError = invalidPerson.validateSync();
    assert.ok(validationError, 'Validation error must be raised');
    assert.ok(validationError.errors.name, 'Validation error for name must exist');
  });

  // Test 3: createAndSavePerson logic
  test('3. createAndSavePerson should create a valid Person instance with save called', async () => {
    let saveCalled = false;
    const originalSave = Person.prototype.save;
    Person.prototype.save = async function() {
      saveCalled = true;
      return this;
    };

    try {
      const res = await createAndSavePerson({
        name: 'Darius Ange',
        age: 24,
        favoriteFoods: ['Attiéké', 'Poisson']
      });
      assert.strictEqual(saveCalled, true);
      assert.strictEqual(res.name, 'Darius Ange');
      assert.strictEqual(res.age, 24);
      assert.deepStrictEqual(Array.from(res.favoriteFoods), ['Attiéké', 'Poisson']);
    } finally {
      Person.prototype.save = originalSave;
    }
  });

  // Test 4: createManyPeople
  test('4. createManyPeople should call Person.create with an array of objects', async () => {
    const originalCreate = Person.create;
    let passedArray = null;

    Person.create = async function(arr) {
      passedArray = arr;
      return arr.map((item, idx) => ({ _id: `id_${idx}`, ...item }));
    };

    try {
      const input = [
        { name: 'Mary', age: 25, favoriteFoods: ['burritos'] },
        { name: 'Lucas', age: 30, favoriteFoods: ['sushi'] }
      ];
      const result = await createManyPeople(input);
      assert.strictEqual(passedArray, input);
      assert.strictEqual(result.length, 2);
    } finally {
      Person.create = originalCreate;
    }
  });

  // Test 5: findPeopleByName
  test('5. findPeopleByName should call Person.find with { name: personName }', async () => {
    const originalFind = Person.find;
    let queryUsed = null;

    Person.find = async function(query) {
      queryUsed = query;
      return [{ name: 'Mary', age: 28 }];
    };

    try {
      const result = await findPeopleByName('Mary');
      assert.deepStrictEqual(queryUsed, { name: 'Mary' });
      assert.strictEqual(result[0].name, 'Mary');
    } finally {
      Person.find = originalFind;
    }
  });

  // Test 6: findOneByFood
  test('6. findOneByFood should call Person.findOne with { favoriteFoods: food }', async () => {
    const originalFindOne = Person.findOne;
    let queryUsed = null;

    Person.findOne = async function(query) {
      queryUsed = query;
      return { name: 'Amadou', favoriteFoods: ['burritos'] };
    };

    try {
      const result = await findOneByFood('burritos');
      assert.deepStrictEqual(queryUsed, { favoriteFoods: 'burritos' });
      assert.strictEqual(result.name, 'Amadou');
    } finally {
      Person.findOne = originalFindOne;
    }
  });

  // Test 7: findPersonById
  test('7. findPersonById should call Person.findById with the correct ID', async () => {
    const originalFindById = Person.findById;
    let idUsed = null;

    Person.findById = async function(id) {
      idUsed = id;
      return { _id: id, name: 'Claire' };
    };

    try {
      const mockId = '507f1f77bcf86cd799439011';
      const result = await findPersonById(mockId);
      assert.strictEqual(idUsed, mockId);
      assert.strictEqual(result.name, 'Claire');
    } finally {
      Person.findById = originalFindById;
    }
  });

  // Test 8: performClassicUpdate
  test('8. performClassicUpdate should add "hamburger" to favoriteFoods and save', async () => {
    const originalFindById = Person.findById;
    let saved = false;

    const fakeDoc = {
      _id: '123',
      name: 'Marc',
      favoriteFoods: ['salad'],
      save: async function() {
        saved = true;
        return this;
      }
    };

    Person.findById = async function(id) {
      return fakeDoc;
    };

    try {
      const updated = await performClassicUpdate('123');
      assert.strictEqual(saved, true);
      assert.ok(updated.favoriteFoods.includes('hamburger'));
      assert.strictEqual(updated.favoriteFoods.length, 2);
    } finally {
      Person.findById = originalFindById;
    }
  });

  // Test 9: performNewUpdate
  test('9. performNewUpdate should call findOneAndUpdate with { new: true } and set age to 20', async () => {
    const originalFindOneAndUpdate = Person.findOneAndUpdate;
    let received = null;

    Person.findOneAndUpdate = async function(filter, update, options) {
      received = { filter, update, options };
      return { name: filter.name, age: update.$set.age };
    };

    try {
      const result = await performNewUpdate('Sophie');
      assert.deepStrictEqual(received.filter, { name: 'Sophie' });
      assert.strictEqual(received.update.$set.age, 20);
      assert.strictEqual(received.options.new, true);
      assert.strictEqual(result.age, 20);
    } finally {
      Person.findOneAndUpdate = originalFindOneAndUpdate;
    }
  });

  // Test 10: removeById & removeManyMary
  test('10. removeById and removeManyMary should call findByIdAndDelete and deleteMany', async () => {
    const origFindByIdAndDelete = Person.findByIdAndDelete;
    const origDeleteMany = Person.deleteMany;

    let deleteId = null;
    let deleteFilter = null;

    Person.findByIdAndDelete = async function(id) {
      deleteId = id;
      return { _id: id, name: 'Deleted' };
    };

    Person.deleteMany = async function(filter) {
      deleteFilter = filter;
      return { acknowledged: true, deletedCount: 3 };
    };

    try {
      const resDel = await removeById('del123');
      assert.strictEqual(deleteId, 'del123');
      assert.strictEqual(resDel.name, 'Deleted');

      const resMary = await removeManyMary();
      assert.deepStrictEqual(deleteFilter, { name: 'Mary' });
      assert.strictEqual(resMary.deletedCount, 3);
    } finally {
      Person.findByIdAndDelete = origFindByIdAndDelete;
      Person.deleteMany = origDeleteMany;
    }
  });

  // Test 11: queryChain
  test('11. queryChain should chain sort, limit, select("-age"), and exec', async () => {
    const originalFind = Person.find;
    const chainCalls = {};

    Person.find = function(filter) {
      chainCalls.find = filter;
      return {
        sort: function(sortObj) {
          chainCalls.sort = sortObj;
          return this;
        },
        limit: function(lim) {
          chainCalls.limit = lim;
          return this;
        },
        select: function(sel) {
          chainCalls.select = sel;
          return this;
        },
        exec: async function(cb) {
          const fakeResult = [
            { name: 'Adam', favoriteFoods: ['burritos'] },
            { name: 'Charlie', favoriteFoods: ['burritos'] }
          ];
          if (cb) return cb(null, fakeResult);
          return fakeResult;
        }
      };
    };

    try {
      const results = await queryChain();
      assert.deepStrictEqual(chainCalls.find, { favoriteFoods: 'burritos' });
      assert.deepStrictEqual(chainCalls.sort, { name: 1 });
      assert.strictEqual(chainCalls.limit, 2);
      assert.strictEqual(chainCalls.select, '-age');
      assert.strictEqual(results.length, 2);
    } finally {
      Person.find = originalFind;
    }
  });
});
