const refreshRouter = require('express').Router()
require('express-async-errors')
const fetch = require("node-fetch")
const mongoose = require('mongoose')
const Municipality = require('../models/municipality')
const Case = require('../models/case')


refreshRouter.get('/', async (request, response) => {
  const covidResponse = await fetch('https://covid19-rest.herokuapp.com/api/openzh/v1/country/CH/area/ZG')
  const data = await covidResponse.json()

  const municipalitiesDB = await Municipality.find({})

  municipalitiesDB.forEach(mun => {
    data.records.forEach((record, index) => {

      let cases = 0
      if (index > 0) {
        cases = (data.records[index].ncumul_conf - data.records[index - 1].ncumul_conf) * mun.ratio
      }

      let totalCases14Days = 0
      if (index >= 15) {
        for (let i = 0; i < 14; i++) {
          totalCases14Days += (data.records[index - i].ncumul_conf - data.records[index - i - 1].ncumul_conf) * mun.ratio
        }
      }
      const incidence = totalCases14Days / mun.population * 100_000


      const casesPerDay = new Case({
        municipality: mun.municipalityName,
        date: record.date,
        incidence: incidence,
        bfsNr: mun.bfsNr,
        zipCode: mun.zipCode,
        area: mun.area,
        population: mun.population
      })

      Case.findOne({ $and: [{ municipality: casesPerDay.municipality }, { date: casesPerDay.date }] }, async (err, res) => {
        if (!res) await casesPerDay.save()
      })
    })
  })
  response.json({ "Hello": "World" })
})



// Initialize Conneciton Object from mongoose
const conn = mongoose.connection;


// Check if municipalites collection is empty
conn.collections.municipalities.count((err, numberOfItems) => {
  if (numberOfItems === 0) {
    municipalities.forEach(municip => {
      console.log(municip)
      const mongoMunicipality = new Municipality({
        canton: 'ZG',
        municipality: municip.municipalityName,
        bfsNr: municip.bfsNr,
        zipCode: municip.zipCode,
        area: municip.area,
        population: municip.population,
        ratio: municip.ratio
      })
      // save Municipalities in mongoDB
      mongoMunicipality.save().then(result => {
        console.log('municipality saved!')
      }).catch(err => {
        throw new Error(err)
      })
    })
  } else {
    console.log("All municipalities already in DB")
  }
})

module.exports = refreshRouter