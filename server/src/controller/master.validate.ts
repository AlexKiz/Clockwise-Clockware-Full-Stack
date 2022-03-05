import {Response, Request, NextFunction} from 'express';
import {VALID} from '../../data/constants/systemConstants';
import db from '../models';


export const postMasterValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {name, citiesId} = req.body;

	const validationErrors: string[] = [];

	if (!VALID.MASTER_NAME.test(name)) {
		validationErrors.push('Invalid master name');
	}

	const validCityId = await db.City.findById(citiesId);

	if (!validCityId.length) {
		validationErrors.push('Cities with current ids does not exist');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const putMasterValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {id, name, citiesId} = req.body;

	const validationErrors: string[] = [];

	const validMaster = await db.Master.findById(id);

	if (!validMaster.length) {
		validationErrors.push('Master with current id does not exist');
	}

	if (!VALID.MASTER_NAME.test(name)) {
		validationErrors.push('Invalid master name');
	}

	const validCityId = await db.City.findById(citiesId);

	if (!validCityId.length) {
		validationErrors.push('Cities with current ids does not exist');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const deleteMasterValidate = async (req: Request, res: Response, next: NextFunction) => {
	const {id} = req.body;

	const validationErrors: string[] = [];

	const validMaster = await db.Master.findById(id);

	if (!validMaster.length) {
		validationErrors.push('Master with current id does not exist');
	}

	if (validationErrors.length) {
		res.status(400).json(validationErrors);
	} else {
		return next();
	}
};


export const masterBelongsCheck = async (req: Request, res: Response, next: NextFunction) => {
	const {id} = req.body;

	const masterCheck = await db.Order.findAll({
		where: {
			masterId: id,
		},
	});

	if (masterCheck.length) {
		res.status(405).send();
	} else {
		return next();
	}
};
