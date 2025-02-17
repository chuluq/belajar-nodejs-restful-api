# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body:
```json
{
  "username": "lookq",
  "password": "rahasia",
  "name": "Moch Chaerul Chuluq"
}
```

Response Body Success:
```json
{
  "data": {
    "username": "lookq",
    "name": "Moch Chaerul Chuluq"
  }
}
```

Response Body Error:
```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint: POST /api/users/login

Request Body:
```json
{
  "username": "lookq",
  "password": "rahasia"
}
```

Response Body Success:

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error:

```json
{
  "errors": "Username or password wrong"
}
```

## Update User API

Endpoint: PATCH /api/users/current

Headers:
- Authorization: token

Request Body:

```json
{
  "name": "Moch Chaerul Chuluq lagi", // optional
  "password": "new password" // optional
}
```

Response Body Success:

```json
{
  "data": {
    "username": "lookq",
    "name": "Moch Chaerul Chuluq lagi"
  }
}
```

Response Body Error:

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint: GET /api/users/current

Headers:
- Authorization: token

Response Body Success:

```json
{
  "data": {
    "username": "lookq",
    "name": "Moch Chaerul Chuluq"
  }
}
```

Response Body Error:
```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint: DELETE /api/users/logout

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
  "errors": "Unauthorized"
}
```