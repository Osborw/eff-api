import * as mysql from 'mysql2'

const config = {
  connectionLimit: 25,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'JSXR',
  waitForConnections: true,
}

const pool = mysql.createPool(config)
const promisePool = pool.promise();

export const query = async (query) => {
  return await promisePool.query(query, [])
}

// export const query = (query: string | mysql.QueryOptions): Promise<any> => new Promise((done, fail) => {
//   pool.query(query, (err, res) => err ? fail(err) : done(res))
// })

// const getConnectionFromPool = (): Promise<mysql.PoolConnection> => new Promise((done, fail) => {
//   pool.getConnection((err, connection) => err ? fail(err) : done(connection))
// })

// export const createMultiQueryConnection = () => {
//   const connectionPromise = getConnectionFromPool()

//   const query = (query: string | mysql.QueryOptions): Promise<any> => new Promise(async (done, fail) => {
//     try {
//       const connection = await connectionPromise
//       connection.query(query, (err, res) => err ? fail(err) : done(res))
//     } catch(e) {
//       fail(e)
//     }
//   })

//   const dispose = async () => {
//     const connection = await connectionPromise
//     connection.release()
//   }

//   return { query, dispose }
// }

export const close = () => pool.end()
