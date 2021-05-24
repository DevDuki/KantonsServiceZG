const { httpServer, httpsServer } = require('./app')

const PORThttp = 3001
const PORThttps = 3002

httpServer.listen(PORThttp, () => {
  console.log(`Server listening on ${PORT}`)
})

httpsServer.listen(PORThttps, () => {
  console.log(`Server listening on ${PORT}`)
})