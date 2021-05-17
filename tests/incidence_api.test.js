const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Case = require('../models/case')

const api = supertest(app)

const initialCases = [
  {
    date: new Date(2021, 4, 5),
    incidence: 100,
    bfsNr: 1711,
    zipCode: 6300,
    area: 21.62,
    population: 30618
  },
  {
    date: new Date(2021, 4, 4),
    incidence: 50,
    bfsNr: 1710,
    zipCode: 6314,
    area: 21.62,
    population: 30618
  }
]

beforeEach(async () => {
  await Case.deleteMany({})
  let noteObject = new Case(initialCases[0])
  await noteObject.save()
  noteObject = new Case(initialCases[1])
  await noteObject.save()
})

test('filter error returned when no params', async () => {
  await api
    .get('/incidences/')
    .expect(400)

  const response = await api.get('/incidences/')
  const errorMessage = response.body.error

  expect(errorMessage).toContain('Ungültiger Filter')
})

test('correct Filters return the right data', async () => {
  const dateTo = new Date(2021, 4, 5).toISOString().substring(0, 10)
  const dateFrom = new Date(2021, 4, 4).toISOString().substring(0, 10)

  await api
    .get(`/incidences?dateFrom=${dateFrom}&dateTo=${dateTo}`)
    .expect(200)

  const response = await api.get(`/incidences?dateFrom=${dateFrom}&dateTo=${dateTo}`)

  // console.log(response.data)

  expect(response.body).toHaveLength(initialCases.length)
})

