import {Response, Request} from 'express';
import db from '../models';


export const postCoordinates = async (req: Request, res: Response) => {
	try {
		const {coordinates} = req.body;

		const cityDnipro = await db.City.findOne({where: {name: 'Dnipro'}});

		const cityId = cityDnipro.id;

		const polygon = await db.Geo.createCoordinatesById(cityId, coordinates);

		res.status(200).json(polygon);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const getCoordinates = async (req: Request, res: Response) => {
	const polygon = await db.Geo.findAll({
		attributes: ['lat', 'lng'],
	});

	res.status(200).json(polygon);
};
