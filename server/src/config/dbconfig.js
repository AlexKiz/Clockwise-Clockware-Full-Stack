/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

module.exports = {
	'development': {
		'username': process.env.DB_USER_DEV,
		'password': process.env.DB_PASSWORD_DEV,
		'database': process.env.DB_DATABASE_DEV,
		'host': process.env.DB_HOST_DEV,
		'dialect': 'postgres',
	},
	'test': {
		'username': process.env.DB_USER_TEST,
		'password': process.env.DB_PASSWORD_TEST,
		'database': process.env.DB_DATABASE_TEST,
		'host': process.env.DB_HOST_TEST,
		'dialect': 'postgres',
		'dialectOptions': {
			ssl: {
				rejectUnauthorized: false,
			},
		},
	},
	'production': {
		'username': process.env.DB_USER,
		'password': process.env.DB_PASSWORD,
		'database': process.env.DB_DATABASE,
		'host': process.env.DB_HOST,
		'dialect': 'postgres',
		'dialectOptions': {
			ssl: {
				rejectUnauthorized: false,
			},
		},
	},
};
