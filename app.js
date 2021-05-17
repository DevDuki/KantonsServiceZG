const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const municipalityRouter = require('./controllers/municipalities')
const incidencesRouter = require('./controllers/incidences')
const refreshRouter = require('./controllers/refresh')


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })



app.use(cors())
app.use(express.json())
app.use('/incidences', incidencesRouter)
app.use('/municipalities', municipalityRouter)
app.use('/', refreshRouter)



module.exports = app