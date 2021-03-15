const express = require("express")
const fetch = require("node-fetch")
require('express-async-errors')
//const geoRegion = require('./COVID19Cases_geoRegion')

const PORT = 3001

const app = express()

// Für Kantonsservice?
app.get('/', async (request, response) => {

 
  //const covidResponse = await fetch('https://covid19-rest.herokuapp.com/api/openzh/v1/country/CH/area/ZG')
  const covidResponse = await fetch('https://www.covid19.admin.ch/de/overview#/definitions/DailyIncomingData/properties/geoRegion/ZG')
  const data = await covidResponse.json()

  
  console.log('response', data)

  // const ZGDataForOtherStudents = {...data}
  // console.log(data)
  // response.json(ZGDataForOtherStudents)

  

  /*
  [
    {
       "bfsNr":     4001, 
       "date":      "2021-02-01",
       "incidence": 17.5  
    },
  ]
  */  
})


app.get('incidences/:bfsNr/', async (request, response) => {
  const bfs = request.params //?

  const ZGDataForOtherStudents = {}

  const covidResponse = await fetch('/covid/api')
  const data = await covidResponse.json()

  /*
  [
    { 
      "bfsNr":     4001, 
      "date":      "2021-02-01",  
      "incidence": 17.5 
    },  
  ]
  */
  
  // After ZGDataForOtherStudents has been fileld with necessary data
  response.json(ZGDataForOtherStudents)
})


app.get('municipalities/', async (request, response) => {

  const ZGDataForOtherStudents = {}

  const covidResponse = await fetch('/covid/api')
  const data = await covidResponse.json()

  /*
  [
    {
       "bfsNr":      4001, 
       "zipCode":    5000,  
       "name":      "Aarau",  
       "canton":     "AG", 
       "area":       12.34, 
       "population": 21473 
    },  
  ]
  */
  
  // After ZGDataForOtherStudents has been fileld with necessary data
  response.json(ZGDataForOtherStudents)
})


app.get('municipalities/:bfsNr/', async (request, response) => {
  const bfs = request.params //?

  const ZGDataForOtherStudents = {}

  const covidResponse = await fetch('/covid/api')
  const data = await covidResponse.json()

  /*
  [
    {
       "bfsNr":      4001,
       "zipCode":    5000,  
       "name":      "Aarau",  
       "canton":     "AG", 
       "area":       12.34, 
       "population": 21473 
    },  
  ]
  */
  
  // After ZGDataForOtherStudents has been fileld with necessary data
  response.json(ZGDataForOtherStudents)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})