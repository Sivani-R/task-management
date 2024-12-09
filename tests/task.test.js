const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Task API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'HIGH'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });

  it('should fetch all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
