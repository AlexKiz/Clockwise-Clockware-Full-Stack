require('dotenv').config()

const pg = require('pg')


const devConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
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

module.exports = pool 