import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config({ path: '.env' })

const { POSTGRE_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } =
  process.env

const client = new Pool({
  host: POSTGRE_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
})

export default client
