import * as dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()

const db = new Sequelize(`${process.env.DB_DATABASE}`, `${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`, {
    host: `${process.env.DB_HOST}`,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

export const sequelize = new Sequelize(`${process.env.DB_DATABASE_DEV}`, `${process.env.DB_USER_DEV}`, `${process.env.DB_PASSWORD_DEV}`, {
    host: `${process.env.DB_HOST_DEV}`,
    dialect: 'postgres',

})
