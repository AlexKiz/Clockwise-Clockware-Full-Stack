/* eslint-disable require-jsdoc */
require('dotenv').config();
import * as cloudinary from 'cloudinary';

cloudinary.v2.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

export {cloudinary};


