const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../server/index');

describe('Deployment Checkpoint Validation Suite', () => {

  // Test 1: Dockerfile structure
  test('1. Dockerfile should exist and declare multi-stage build, non-root user, and HEALTHCHECK', () => {
    const dockerfilePath = path.join(__dirname, '..', 'Dockerfile');
    assert.ok(fs.existsSync(dockerfilePath), 'Dockerfile must exist');
    const content = fs.readFileSync(dockerfilePath, 'utf-8');
    assert.match(content, /FROM node:20-alpine AS builder/i);
    assert.match(content, /USER node/i);
    assert.match(content, /HEALTHCHECK/i);
    assert.match(content, /EXPOSE 8080/i);
  });

  // Test 2: docker-compose.yml structure
  test('2. docker-compose.yml should define app and mongo services on isolated network', () => {
    const composePath = path.join(__dirname, '..', 'docker-compose.yml');
    assert.ok(fs.existsSync(composePath), 'docker-compose.yml must exist');
    const content = fs.readFileSync(composePath, 'utf-8');
    assert.match(content, /services:/);
    assert.match(content, /app:/);
    assert.match(content, /mongo:/);
    assert.match(content, /networks:/);
  });

  // Test 3: CI/CD Workflow file
  test('3. GitHub Actions deploy.yml workflow should be configured', () => {
    const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml');
    assert.ok(fs.existsSync(workflowPath), '.github/workflows/deploy.yml must exist');
    const content = fs.readFileSync(workflowPath, 'utf-8');
    assert.match(content, /runs-on: ubuntu-latest/);
    assert.match(content, /npm test/);
    assert.match(content, /docker build/);
  });

  // Test 4: Health Check Probe
  test('4. GET /health should return 200 with status HEALTHY and uptime', async () => {
    const res = await request(app).get('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'HEALTHY');
    assert.ok(typeof res.body.uptime === 'number');
    assert.ok(res.body.environment);
  });

  // Test 5: Ping Endpoint
  test('5. GET /api/ping should return 200 and message pong', async () => {
    const res = await request(app).get('/api/ping');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, 'pong');
    assert.ok(typeof res.body.time === 'number');
  });

  // Test 6: Production Security Headers
  test('6. HTTP responses must contain production security headers', async () => {
    const res = await request(app).get('/health');
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
    assert.strictEqual(res.headers['x-frame-options'], 'DENY');
    assert.strictEqual(res.headers['x-xss-protection'], '1; mode=block');
  });

  // Test 7: Static Client HTML Serving
  test('7. GET / should serve the production client index.html', async () => {
    const res = await request(app).get('/');
    assert.strictEqual(res.status, 200);
    assert.match(res.headers['content-type'], /html/);
    assert.match(res.text, /CloudOps Hub/i);
    assert.match(res.text, /Système Opérationnel/i);
  });
});
