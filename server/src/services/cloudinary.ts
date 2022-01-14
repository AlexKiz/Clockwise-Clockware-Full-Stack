/* eslint-disable require-jsdoc */
import * as cloudinary from 'cloudinary';


interface IConfig {
	cloud_name?: string;
	api_key?: string;
	api_secret?: string;
}

interface IData {
	url: string
}

export class CloudinaryService {
	constructor(config: IConfig) {
		cloudinary.v2.config(config);
	}

	public uploadPhotos = (photos: string[]) => {
		return Promise.all(
			photos.map((photo) => {
				return cloudinary.v2.uploader.upload(photo)
					.then((data: IData) => {
						return data.url;
					});
			}),
		);
	};
}