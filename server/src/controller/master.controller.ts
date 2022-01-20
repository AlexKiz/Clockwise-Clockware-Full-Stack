import {Response, Request} from 'express';
import db from '../models';
import {Op} from 'sequelize';


export const postMaster = async (req: Request, res: Response) => {
	try {
		const {name, citiesId} = req.body;

		const master = await db.Master.create({name});

		await master.setCities(citiesId);

		res.status(201).json(master);
	} catch (error) {
		res.status(500).send(error);
	}
};


export const getMasters = async (req: Request, res: Response) => {
	const masters = await db.Master.findAll({
		attributes: ['id', 'name', 'rating'],
		include: {
			model: db.City,
			attributes: ['id', 'name'],
			through: {attributes: []},
		},
	});

	res.status(200).json(masters);
};


export const getAvailableMasters = async (req: Request, res: Response) => {
	try {
		const {currentOrderId, cityId, startWorkOn, endWorkOn} = req.query;

		let bookedMasters;
		if (currentOrderId) {
			bookedMasters = await db.Order.findAll({
				attributes: ['masterId'],
				where: {
					[Op.or]: [
						{
							[Op.and]: [
								{startWorkOn: {[Op.lte]: startWorkOn}},
								{endWorkOn: {[Op.gte]: startWorkOn}},
							],
						},
						{
							[Op.and]: [
								{startWorkOn: {[Op.lte]: endWorkOn}},
								{endWorkOn: {[Op.gte]: endWorkOn}},
							],
						},
					],
					id: {
						[Op.not]: currentOrderId,
					},
				},
			});
		} else {
			bookedMasters = await db.Order.findAll({
				attributes: ['masterId'],
				where: {
					[Op.or]: [
						{
							[Op.and]: [
								{startWorkOn: {[Op.lte]: startWorkOn}},
								{endWorkOn: {[Op.gte]: startWorkOn}},
							],
						},
						{
							[Op.and]: [
								{startWorkOn: {[Op.lte]: endWorkOn}},
								{endWorkOn: {[Op.gte]: endWorkOn}},
							],
						},
					],
				},
			});
		}

		const bookedMastersId = bookedMasters.map((master: { masterId: number; }) => master.masterId);

		const availableMasters = await db.Master.findAll({
			where: {
				id: {[Op.notIn]: bookedMastersId},
			},
			include: {
				model: db.City,
				attributes: [],
				where: {id: cityId},
			},
		});

		res.status(200).json(availableMasters);
	} catch (error) {
		res.status(500).send();
	}
};


export const putMaster = async (req: Request, res: Response) => {
	try {
		const {id, name, citiesId} = req.body;

		const [, master] = await db.Master.updateById(id, {name}, {returning: true});

		if (master.length) {
			await master[0].setCities(citiesId);

			res.status(200).json(master);
		}
	} catch (error) {
		res.status(500).send();
	}
};


export const deleteMaster = async (req: Request, res: Response) => {
	try {
		const {id} = req.body;

		const master = await db.Master.deleteById(id);

		res.status(204).json(master);
	} catch (error) {
		res.status(500).send();
	}
};


