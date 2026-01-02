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

describe('Orders API', () => {
  test('POST /orders creates an order and items (authenticated)', async () => {
    // create a user and login
    await request(app).post('/auth/signup').send({ email: 'user@example.com', password: 'pass123', name: 'User' });
    const login = await request(app).post('/auth/login').send({ email: 'user@example.com', password: 'pass123' });
    const token = login.body.token;

    // insert a product first
    const [pid] = await knex('products').insert({ name: 'Necklace', description: 'Rose gold necklace', price: '199.99' });

    const payload = { items: [{ product_id: pid, quantity: 2 }] };
    const res = await request(app).post('/orders').set('Authorization', `Bearer ${token}`).send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0].product_id).toBe(pid);
  });
});
