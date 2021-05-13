const municipalities = require('../ZGData')
const Case = require('./models/case.js')
const Municipality = require('./models/municipality.js')
const supertest = require('supertest')
const app = require('../index')

const api = supertest(app)




const testCases = [
  {
    date: new Date(),
    incidence: 100,
    bfsNr: 1711,
    zipCode: 6300,
    area: 21.62,
    population: 30618
  },
  {
    date: new Date(),
    incidence: 50,
    bfsNr: 1710,
    zipCode: 6314,
    area: 21.62,
    population: 30618
  }
]

const testMunicipalities = municipalities

const url = `mongodb+srv://wodss2:fabian@cluster0.txeig.mongodb.net/myTestDatabase?retryWrites=true&w=majority`

testCases.forEach(testCase => {

})