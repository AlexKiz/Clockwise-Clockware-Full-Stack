import {filtersOptions, rolesMappingGetOrders} from './../../data/utilities/systemUtilities';
import {Response, Request} from 'express';
import {sendMail, sendVerificationMail} from '../services/nodemailer';
import {v4 as uuidv4} from 'uuid';
import db from '../models';
import {BearerParser} from 'bearer-token-parser';
import bcrypt from 'bcrypt';
import {CloudinaryService} from './../services/cloudinary';
import {Op} from 'sequelize';
import dotenv from 'dotenv';
import XLSX from 'xlsx';
import stream from 'stream';

dotenv.config();

export const postOrder = async (req: Request, res: Response) => {
	try {
		const {name, email, clockId, cityId, masterId, startWorkOn, endWorkOn, orderPhotos} = req.body;

		const generatedPassword = uuidv4();
		const salt = bcrypt.genSaltSync(10);
		const hashForVerification = bcrypt.hashSync(`${name}${email}`, salt);
		const hashVerify = hashForVerification.replace(/\//g, 'i');

		const [user, isUserCreated] = await db.User.findOrCreate({
			where: {email},
			defaults: {name, email, password: generatedPassword, role: 'client', hashVerify},
		});

		if (isUserCreated) {
			await sendVerificationMail(email, hashVerify, generatedPassword);
		}

		const {id: userId} = user;

		const ratingIdentificator = uuidv4();

		const cloudinary = new CloudinaryService({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		});

		const orderImagesURL = await cloudinary.uploadPhotos(orderPhotos);

		const order = await db.Order.create({
			clockId,
			userId,
			cityId,
			masterId,
			startWorkOn,
			endWorkOn,
			ratingIdentificator,
			orderImages: orderImagesURL?.join(','),
		});

		res.status(201).json(order);
	} catch (error) {
		res.status(500).send();
	}
};


export const getOrders = async (req: Request, res: Response) => {
	try {
		const {
			limit,
			offset,
			sortedField,
			sortingOrder,
			masterFilteredId,
			cityFilteredId,
			clockFilteredId,
			isCompletedFilter,
			startDateFilter,
			endDateFilter,
		} = req.query;

		const filterOptions: filtersOptions = {};

		if (isCompletedFilter) {
			filterOptions.isCompleted = String(isCompletedFilter);
		}

		if (clockFilteredId) {
			filterOptions.clockId = Number(clockFilteredId);
		}

		if (masterFilteredId) {
			filterOptions.masterId = String(masterFilteredId);
		}

		if (cityFilteredId) {
			filterOptions.cityId = Number(cityFilteredId);
		}

		if (startDateFilter) {
			filterOptions.startWorkOn = {
				[Op.gte]: String(startDateFilter).split('T')[0],
			};
		}

		if (endDateFilter) {
			filterOptions.endWorkOn = {
				[Op.lte]: String(endDateFilter).split('T')[0],
			};
		}

		const token = BearerParser.parseBearerToken(req.headers);

		const {role, masterId, id} = await db.User.findOne({where: {token}});

		const orders = await rolesMappingGetOrders[role]({
			masterId,
			id,
			limit,
			offset,
			sortedField,
			sortingOrder,
			filterOptions,
		});

		res.status(200).json(orders);
	} catch (e) {
		res.status(500).send();
	}
};


export const getOrderForUpdate = async (req: Request, res: Response) => {
	const {id} = req.query;

	const order = await db.Order.findByPk(id, {
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

	return res.status(200).json(order);
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


export const getXSLXOrders = async (req: Request, res: Response) => {
	try {
		const {
			sortedField,
			sortingOrder,
			masterFilteredId,
			cityFilteredId,
			clockFilteredId,
			isCompletedFilter,
			startDateFilter,
			endDateFilter,
		} = req.query;

		const filterOptions: filtersOptions = {};

		if (isCompletedFilter !== 'null') {
			filterOptions.isCompleted = String(isCompletedFilter);
		}

		if (clockFilteredId !== 'null') {
			filterOptions.clockId = Number(clockFilteredId);
		}

		if (masterFilteredId !== 'null') {
			filterOptions.masterId = String(masterFilteredId);
		}

		if (cityFilteredId !== 'null') {
			filterOptions.cityId = Number(cityFilteredId);
		}

		if (startDateFilter !== 'null') {
			filterOptions.startWorkOn = {
				[Op.gte]: (<string>startDateFilter),
			};
		}

		if (endDateFilter !== 'null') {
			filterOptions.endWorkOn = {
				[Op.lte]: (<string>endDateFilter),
			};
		}

		const orders = await db.Order.findAll({
			order: [[db.sequelize.col(`${sortedField}`), `${sortingOrder}`]],
			attributes: ['id', 'orderRating', 'startWorkOn', 'endWorkOn', 'isCompleted'],
			include: [
				{
					model: db.Clock,
					attributes: ['size', 'price'],
					required: true,
				},
				{
					model: db.User,
					attributes: ['name', 'email'],
					required: true,
				},
				{
					model: db.City,
					attributes: ['name'],
					required: true,
				},
				{
					model: db.Master,
					attributes: ['name'],
					required: true,
				},
			],
			where: filterOptions,
		});


		const orderXLSXShape = orders.map((order: any) => {
			return {
				'Order Id': order.id,
				'Clock Size': order.clock.size,
				'User Name': order.user.name,
				'User Email': order.user.email,
				'City': order.city.name,
				'Master Name': order.master.name,
				'Start On': order.startWorkOn,
				'End On': order.endWorkOn,
				'Completed': order.isCompleted,
				'Rating': order.orderRating,
			};
		});

		const workSheet = XLSX.utils.json_to_sheet(orderXLSXShape);
		const workBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, 'AllOrders');

		const XLSXBuffer = XLSX.write(workBook, {bookType: 'xlsx', type: 'buffer'});

		const readableStream = new stream.Readable();

		readableStream.push(XLSXBuffer);
		readableStream.push(null);

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');

		readableStream.pipe(res);
	} catch (e) {
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

			await db.Master.updateById(masterId, {rating});
		}

		res.status(200).json(ratedOrder);
	} catch (error) {
		res.status(500).send();
	}
};


export const getClocks = async (req: Request, res: Response) => {
	const {clockSize} =req.query;

	if (clockSize === 'string') {
		const clocks = await db.Clock.findAll({
			where: {
				size: {[Op.iLike]: `%${clockSize}%`},
			},
		});

		res.status(200).json(clocks);
	} else {
		const clocks = await db.Clock.findAll();

		res.status(200).json(clocks);
	}
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
		const {id, clientEmail, ratingIdentificator} = req.body;

		const order = await db.Order.updateById(id, {isCompleted: true});

		await sendMail(clientEmail, ratingIdentificator);

		res.status(200).json(order);
	} catch (e) {
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


