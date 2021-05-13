const municipalityRouter = require('express').Router()
const fetch = require("node-fetch")
require('express-async-errors')
const Municipality = require('../models/municipality')


municipalityRouter.get('/', async (request, response) => {
  const result = await Municipality.find({})
  response.status(200).json(result)
})


municipalityRouter.get('/:bfsNr', async (request, response) => {
  const bfs = parseInt(request.params.bfsNr)

  if (bfs < 1701 || bfs > 1711) {
    response.status(404).json({ error: 'BFS-Nummer existiert nicht in diesem Kanton' })
  }

  const result = await Municipality.find({ bfsNr: bfs })
  response.status(200).json(result)
})



module.exports = municipalityRouter