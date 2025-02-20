import {
  createTestUser,
  removeAllTestContacts,
  removeTestUser,
} from './test-util.js';
import supertest from 'supertest';
import {web} from '../src/application/web.js';

describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should create contact', async () => {
    const result = await supertest(web).post('/api/contacts').set('Authorization', 'test').send({
      first_name: 'test',
      last_name: 'test',
      email: 'test@test.com',
      phone: '08812345678',
    });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe('test');
    expect(result.body.data.last_name).toBe('test');
    expect(result.body.data.email).toBe('test@test.com');
    expect(result.body.data.phone).toBe('08812345678');
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web).post('/api/contacts').set('Authorization', 'test').send({
      first_name: '',
      last_name: 'test',
      email: 'test@test.com',
      phone: '08812345678000000000000000000000000000000000',
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});