const express = require("express")
const fetch = require("node-fetch")
require('express-async-errors')
//const geoRegion = require('./COVID19Cases_geoRegion')

const PORT = 3001

const app = express()

// Für Kantonsservice?
app.get('/', async (request, response) => {

 
  const covidResponse = await fetch('https://covid19-rest.herokuapp.com/api/openzh/v1/country/CH/area/ZG')
  // const covidResponse = await fetch('https://www.covid19.admin.ch/de/overview')
  const data = await covidResponse.json()

  const municipalities = [{Canton: "Zug", Ratio: 0.24}, {Canton: "Oberägeri", Ratio: 0.05}, {Canton: "Unterägeri", Ratio: 0.069}, {Canton: "Menzingen", Ratio: 0.035}, {Canton: "Baar", Ratio: 0.193}, {Canton: "Cham", Ratio: 0.132}, {Canton: "Hünenberg", Ratio: 0.069}, {Canton: "Steinhausen", Ratio: 0.079}, {Canton: "Risch", Ratio: 0.086}, {Canton: "Walchwil", Ratio: 0.03}, {Canton: "Neuheim", Ratio: 0.017}]




  let cleanData = []


  municipalities.forEach(municipality => {
    data.records.forEach((record, index) => {

      let cases = 0
      if(index > 0){
        cases = data.records[index].ncumul_conf - data.records[index-1].ncumul_conf * municipality.Ratio
      }
      
  
      const casesPerDay = {
        municipality: municipality.Canton,
        date: record.date,
        cases: Math.floor(cases)
      }
  
      
  
      cleanData.push(casesPerDay)
    })
  })
  

  
  console.log('casesPerDay',cleanData)

  response.json(cleanData)

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