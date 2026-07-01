import dotenv from 'dotenv'

dotenv.config()

const ENVIRONMENT = {
  MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME
}

export default ENVIRONMENT