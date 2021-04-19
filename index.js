const express = require("express")
const fetch = require("node-fetch")
require('express-async-errors')
const municipalities = require('./ZGData')

const PORT = 3001

const app = express()

let mainData = []


app.get('/', async (request, response) => {
  const covidResponse = await fetch('https://covid19-rest.herokuapp.com/api/openzh/v1/country/CH/area/ZG')
  // const covidResponse = await fetch('https://www.covid19.admin.ch/de/overview')
  const data = await covidResponse.json()

  let cleanData = []


  municipalities.forEach(municipality => {
    data.records.forEach((record, index) => {

      let cases = 0
      if(index > 0){
        cases = (data.records[index].ncumul_conf - data.records[index-1].ncumul_conf) * municipality.Ratio
      }

      let totalCases14Days = 0
      if(index >= 15){
        for(let i = 0; i < 14; i++) {
          totalCases14Days += (data.records[index - i].ncumul_conf - data.records[index - i - 1].ncumul_conf) * municipality.Ratio
        }
      }
      
      const incidence = totalCases14Days / municipality.Citizens * 100_000
  
      const casesPerDay = {
        municipality: municipality.Municipality,
        date: record.date,
        incidence: Math.round(incidence, 1),
        bfsNr: municipality.bfsNr,
        zipCode: municipality.zipCode,
        area: municipality.area,
        population: municipality.area
      }
  
      cleanData.push(casesPerDay)
    })
  })

  mainData = cleanData

  response.json(mainData)
})




// Für Kantonsservice
app.get('/incidences', async (request, response) => {
  const responseData = mainData.map(data => {
    return {
      bfsNr: data.bfsNr,
      date: data.date,
      incidence: data.incidence
    }
  })

  response.json(responseData)

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


app.get('/incidences/:bfsNr', async (request, response) => {
  const bfs = parseInt(request.params.bfsNr)

  const responseData = mainData.filter(data => data.bfsNr === bfs).map(data => {
    return {
      bfsNr: data.bfsNr,
      date: data.date,
      incidence: data.incidence
    }
  })

  response.json(responseData)

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


app.get('/municipalities', async (request, response) => {
  const responseData = mainData.map(data => {
    return {
      canton: 'ZG',
      bfsNr: data.bfsNr,
      zipCode: data.zipCode,
      name: data.municipality,
      area: data.area,
      population: data.population
    }
  })

  response.json(responseData[0])

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
})


app.get('/municipalities/:bfsNr', async (request, response) => {
  const bfs = parseInt(request.params.bfsNr)

  const responseData = mainData.filter(data => data.bfsNr === bfs).map(data => {
    return {
      canton: 'ZG',
      bfsNr: data.bfsNr,
      zipCode: data.zipCode,
      name: data.municipality,
      area: data.area,
      population: data.population
    }
  })

  response.json(responseData[0])
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
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})