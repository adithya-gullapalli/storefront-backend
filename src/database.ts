import { Pool } from "pg"

import "dotenv/config"

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB_TEST, NODE_ENV } = process.env

let client

if (NODE_ENV == "test") {
  console.log(POSTGRES_DB)
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  })
} else if (NODE_ENV == "dev") {
  console.log("connecting to dev db")
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  })
}

export default client
