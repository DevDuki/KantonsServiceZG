require('dotenv').config()

const MONGODB_URI = process.env.NODE_ENV === 'testmode'
  ? process.env.MONGODB_TEST_URI
  : process.env.MONGODB_URI

console.log(process.env.NODE_ENV)

module.exports = {
  MONGODB_URI
}