import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config({ path: '.env' })

const {
  POSTGRE_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  NODE_ENV,
} = process.env

const client: Pool = new Pool({
  host: POSTGRE_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
})

export default client
