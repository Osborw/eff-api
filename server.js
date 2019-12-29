import * as Store from './db/store'
const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-cors'), {
  origin: true,
})

fastify.get('/allSeason/:position', async (request, reply) => {
  console.log('--Call made from', request.hostname, '--')
  const top50 = await Store.getTop50(request.params.position)
  const ret = Promise.all(
    top50.map(async p => ({
      weeks: await Store.getWeeks(p.id, 1),
      ...p,
    })),
  )
  console.log(ret)
  return ret
})

fastify.get('/fiveWeeks/:position', async (request, reply) => {
  console.log('--Call made from', request.hostname, '--')
  const top50 = await Store.getFiveWeekTop50(request.params.position)
  const startWeek = 9
  const ret = Promise.all(
    top50.map(async p => ({
      weeks: await Store.getWeeks(p.id, startWeek),
      ...p,
    })),
  )
  return ret
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
