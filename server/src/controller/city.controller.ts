import {Request, Response} from 'express';
import db from '../models';


export const postCity = async (req: Request, res: Response) => {
	try {
		const {name} = req.body;

		const city = await db.City.create({name});

		res.status(201).json(city);
	} catch (error) {
		res.status(500).send();
	}
};


export const getCities = async (req: Request, res: Response) => {
	const {limit, offset, sortedField, sortingOrder} = req.query;

	if (limit && offset) {
		const cities = await db.City.findAndCountAll({
			order: [[db.sequelize.col(`${sortedField}`), `${sortingOrder}`]],
			limit,
			offset,
		});
		return res.status(200).json(cities);
	} else {
		const cities = await db.City.findAll();
		return res.status(200).json(cities);
	}
};

export const getCityForUpdate = async (req: Request, res: Response) => {
	const {name} = req.query;

	const city = await db.City.findOne({
		where: {name},
	});

	res.status(200).json(city);
};


export const getCitiesForOrder = async (req: Request, res: Response) => {
	const citiesForOrder = await db.City.findAll({
		include: {
			model: db.Master,
			attributes: [],
			required: true,
		},
	});

	res.status(200).json(citiesForOrder);
};


export const putCity = async (req: Request, res: Response) => {
	try {
		const {id, name} = req.body;

		const city = await db.City.updateById(id, {name});

		res.status(200).json(city);
	} catch (error) {
		res.status(500).send();
	}
};


export const deleteCity = async (req: Request, res: Response) => {
	try {
		const {id} = req.body;

		const city = await db.City.deleteById(id);

		res.status(204).json(city);
	} catch (error) {
		res.status(500).send();
	}
};


