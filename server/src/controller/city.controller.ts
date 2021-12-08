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
	const cities = await db.City.findAll();

	res.status(200).json(cities);
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


