require('dotenv').config();

export const development = {
	username: process.env.DB_USER_DEV,
	password: process.env.DB_PASSWORD_DEV,
	database: process.env.DB_DATABASE_DEV,
	host: process.env.DB_HOST_DEV,
	dialect: 'postgres',
};
export const test = {
	username: process.env.DB_USER_DEV,
	password: process.env.DB_PASSWORD_DEV,
	database: process.env.DB_DATABASE_DEV,
	host: process.env.DB_HOST_DEV,
	dialect: 'postgres',
};
export const production = {
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	host: process.env.DB_HOST,
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
};

