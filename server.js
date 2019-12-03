import * as Store from './db/store'
const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-cors'), { 
  origin: true
})

fastify.get('/allSeason/:position', async (request, reply) => {
  console.log('--Call made from', request.hostname, '--')
  return await Store.getTop50(request.params.position)
})

fastify.get('/fiveWeeks/:position', async (request, reply) => {
  console.log('--Call made from', request.hostname, '--')
  return await Store.getFiveWeekTop50(request.params.position)
})

const start = async () => {
  try {
    await fastify.listen(3001)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()