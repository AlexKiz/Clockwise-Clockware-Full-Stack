/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import {Response, Request} from 'express';
import {transporter, sendMail} from '../services/nodemailer';
import {v4 as uuidv4} from 'uuid';
import {RESOURCE} from '../../data/constants/routeConstants';
import db from '../models';


export const postOrder = async (req: Request, res: Response) => {
	try {
		const {name, email, clockId, cityId, masterId, startWorkOn, endWorkOn} = req.body;

		const [user, isUserCreated] = await db.User.findOrCreate({where: {email}, defaults: {email, name}});

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

		await sendMail(email, ratingIdentificator);

		res.status(201).json(order);
	} catch (error) {
		res.status(500).send();
	}
};


export const getOrders = async (req: Request, res: Response) => {
	const orders = await db.Order.findAll({
		attributes: ['id', 'startWorkOn', 'endWorkOn'],
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

	res.status(200).json(orders);
};


export const getOrderForRate = async (req: Request, res: Response) => {
	try {
		const {ratingIdentificator} = req.query;

		const orderForRate = await db.Order.findAll({
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
					attributes: ['id', 'name', 'ratedSum', 'ratedQuantity'],
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
		const {id, orderRated, masterId, newRating, newRatedSum, newRatedQuantity} = req.body;

		const masterRating = await db.Master.updateById(masterId, {
			rating: newRating,
			ratedSum: newRatedSum,
			ratedQuantity: newRatedQuantity,
		});

		const ratedOrder = await db.Order.updateById(id, {
			orderRating: orderRated,
			ratingIdentificator: '',
		});

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

		const updateOrder = await db.Order.updateById(id, {
			clockId,
			userId,
			cityId,
			masterId,
			startWorkOn,
			endWorkOn,
		});

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


export const deleteOrder = async (req: Request, res: Response) => {
	try {
		const {id} = req.body;

		const order = await db.Order.deleteById(id);

		res.status(204).json(order);
	} catch (error) {
		res.status(500).send();
	}
};
