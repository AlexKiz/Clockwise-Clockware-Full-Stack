import * as dotenv from 'dotenv'

import pg from 'pg'

dotenv.config()

const devConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
}

const prodConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const configForUse = process.env.DATABASE_URL ? prodConfig : devConfig
const pool = new pg.Pool(configForUse)

export default pool