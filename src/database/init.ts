import { Client, Pool } from "pg"

let postgresClientPool: any;

// try to reduce the number of connections to the db to reduce CPU load
const NUMBER_OF_DB_CONNECTIONS = 3

export async function connect(): Promise<Client> {
  try {
    if (!postgresClientPool) {
      postgresClientPool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string, 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        max: NUMBER_OF_DB_CONNECTIONS,
        idleTimeoutMillis: 30000,
      });
     
      await postgresClientPool.connect()
    }
    return Promise.resolve(postgresClientPool)
  } catch (err) {
    postgresClientPool = null
    return Promise.reject(err)
  }
}
