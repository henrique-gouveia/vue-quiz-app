# Vue Quiz App

The Vue Quiz App is a full-stack system built around VueJs, NodeJs and Express that allows you to apply quizzes with your custom questions.

The main feature are:

- `Questions`: It allows insert the questions to compose a questionnaire
- `Questionnaires`: It allows generate quizzes with random questions from the customized questions
- `Quiz`: It allows to reply a questionnaire and see your punctuation

## Quick Start

```javascript
// Install dependencies for server & client
npm install && npm run server-install

// Run client & server with concurrently
npm run dev

// App runs on http://localhost:8080 and server on http://localhost:3000
```

## Stack

### Frontend

- [Vue](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [BootstrapVue](https://bootstrap-vue.org/)
- [Typescript](https://www.typescriptlang.org/)

### Backend

- [Node](https://nodejs.org/en/)
- [Express](http://expressjs.com/)
- [Knex.js](https://knexjs.org/)

## Configuration

Make sure to start your own `Postgres` database and configure the following `environments variables` in the your `./src/api/.env` file.

```
DATABASE_HOST=""
DATABASE_PORT=""
DATABASE_NAME=""
DATABASE_USER=""
DATABASE_PASSWORD=""
```
