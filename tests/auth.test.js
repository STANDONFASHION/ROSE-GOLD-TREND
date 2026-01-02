const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/db');

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
  await knex.destroy();
});

describe('Auth API', () => {
  test('signup and login flow', async () => {
    const signup = await request(app).post('/auth/signup').send({ email: 'new@example.com', password: 'secret', name: 'New' });
    expect(signup.statusCode).toBe(201);
    expect(signup.body).toHaveProperty('id');

    const login = await request(app).post('/auth/login').send({ email: 'new@example.com', password: 'secret' });
    expect(login.statusCode).toBe(200);
    expect(login.body).toHaveProperty('token');
  });
});
