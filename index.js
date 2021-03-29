const express = require("express")
const fetch = require("node-fetch")
require('express-async-errors')
//const geoRegion = require('./COVID19Cases_geoRegion')

const PORT = 3001

const app = express()

let mainData = []

const getData = async () => {
  
}


app.get('/', async (request, response) => {
  const covidResponse = await fetch('https://covid19-rest.herokuapp.com/api/openzh/v1/country/CH/area/ZG')
  // const covidResponse = await fetch('https://www.covid19.admin.ch/de/overview')
  const data = await covidResponse.json()

  const municipalities = [{Municipality: "Zug", Ratio: 0.24, bfsNr: 1711, Citizens: 30618, area: 21.62, zipCode: 6300 }, {Municipality: "Oberägeri", Ratio: 0.05, bfsNr: 1706, Citizens: 6244, area: 30.04, zipCode: 6315}, {Municipality: "Unterägeri", Ratio: 0.069, bfsNr: 1709, Citizens: 8868, area: 25.61, zipCode: 6314}, {Municipality: "Menzingen", Ratio: 0.035, bfsNr: 1704, Citizens: 4551, area: 27.51, zipCode: 6318}, {Municipality: "Baar", Ratio: 0.193, bfsNr: 1701, Citizens: 24617, area: 24.85, zipCode: 6340}, {Municipality: "Cham", Ratio: 0.132, bfsNr: 1702, Citizens: 16893, area: 18.73, zipCode: 6330}, {Municipality: "Hünenberg", Ratio: 0.069, bfsNr: 1703, Citizens: 8784, area: 18.41, zipCode: 6331}, {Municipality: "Steinhausen", Ratio: 0.079, bfsNr: 1708, Citizens: 10129, area: 5.04, zipCode: 6312}, {Municipality: "Risch", Ratio: 0.086, bfsNr: 1707, Citizens: 10990, area: 14.86, zipCode: 6434}, {Municipality: "Walchwil", Ratio: 0.03, bfsNr: 1710, Citizens: 3711, area: 13.55, zipCode: 6318}, {Municipality: "Neuheim", Ratio: 0.017, bfsNr: 1705, Citizens: 2237, area: 7.93, zipCode: 6312}]


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

  response.json(responseData)

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

  response.json(responseData)
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