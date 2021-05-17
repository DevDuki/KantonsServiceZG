const incidencesRouter = require('express').Router()
const Case = require('../models/case')
const fetch = require("node-fetch")
require('express-async-errors')
const { getDatesBetweenDates, checkDateQuery } = require('../utils/dateUtils')


incidencesRouter.get('/', async (request, response) => {

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
          'incidence': res.incidence === null ? 0 : res.incidence
        }
      })

    responseData = [...responseData, ...returnObjects]

  }));

  response.status(200).json(responseData)
})


incidencesRouter.get('/:bfsNr', async (request, response) => {
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
          'incidence': res.incidence === null ? 0 : res.incidence
        }
      })

    responseData = [...responseData, ...returnObjects]

  }));

  response.status(200).json(responseData)
})



module.exports = incidencesRouter