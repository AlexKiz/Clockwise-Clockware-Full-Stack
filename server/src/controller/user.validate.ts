import {Response, Request, NextFunction} from 'express';
import {VALID} from '../../data/constants/systemConstants';
import db from '../models';


export const userRegistrationValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {name, email, password, role, citiesId} = req.body;

	const validationErrors: string[] = [];

	if (!VALID.USER_NAME.test(name)) {
		validationErrors.push('Invalid user name');
	}

	if (!VALID.USER_EMAIL.test(email)) {
		validationErrors.push('Invalid user email');
	}

	if (!VALID.PASSWORD.test(password)) {
		validationErrors.push('Invalid password');
	}

	const validCityId = await db.City.findById(citiesId);

	if (role === 'master' && !validCityId.length) {
		validationErrors.push('Cities with current ids does not exist');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const putUserValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {id, name, email} = req.body;

	const validationErrors: string[] = [];

	const validUser = await db.User.findById(id);

	if (!validUser.length) {
		validationErrors.push('User with current id does not exist');
	}

	if (!VALID.USER_NAME.test(name)) {
		validationErrors.push('Invalid user name');
	}

	if (!VALID.USER_EMAIL.test(email)) {
		validationErrors.push('Invalid user email');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const deleteUserValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {id} = req.body;

	const validationErrors: string[] = [];

	const validUser = await db.User.findById(id);

	if (!validUser.length) {
		validationErrors.push('User with current id does not exist');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};
