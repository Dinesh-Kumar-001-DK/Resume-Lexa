const request = require('supertest');
const mongoose = require('mongoose');

jest.mock('../middleware/auth', () => ({
  protect: (req, res, next) => {
    req.user = { id: 'test-user-id-123', email: 'test@example.com' };
    next();
  }
}));

const app = require('../index');

const TEST_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/ei-test-resumes';

let resumeId = '';

beforeAll(async () => {
  await mongoose.connect(TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Resume CRUD Routes', () => {
  test('POST /api/resumes — creates a resume', async () => {
    const res = await request(app)
      .post('/api/resumes')
      .send({
        title: 'Test Resume',
        content: 'Alex Sterling — Product Manager with 8 years experience. Led a team of 12 to deliver $2M savings.',
        jobDescription: 'We need a senior product manager experienced in agile methodologies.',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Test Resume');
    resumeId = res.body.data._id;
  });

  test('GET /api/resumes — lists resumes', async () => {
    const res = await request(app).get('/api/resumes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/resumes/:id — gets one resume', async () => {
    const res = await request(app).get(`/api/resumes/${resumeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(resumeId);
  });

  test('PUT /api/resumes/:id — updates resume', async () => {
    const res = await request(app)
      .put(`/api/resumes/${resumeId}`)
      .send({ title: 'Updated Resume Title' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Resume Title');
  });

  test('POST /api/analysis/:id — analyzes resume', async () => {
    const res = await request(app)
      .post(`/api/analysis/${resumeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.analysis).toBeDefined();
    expect(res.body.data.analysis.editorialScore).toBeGreaterThan(0);
    expect(res.body.data.status).toBe('analyzed');
  });

  test('DELETE /api/resumes/:id — deletes resume', async () => {
    const res = await request(app)
      .delete(`/api/resumes/${resumeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
