const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
  municipality: String,
  date: Date,
  incidence: Number,
  bfsNr: Number,
  zipCode: Number,
  area: Number,
  population: Number
})

caseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Case', caseSchema);

