const express = require("express")
const fetch = require("node-fetch")
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

require('express-async-errors')
const municipalities = require('./ZGData')

const PORT = 3001

const app = express()

const Case = require('./models/case.js')
const Municipality = require('./models/municipality.js')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// Database connection
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node case.js <password>')
  process.exit(1)
}


const password = process.argv[2]

// Cluster URL
const url = `mongodb+srv://wodss2:${password}@cluster0.txeig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


// Initialize Conneciton Object from mongoose
const conn = mongoose.connection;


// Check if municipalites collection is empty
conn.collections.municipalities.count((err, numberOfItems) => {
  if (numberOfItems === 0) {
    municipalities.forEach(municip => {
      console.log(municip)
      const mongoMunicipality = new Municipality({
        canton: 'ZG',
        municipality: municip.municipalityName,
        bfsNr: municip.bfsNr,
        zipCode: municip.zipCode,
        area: municip.area,
        population: municip.population,
        ratio: municip.ratio
      })
      // save Municipalities in mongoDB
      mongoMunicipality.save().then(result => {
        console.log('municipality saved!')
      }).catch(err => {
        throw new Error(err)
      })
    })
  } else {
    console.log("All municipalities already in DB")
  }
})



// GET ALL DATES BETWEEN TWO DATES FOR /incidences route
const getDatesBetweenDates = (startDate, endDate) => {
  let dates = []
  //to avoid modifying the original date
  const theDate = new Date(startDate)
  while (theDate < endDate) {
    dates = [...dates, new Date(theDate)]
    theDate.setDate(theDate.getDate() + 1)
  }
  return dates
}

const checkDateQuery = (startDate, endDate, response) => {
  if (!startDate && !endDate) response.status(400).json({ error: 'Ungültiger Filter' })
  if (!startDate && endDate) startDate = '2020-02-29'
  if (!endDate && startDate) endDate = new Date();
  const dateFrom = new Date(startDate);
  const dateTo = new Date(endDate);

  if (isNaN(dateFrom.valueOf())) response.status(400).json({ error: 'Ungültiger Filter' })
  if (isNaN(dateTo.valueOf())) response.status(400).json({ error: 'Ungültiger Filter' })

  return [dateFrom, dateTo]
}




app.get('/', async (request, response) => {
  const covidResponse = await fetch('https://covid19-rest.herokuapp.com/api/openzh/v1/country/CH/area/ZG')
  const data = await covidResponse.json()

  const municipalitiesDB = await Municipality.find({})

  municipalitiesDB.forEach(mun => {
    data.records.forEach((record, index) => {

      let cases = 0
      if (index > 0) {
        cases = (data.records[index].ncumul_conf - data.records[index - 1].ncumul_conf) * mun.ratio
      }

      let totalCases14Days = 0
      if (index >= 15) {
        for (let i = 0; i < 14; i++) {
          totalCases14Days += (data.records[index - i].ncumul_conf - data.records[index - i - 1].ncumul_conf) * mun.ratio
        }
      }

      const incidence = totalCases14Days / mun.population * 100_000

      const casesPerDay = new Case({
        municipality: mun.municipalityName,
        date: record.date,
        incidence: incidence,
        bfsNr: mun.bfsNr,
        zipCode: mun.zipCode,
        area: mun.area,
        population: mun.population
      })

      Case.findOne({ $and: [{ municipality: casesPerDay.municipality }, { date: casesPerDay.date }] }, async (err, res) => {
        if (!res) await casesPerDay.save()
      })
    })
  })
  response.json({ "Hello": "World" })
})


// Für Kantonsservice
app.get('/incidences', async (request, response) => {

  const queryDateFrom = request.query.dateFrom
  const queryDateTo = request.query.dateTo

  const [dateFrom, dateTo] = checkDateQuery(queryDateFrom, queryDateTo, response)

  const dates = getDatesBetweenDates(dateFrom, dateTo)

  let responseData = []

  await Promise.all(dates.map(async (date) => {
    const results = await Case.find({ date: date })

    returnObjects = results
      .map(res => {
        return {
          'bfsNr': res.bfsNr,
          'date': res.date.toISOString().substring(0, 10),
          'incidence': res.incidence
        }
      })

    responseData = [...responseData, ...returnObjects]

  }));

  response.status(200).json(responseData)
})


app.get('/incidences/:bfsNr', async (request, response) => {
  const bfs = parseInt(request.params.bfsNr)

  if (bfs < 1701 || bfs > 1711) {
    response.status(404).json({ error: 'BFS-Nummer existiert nicht in diesem Kanton' })
  }

  const queryDateFrom = request.query.dateFrom
  const queryDateTo = request.query.dateTo

  const [dateFrom, dateTo] = checkDateQuery(queryDateFrom, queryDateTo, response)

  const dates = getDatesBetweenDates(dateFrom, dateTo)

  let responseData = []

  await Promise.all(dates.map(async (date) => {
    console.log(date)
    const results = await Case.find({ $and: [{ bfsNr: bfs }, { date: date }] })

    returnObjects = results
      .map(res => {
        return {
          'bfsNr': res.bfsNr,
          'date': res.date.toISOString().substring(0, 10),
          'incidence': res.incidence
        }
      })

    responseData = [...responseData, ...returnObjects]

  }));

  response.status(200).json(responseData)
})




// RETURN ALL MUNICIPALITIES
app.get('/municipalities', async (request, response) => {
  const result = await Municipality.find({})
  response.status(200).json(result)
})


// RETURN MUNICIPALITY FOR BFS-NUMBER
app.get('/municipalities/:bfsNr', async (request, response) => {
  const bfs = parseInt(request.params.bfsNr)

  if (bfs < 1701 || bfs > 1711) {
    response.status(404).json({ error: 'BFS-Nummer existiert nicht in diesem Kanton' })
  }

  const result = await Municipality.find({ bfsNr: bfs })
  response.status(200).json(result)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
