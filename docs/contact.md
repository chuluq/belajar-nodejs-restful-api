# Contact API Spec

## Create Contact API

Endpoint: POST /api/contacts

Headers:
- Authorization: token

Request Body:

```json
{
  "first_name": "Choirul",
  "last_name": "Chuluq",
  "email": "chuluq@email.com",
  "phone": "0878787878"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Choirul",
    "last_name": "Chuluq",
    "email": "chuluq@email.com",
    "phone": "0878787878"
  }
}
```

Response Body Error:

```json
{
  "errors": "Email is not valid"
}
```

## Update Contact API

Endpoint: PUT /api/contacts/:id

Headers:
- Authorization: token

Request Body:
```json
{
  "first_name": "Choirul",
  "last_name": "Chuluq",
  "email": "chuluq@email.com",
  "phone": "0878787878"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Choirul",
    "last_name": "Chuluq",
    "email": "chuluq@email.com",
    "phone": "0878787878"
  }
}
```

Response Body Error:

```json
{
  "errors": "Email is not valid"
}
```

## GET Contact API

Endpoint: GET /api/contacts/:id

Headers:
- Authorization: token

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Choirul",
    "last_name": "Chuluq",
    "email": "chuluq@email.com",
    "phone": "0878787878"
  }
}
```

Response Body Error:

```json
{
  "errors": "Contact is not found"
}
```

## Search Contact API

Endpoint: GET /api/contacts

Headers:
- Authorization: token

Query Params:
- name: search by first_name or last_name, using like, optional
- email: search by email using like, optional
- phone: search by phone using like, optional
- page: number of page, default 1
- size: size per page, default 10

Response Body Success:

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Choirul",
      "last_name": "Chuluq",
      "email": "chuluq@email.com",
      "phone": "0878787878"
    },
    {
      "id": 2,
      "first_name": "Choirul",
      "last_name": "Chuluq",
      "email": "chuluq@email.com",
      "phone": "0878787878"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

Response Body Error:

## Remove Contact API

Endpoint: DELETE /api/contacts/:id

Headers:
- Authorization: token

Response Body Success:

```json
{
  "data": "OK"
}
```

Response Body Error:
```json
{
  "errors": "Contact is not found"
}
```