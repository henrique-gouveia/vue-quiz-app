require('dotenv').config()

const app = require('express')()
const consign = require('consign')

const db = require('./config/db')

app.db = db

consign()
    .then('./config/middlewares.js')
    .then('./assertions.js')
    .then('./resources')
    .then('./config/routes.js')
    .into(app)

app.listen(process.env.PORT || 3000, () => {
    console.log('Vue App Api is Running...')
})
