const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const https = require('https')

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

const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/apache2/ssl/certificate_zg.pem'),
  cert: fs.readFileSync('/etc/apache2/ssl/key.pem'),
  passphrase: 'test33test'
}, app)

module.exports = httpsServer