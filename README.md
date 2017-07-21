# Motivation

This is my attempt to [Vaultdragon Coding Test](https://gist.github.com/jerelim/3e883999e8d8ef5af2428b364858afc3)

## Usage

- The API is at https://brian-yang-coding-test.herokuapp.com

- A valid API key is required, it should be in **api_key** field in HTTP URL query, and is given below

- For POST method, HTTP headsers should have ```Content-Type: application/json```

- API request timeout: 30 seconds

- SQLite lock table timeout: 5 seconds

- It doesn't handle non-standard characters

- Heroku free account's instance goes to sleep when it receives no traffic in a 30 minute period, which means the first API call might be slow

## API reference

API key: **6cd745f5c27d8e819b4f63e4e2d5e9b9f606ce7fad52cd93cf7fabbe7e5d2d9f**

### Retrieve value

```http
GET /object/{key}
```

Fields:

| Property Name             | Data Type | Remarks                       |
|------------------------|-----------|-------------------------------|
| key             | string    | |
| timestamp           | long    | optional, in milliseconds  |

Example request:

```http
https://brian-yang-coding-test.herokuapp.com/object/test?api_key=6cd745f5c27d8e819b4f63e4e2d5e9b9f606ce7fad52cd93cf7fabbe7e5d2d9f&timestamp=1500615492033
```

Example response:

```json
{
    "value": "test4"
}
```

### Upload key-value pair

```http
POST /object/
```

Example request and body:

```http
https://brian-yang-coding-test.herokuapp.com/object?api_key=6cd745f5c27d8e819b4f63e4e2d5e9b9f606ce7fad52cd93cf7fabbe7e5d2d9f
```

```json
{
    "test": "test4"
}
```

Example response:

```json
{
    "key": "test",
    "value": "test4",
    "timestamp": "2017-07-21T05:36:13.246Z"
}
```

## Built With

- [restify](http://restify.com/) - Node.js REST framework

- [sqlite3](https://github.com/mapbox/node-sqlite3) - Node.js implementation of SQLite database

- [Promises](https://www.promisejs.org/) - A a simple implementation of Promises

## Personal notes

- It took me 3 hours for coding and testing, 2 hours for Heroku and GitHub setup and running, and 1 hour for adding documentation and comments

- I have no prior knowledge of restify or Promises, and before this I have no experience in developing a complete Node.js app, or deploying apps on Heroku

- It's fun to learn all these

## Author

[Brian Yang](http://by-it.com)