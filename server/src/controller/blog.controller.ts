import {Request, Response} from 'express';
import db from '../models';
import {CloudinaryService} from './../services/cloudinary';
import dotenv from 'dotenv';
dotenv.config();


export const postArticle = async (req: Request, res: Response) => {
	try {
		const {title, description, background, body} = req.body;

		const cloudinary = new CloudinaryService({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		});

		const backgroundPhoto = await cloudinary.uploadPhotos(background);

		const article = await db.Blog.create({
			title,
			description,
			background: backgroundPhoto,
			body,
		});

		res.status(201).json(article);
	} catch (error) {
		res.status(500).send();
	}
};


export const getArtices = async (req: Request, res: Response) => {
	const {limit, offset} = req.query;

	const articles = await db.Blog.findAndCountAll({
		limit,
		offset,
	});

	res.status(200).json(articles);
};


export const getCloudinaryUrls = async (req: Request, res: Response) => {
	const {picture} = req.body;

	const cloudinary = new CloudinaryService({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUD_API_KEY,
		api_secret: process.env.CLOUD_API_SECRET,
	});

	const url = await cloudinary.getUploadPhotoUrl(picture);

	res.status(200).json(url);
};


export const getArticleForUpdate = async (req: Request, res: Response) => {
	const {title} = req.query;

	const article = await db.Blog.findOne({where: {title}});

	res.status(200).json(article);
};


export const putArticle = async (req: Request, res: Response) => {
	try {
		const {id, title, description, background, pictures, body} = req.body;

		const cloudinary = new CloudinaryService({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		});

		const backgroundPhoto = await cloudinary.uploadPhotos(background);

		const contentPhotosURL = await cloudinary.uploadPhotos(pictures);

		const article = await db.Blog.updateById(id, {
			title,
			description,
			background: backgroundPhoto,
			pictures: contentPhotosURL?.join(','),
			body,
		});

		res.status(201).json(article);
	} catch (error) {
		res.status(500).send();
	}
};


export const deleteArticle = async (req: Request, res: Response) => {
	try {
		const {id} = req.body;

		const article = await db.City.deleteById(id);

		res.status(204).json(article);
	} catch (error) {
		res.status(500).send();
	}
};


