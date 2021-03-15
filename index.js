const express = require("express")

const PORT = process.env.PORT || 3001

const app = express()


// Für Kantonsservice?
app.get('/incidences', async (request, response) => {

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