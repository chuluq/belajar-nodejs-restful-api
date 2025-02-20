import {
  createTestContact,
  createTestUser, getTestContact,
  removeAllTestContacts,
  removeTestUser,
} from './test-util.js';
import supertest from 'supertest';
import {web} from '../src/application/web.js';
import {logger} from '../src/application/logging.js';

describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should create contact', async () => {
    const result = await supertest(web).
        post('/api/contacts').
        set('Authorization', 'test').
        send({
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
    const result = await supertest(web).
        post('/api/contacts').
        set('Authorization', 'test').
        send({
          first_name: '',
          last_name: 'test',
          email: 'test@test.com',
          phone: '08812345678000000000000000000000000000000000',
        });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should get contact', async() => {
    const testContact = await getTestContact()

    const result = await supertest(web).get('/api/contacts/' + testContact.id).set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it('should return 404 if contact id is not found', async() => {
    const testContact = await getTestContact()

    const result = await supertest(web).get('/api/contacts/' + testContact.id + 1).set('Authorization', 'test');

    expect(result.status).toBe(404);
  });
});

describe('PUT /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should update existing contact',async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).put('/api/contacts/' + testContact.id).set('Authorization', 'test').send({
      first_name: 'Choirul',
      last_name: 'Chuluq',
      email: 'choirul@test.com',
      phone: '084887878'
    });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe('Choirul');
    expect(result.body.data.last_name).toBe('Chuluq');
    expect(result.body.data.email).toBe('choirul@test.com');
    expect(result.body.data.phone).toBe('084887878');
  });

  it('should reject if request is invalid',async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).put('/api/contacts/' + testContact.id).set('Authorization', 'test').send({
      first_name: '',
      last_name: 'Chuluq',
      email: 'choirultest.com',
      phone: ''
    });

    expect(result.status).toBe(400);
  });

  it('should reject if contact is not found',async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).put('/api/contacts/' + testContact.id + 1).set('Authorization', 'test').send({
      first_name: 'Choirul',
      last_name: 'Chuluq',
      email: 'choirul@test.com',
      phone: '084887878'
    });

    expect(result.status).toBe(404);
  });
});