import {Response, Request, NextFunction} from 'express';
import {VALID} from '../../data/constants/systemConstants';
import db from '../models';

export const postArticleValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {title, description, background, body} = req.body;

	const validationErrors: string [] = [];

	if (title.length > 40) {
		validationErrors.push('Title length more than allowed');
	}

	if (description.length > 170) {
		validationErrors.push('Description length more than allowed');
	}

	if (!background) {
		validationErrors.push('Main photo can not be apsent');
	}

	if (body.length > 3350) {
		validationErrors.push('Content length more than allowed');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const putArticleValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {id, title, description, background, body} = req.body;

	const validationErrors: string [] = [];

	const validArticle = await db.Blog.findByPk(id);

	if (!validArticle) {
		validationErrors.push('Article with current id does not exist');
	}

	if (title.length > 40) {
		validationErrors.push('Title length more than allowed');
	}

	if (description.length > 170) {

		validationErrors.push('Description length more than allowed');
	}

	if (!background) {
		validationErrors.push('Main photo can not be apsent');
	}

	if (body.length > 3350) {
		validationErrors.push('Content length more than allowed');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const deleteArticleValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {id} = req.body;

	const validationErrors: string[] = [];

	const validArticle = await db.Blog.findByPk(id);

	if (!validArticle) {
		validationErrors.push('Article with current id does not exist');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};
