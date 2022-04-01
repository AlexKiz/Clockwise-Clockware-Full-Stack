import {Op} from 'sequelize';
import db from '../../src/models';
import {sendAutoRegistrationMail, sendSuccessPaymentMail, sendVerificationMail} from '../../src/services/nodemailer';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import Stripe from 'stripe';


const createMaster = async (name: string, email: string, password: string, hashVerify: string, citiesId: number[]) => {
	const transaction = await db.sequelize.transaction();
	try {
		const master = await db.Master.create({name}, {transaction});
		master.setCities(citiesId, {transaction});

		const userCheck = await db.User.findOne({where: {email}});

		const user = await db.User.create({
			name,
			email,
			password,
			role: 'master',
			hashVerify,
			masterId: master.id,
		}, {transaction});

		await sendVerificationMail(email, hashVerify);

		await transaction.commit();

		return user;
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
};

const createClient = async (name: string, email: string, password: string, hashVerify: string, ...arg: any) => {
	const transaction = await db.sequelize.transaction();
	try {
		const user = await db.User.create({name, email, password, role: 'client', hashVerify}, {transaction});
		await sendVerificationMail(email, hashVerify);

		await transaction.commit();

		return user;
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
};

export type filtersOptions = {
	clockId?: number,
	isCompleted?: string,
	masterId?: string,
	cityId?: number,
	startWorkOn?: {[Op.gte]:string},
	endWorkOn?: {[Op.lte]:string}
};

type roleMappingOrderGetParams = {
	limit: number,
	offset: number,
	masterId: string,
	id: string,
	sortedField: string,
	sortingOrder: string,
	filterOptions: filtersOptions,
}

const getAdminOrders = async (params: roleMappingOrderGetParams) => {
	const orders = await db.Order.findAndCountAll({
		attributes: [
			'id',
			'startWorkOn',
			'endWorkOn',
			'ratingIdentificator',
			'isCompleted',
			['orderImages', 'images'],
			'paymentDate',
			'orderAddress',
		],
		order: [[db.sequelize.col(`${params.sortedField}`), `${params.sortingOrder}`]],
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
			{
				model: db.Master,
				attributes: ['id', 'name'],
				required: true,
			},
		],
		limit: params.limit,
		offset: params.offset,
		where: params.filterOptions,
	});

	return orders;
};

const getMasterOrders = async (params: roleMappingOrderGetParams) => {
	const orders = await db.Order.findAll({
		order: [['startWorkOn', 'DESC']],
		attributes: [
			'id',
			'startWorkOn',
			'endWorkOn',
			'ratingIdentificator',
			'isCompleted',
			['orderImages', 'images'],
			'paymentDate',
			'orderAddress',
		],
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
			{
				model: db.Master,
				attributes: ['id', 'name'],
				require: true,
			},
		],
		where: {
			masterId: params.masterId,
		},
	});

	return orders;
};

const getClientOrders = async (params: roleMappingOrderGetParams) => {
	const orders = await db.Order.findAll({
		order: [['startWorkOn', 'DESC']],
		attributes: [
			'id',
			'startWorkOn',
			'endWorkOn',
			'ratingIdentificator',
			'isCompleted',
			'orderRating',
			'orderAddress',
		],
		include: [
			{
				model: db.Clock,
				attributes: ['id', 'size', 'price'],
				required: true,
			},
			{
				model: db.Master,
				attributes: ['id', 'name'],
				required: true,
			},
		],
		where: {
			userId: params.id,
		},
	});

	return orders;
};

export const rolesMappingCreate: any = {
	'master': createMaster,
	'client': createClient,
};

export const rolesMappingGetOrders: any = {
	'admin': getAdminOrders,
	'master': getMasterOrders,
	'client': getClientOrders,
};

export const postOrder = async (params: Stripe.Metadata | null) => {
	try {
		if (params) {
			const {
				name,
				email,
				clockId,
				cityId,
				masterId,
				startWorkOn,
				endWorkOn,
				orderImages,
				orderAddress,
			} = params;
			const generatedPassword = uuidv4();
			const salt = bcrypt.genSaltSync(10);
			const hashForVerification = bcrypt.hashSync(`${name}${email}`, salt);
			const hashVerify = hashForVerification.replace(/\//g, 'i');

			const [user, isUserCreated] = await db.User.findOrCreate({
				where: {email},
				defaults: {name, email, password: generatedPassword, role: 'client', hashVerify},
			});

			if (isUserCreated) {
				await sendAutoRegistrationMail(email, hashVerify, generatedPassword);
			} else {
				await sendSuccessPaymentMail(email);
			}

			const {id: userId} = user;

			const paymentDate = new Date().toISOString();

			const ratingIdentificator = uuidv4();

			const order = await db.Order.create({
				clockId,
				userId,
				cityId,
				masterId,
				startWorkOn,
				endWorkOn,
				ratingIdentificator,
				paymentDate,
				orderImages,
				orderAddress,
			});

			return order;
		}
	} catch (error) {
		return error;
	}
};


export const createReceiptBody = (
	clockSize: string,
	masterName: string,
	masterEmail: string,
	startWorkOn: string,
	endWorkOn: string,
	price: number,
	clientName: string,
	clientEmail: string) => {
	return {
		content: [
			{
				style: 'header',
				text: 'Order Receipt',
			},
			{
				style: 'defaultStyle',
				columns: [{width: 'auto', text: 'Service:'},
					{width: 'auto', text: `Repair clock with ${clockSize} size`}],
				columnGap: 76,
			},
			{
				style: 'defaultStyle',
				columns: [{width: 'auto', text: 'Master name:'},
					{width: 'auto', text: `${masterName}`}],
				columnGap: 34,
			},
			{
				style: 'defaultStyle',
				columns: [{width: 'auto', text: 'Master email:'},
					{width: 'auto', text: `${masterEmail}`}],
				columnGap: 34,
			},
			{
				style: 'defaultStyle',
				columns: [{width: 'auto', text: 'Starting date:'},
					{width: 'auto', text: `${startWorkOn}`}],
				columnGap: 35,
			},
			{
				style: 'defaultStyle',
				columns: [{width: 'auto', text: 'Completed date:'},
					{width: 'auto', text: `${endWorkOn}`}],
				columnGap: 14,
			},
			{
				style: 'defaultStyle',
				columns: [{width: 'auto', text: 'Paid amount:'}, {width: 'auto', text: `${price*10} $`}],
				columnGap: 38,
			},
			{
				style: 'defaultStyle',
				columns: [{width: 'auto', text: 'Client full name:'},
					{width: 'auto', text: `${clientName}`}],
				columnGap: 16,
			},
			{
				style: 'defaultStyle',
				columns: [{width: 'auto', text: 'Client email:'},
					{width: 'auto', text: `${clientEmail}`}],
				columnGap: 42,
			},
		],
		styles: {
			header: {
				fontSize: 24,
				bold: true,
				lineHeight: 2,
			},
		},
		defaultStyle: {
			font: 'Times',
			fontSize: 16,
			lineHeight: 1.8,
		},
	};
};

