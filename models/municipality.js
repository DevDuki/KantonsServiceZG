const mongoose = require('mongoose')


const municipalitySchema = new mongoose.Schema({
  municipality: String,
  ratio: Number,
  bfsNr: Number,
  population: Number,
  area: Number,
  zipCode: Number
})

municipalitySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Municipality', municipalitySchema);

