import {Response, Request, NextFunction} from 'express';
import {VALID} from '../../data/constants/systemConstants';
import db from '../models';


export const postOrderValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {name, email, clockId, cityId, masterId, startWorkOn, endWorkOn} = req.body;

	const validationErrors: string[] = [];

	const validClocksId = await db.Clock.findById(clockId);

	if (!validClocksId.length) {
		validationErrors.push('Clocks with current id does not exist');
	}

	const validCityId = await db.City.findById(cityId);

	if (!validCityId.length) {
		validationErrors.push('City with current id does not exist');
	}

	const validMasterId = await db.Master.findById(masterId);

	if (!validMasterId.length) {
		validationErrors.push('Master with current id does not exist');
	}

	if (!VALID.DATE.test(startWorkOn)) {
		validationErrors.push('Invalid starting date');
	}

	if (!VALID.DATE.test(endWorkOn)) {
		validationErrors.push('Invalid ending date');
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


export const putOrderValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {id, clockId, userId, cityId, masterId, startWorkOn, endWorkOn} = req.body;

	const validationErrors: string[] = [];

	const validOrder = await db.Order.findById(id);

	if (!validOrder.length) {
		validationErrors.push('Order with current id does not exist');
	}

	const validClocksId = await db.Clock.findById(clockId);

	if (!validClocksId.length) {
		validationErrors.push('Clocks with current id does not exist');
	}

	const validUserId = await db.User.findById(userId);

	if (!validUserId.length) {
		validationErrors.push('User with current id does not exist');
	}

	const validCityId = await db.City.findById(cityId);

	if (!validCityId.length) {
		validationErrors.push('City with current id does not exist');
	}

	const validMasterId = await db.Master.findById(masterId);

	if (!validMasterId.length) {
		validationErrors.push('Master with current id does not exist');
	}

	if (!VALID.DATE.test(startWorkOn)) {
		validationErrors.push('Invalid starting date');
	}

	if (!VALID.DATE.test(endWorkOn)) {
		validationErrors.push('Invalid ending date');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const putRatedOrderValidate = async (req: Request, res: Response, next:NextFunction) => {
	const {id, orderRated, masterId} = req.body;

	const validationErrors: string[] = [];

	const validOrder = await db.Order.findById(id);

	if (!validOrder.length) {
		validationErrors.push('Order with current id does not exist');
	}

	const validMasterId = await db.Master.findById(masterId);

	if (!validMasterId.length) {
		validationErrors.push('Master with current id does not exist');
	}

	if (orderRated < 0 || orderRated > 5) {
		validationErrors.push('Order rating must be from 0 to 5 range');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const deleteOrderValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {id} = req.body;

	const validationErrors: string[] = [];

	const validOrder = await db.Order.findById(id);

	if (!validOrder.length) {
		validationErrors.push('Order with current id does not exist');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};
