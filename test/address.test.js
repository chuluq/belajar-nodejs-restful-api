import {
  createTestAddress,
  createTestContact,
  createTestUser, getTestAddress, getTestContact, removeAllTestAddresses,
  removeAllTestContacts, removeTestUser,
} from './test-util.js';
import supertest from 'supertest';
import {web} from '../src/application/web.js';

describe('POST /api/contacts/:contactId/addresses', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should create new address', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).
        post('/api/contacts/' + testContact.id + '/addresses').
        set('Authorization', 'test').
        send({
          street: 'Jalan test',
          city: 'Kota test',
          province: 'Provinsi test',
          country: 'Indonesia',
          postal_code: '22222',
        });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe('Jalan test');
    expect(result.body.data.city).toBe('Kota test');
    expect(result.body.data.province).toBe('Provinsi test');
    expect(result.body.data.country).toBe('Indonesia');
    expect(result.body.data.postal_code).toBe('22222');
  });

  it('should reject if address request is invalid', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).
        post('/api/contacts/' + testContact.id + '/addresses').
        set('Authorization', 'test').
        send({
          street: 'Jalan test',
          city: 'Kota test',
          province: 'Provinsi test',
          country: '',
          postal_code: '',
        });

    expect(result.status).toBe(400);
  });

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web).
        post('/api/contacts/' + (testContact.id + 1) + '/addresses').
        set('Authorization', 'test').
        send({
          street: 'Jalan test',
          city: 'Kota test',
          province: 'Provinsi test',
          country: 'Indonesia',
          postal_code: '22222',
        });

    expect(result.status).toBe(404);
  });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should get contact', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).
        get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id).
        set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe('Jalan test');
    expect(result.body.data.city).toBe('Kota test');
    expect(result.body.data.province).toBe('Provinsi test');
    expect(result.body.data.country).toBe('Indonesia');
    expect(result.body.data.postal_code).toBe('22222');
  });

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).
        get('/api/contacts/' + (testContact.id + 1) + '/addresses/' +
            testAddress.id).
        set('Authorization', 'test');

    expect(result.status).toBe(404);
  });

  it('should reject if address is not found', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).
        get('/api/contacts/' + (testContact.id) + '/addresses/' +
            (testAddress.id + 1)).
        set('Authorization', 'test');

    expect(result.status).toBe(404);
  });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should update existing address', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).
        put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id).
        set('Authorization', 'test').
        send({
          street: 'Street',
          city: 'City',
          province: 'Province',
          country: 'Indonesia',
          postal_code: '1111',
        });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testAddress.id);
    expect(result.body.data.street).toBe('Street');
    expect(result.body.data.city).toBe('City');
    expect(result.body.data.province).toBe('Province');
    expect(result.body.data.country).toBe('Indonesia');
    expect(result.body.data.postal_code).toBe('1111');
  });

  it('should reject if request is not valid', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).
        put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id).
        set('Authorization', 'test').
        send({
          street: 'Street',
          city: 'City',
          province: 'Province',
          country: '',
          postal_code: '',
        });

    expect(result.status).toBe(400);
  });

  it('should reject if address is not found', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).
        put('/api/contacts/' + testContact.id + '/addresses/' +
            (testAddress.id + 1)).
        set('Authorization', 'test').
        send({
          street: 'Street',
          city: 'City',
          province: 'Province',
          country: 'Indonesia',
          postal_code: '1111',
        });

    expect(result.status).toBe(404);
  });

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web).
        put('/api/contacts/' + (testContact.id + 1) + '/addresses/' +
            (testAddress.id)).
        set('Authorization', 'test').
        send({
          street: 'Street',
          city: 'City',
          province: 'Province',
          country: 'Indonesia',
          postal_code: '1111',
        });

    expect(result.status).toBe(404);
  });
});