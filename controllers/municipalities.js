const municipalityRouter = require('express').Router()
const fetch = require("node-fetch")
require('express-async-errors')
const Municipality = require('../models/municipality')


municipalityRouter.get('/', async (request, response) => {
  const result = await Municipality.find({})
  console.log(result)
  const responseObj = result.map(res => {
    return {
      bfsNr: res.bfsNr,
      name: res.municipality,
      canton: 'ZG',
      area: res.area,
      population: res.population
    }
  })
  response.status(200).json(responseObj)
})


municipalityRouter.get('/:bfsNr', async (request, response) => {
  const bfs = parseInt(request.params.bfsNr)

  if (bfs < 1701 || bfs > 1711) {
    response.status(404).json({ error: 'BFS-Nummer existiert nicht in diesem Kanton' })
  }

  const result = await Municipality.find({ bfsNr: bfs })
  const responseObj = result.map(res => {
    return {
      bfsNr: res.bfsNr,
      name: res.municipality,
      canton: 'ZG',
      area: res.area,
      population: res.population
    }
  })
  response.status(200).json(responseObj)
}) 

module.exports = municipalityRouter