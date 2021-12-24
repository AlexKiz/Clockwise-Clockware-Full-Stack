/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import {Response, Request} from 'express';
import {sendMail} from '../services/nodemailer';
import {v4 as uuidv4} from 'uuid';
import db from '../models';


export const postOrder = async (req: Request, res: Response) => {
	try {
		const {name, email, clockId, cityId, masterId, startWorkOn, endWorkOn} = req.body;

		const [user, isUserCreated] = await db.User.findOrCreate({where: {email}, defaults: {email, name, role: 'client'}});

		const {id: userId} = user;

		const ratingIdentificator = uuidv4();

		const order = await db.Order.create({
			clockId,
			userId,
			cityId,
			masterId,
			startWorkOn,
			endWorkOn,
			ratingIdentificator,
		});

		res.status(201).json(order);
	} catch (error) {
		res.status(500).send();
	}
};


export const getOrders = async (req: Request, res: Response) => {

	try {

	const token = (<string>req.headers.authorization).split(' ')[1];

	const {id: userId, role: userRole, masterId: masterId} = await db.User.findOne({where: {token}})
		console.log(userRole);
		
	if (userRole === 'admin') {
		const orders = await db.Order.findAll({
			attributes: ['id', 'startWorkOn', 'endWorkOn', 'ratingIdentificator', 'isCompleted'],
			include: [
				{
					model: db.Clock,
					attributes: ['id', 'size'],
					required: true,
				},
				{
					model: db.User,
					attributes: ['id', 'name', 'email'],
					required: true,
				},
				{
					model: db.City,
					attributes: ['id', 'name'],
					required: true,
				},
				{
					model: db.Master,
					attributes: ['id', 'name'],
					required: true,
				},
			],
		});

		return res.status(200).json(orders)

	} else if (userRole === 'master') {
		const orders = await db.Order.findAll({
			order: [['startWorkOn', 'DESC']],
			attributes: ['id', 'startWorkOn', 'endWorkOn', 'ratingIdentificator', 'isCompleted'],
			include: [
				{
					model: db.Clock,
					attributes: ['id', 'size', 'price'],
					required: true,
				},
				{
					model: db.User,
					attributes: ['id', 'name', 'email'],
					required: true,
				},
				{
					model: db.City,
					attributes: ['id', 'name'],
					required: true,
				},
			],
			where: {
				masterId
			}
		});
		
		return res.status(200).json(orders)
	}

	} catch(e) {
	res.status(500).send()
}

};

export const getOrderForRate = async (req: Request, res: Response) => {
	try {
		const {ratingIdentificator} = req.query;

		const orderForRate = await db.Order.findOne({
			attributes: ['id', 'startWorkOn', 'endWorkOn'],
			where: {
				ratingIdentificator: ratingIdentificator,
			},
			include: [
				{
					model: db.Clock,
					attributes: ['id', 'size'],
					required: true,
				},
				{
					model: db.User,
					attributes: ['id', 'name', 'email'],
					required: true,
				},
				{
					model: db.City,
					attributes: ['id', 'name'],
					required: true,
				},
				{
					model: db.Master,
					attributes: ['id', 'name'],
					required: true,
				},
			],
		});
		res.status(200).json(orderForRate);
	} catch (error) {
		res.status(500).send();
	}
};


export const putRatedOrder = async (req: Request, res: Response) => {
	try {
		const {id, orderRated, masterId} = req.body;

		const ratedOrder = await db.Order.updateById(id, {
			orderRating: orderRated,
			ratingIdentificator: '',
		});

		const averageRating = await db.Order.findAll({
			attributes: [[db.sequelize.fn('AVG', db.sequelize.col('orderRating')), 'newRating']],
			group: 'masterId',
			where: {
				masterId,
				ratingIdentificator: '',
			},
			raw: true,
		});

		if (averageRating.length) {
			const {newRating: rating} = averageRating[0];

			const masterRating = await db.Master.updateById(masterId, {rating});
		}

		res.status(200).json(ratedOrder);
	} catch (error) {
		res.status(500).send();
	}
};


export const getClocks = async (req: Request, res: Response) => {
	const clocks = await db.Clock.findAll();

	res.status(200).json(clocks);
};


export const putOrder = async (req: Request, res: Response) => {
	try {
		const {id, clockId, userId, cityId, masterId, startWorkOn, endWorkOn} = req.body;

		const order = await db.Order.updateById(id, {
			clockId,
			userId,
			cityId,
			masterId,
			startWorkOn,
			endWorkOn,
		});

		res.status(200).json(order);
	} catch (error) {
		res.status(500).send();
	}
};

export const completeOrder = async (req: Request, res: Response) => {
	try {
		const {id, clientEmail, ratingIdentificator} = req.body 

		const order = await db.Order.updateById(id, {isCompleted: true})
console.log(1);

		await sendMail(clientEmail, ratingIdentificator);

		res.status(200).json(order)
	} catch(e) {
		res.status(500).send()
	}
}


export const deleteOrder = async (req: Request, res: Response) => {
	try {
		const {id} = req.body;

		const order = await db.Order.deleteById(id);

		res.status(204).json(order);
	} catch (error) {
		res.status(500).send();
	}
};


