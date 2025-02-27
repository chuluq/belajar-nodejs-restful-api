import {
  createManyTestContacts,
  createTestContact,
  createTestUser,
  getTestContact,
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

  it('should get contact', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).
        get('/api/contacts/' + testContact.id).
        set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it('should return 404 if contact id is not found', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).
        get('/api/contacts/' + testContact.id + 1).
        set('Authorization', 'test');

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

  it('should update existing contact', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).
        put('/api/contacts/' + testContact.id).
        set('Authorization', 'test').
        send({
          first_name: 'Choirul',
          last_name: 'Chuluq',
          email: 'choirul@test.com',
          phone: '084887878',
        });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe('Choirul');
    expect(result.body.data.last_name).toBe('Chuluq');
    expect(result.body.data.email).toBe('choirul@test.com');
    expect(result.body.data.phone).toBe('084887878');
  });

  it('should reject if request is invalid', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).
        put('/api/contacts/' + testContact.id).
        set('Authorization', 'test').
        send({
          first_name: '',
          last_name: 'Chuluq',
          email: 'choirultest.com',
          phone: '',
        });

    expect(result.status).toBe(400);
  });

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).
        put('/api/contacts/' + testContact.id + 1).
        set('Authorization', 'test').
        send({
          first_name: 'Choirul',
          last_name: 'Chuluq',
          email: 'choirul@test.com',
          phone: '084887878',
        });

    expect(result.status).toBe(404);
  });
});

describe('DELETE /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should delete contact', async () => {
    let testContact = await getTestContact();
    const result = await supertest(web).
        delete('/api/contacts/' + testContact.id).set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data).toBe('OK');

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  it('should reject if contact is not found', async () => {
    let testContact = await getTestContact();
    const result = await supertest(web).
        delete('/api/contacts/' + testContact.id + 1).
        set('Authorization', 'test');

    expect(result.status).toBe(404);
  });
});

describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContacts();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should search without parameter', async () => {
    const result = await supertest(web).
        get('/api/contacts').
        set('Authorization', 'test');
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it('should search to page 2', async () => {
    const result = await supertest(web).
        get('/api/contacts').query({page: 2}).set('Authorization', 'test');

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it('should search using name', async () => {
    const result = await supertest(web).
        get('/api/contacts').query({name: "test 1"}).set('Authorization', 'test');

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it('should search using email', async () => {
    const result = await supertest(web).
        get('/api/contacts').query({email: "test1"}).set('Authorization', 'test');

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it('should search using phone', async () => {
    const result = await supertest(web).
        get('/api/contacts').query({phone: "08123456781"}).set('Authorization', 'test');

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});