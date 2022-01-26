import {Op} from 'sequelize';
import db from '../../src/models';
import {sendVerificationMail} from '../../src/services/nodemailer';

const createMaster = async (name: string, email: string, password: string, hashVerify: string, citiesId: number[]) => {
	const transaction = await db.sequelize.transaction();
	try {
		const master = await db.Master.create({name}, {transaction});
		master.setCities(citiesId, {transaction});

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
		attributes: ['id', 'startWorkOn', 'endWorkOn', 'ratingIdentificator', 'isCompleted', ['orderImages', 'images']],
		order: [[db.sequelize.col(`${params.sortedField}`), `${params.sortingOrder}`]],
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
		limit: params.limit,
		offset: params.offset,
		where: params.filterOptions,
	});

	return orders;
};

const getMasterOrders = async (params: roleMappingOrderGetParams) => {
	const orders = await db.Order.findAll({
		order: [['startWorkOn', 'DESC']],
		attributes: ['id', 'startWorkOn', 'endWorkOn', 'ratingIdentificator', 'isCompleted', ['orderImages', 'images']],
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
			masterId: params.masterId,
		},
	});

	return orders;
};

const getClientOrders = async (params: roleMappingOrderGetParams) => {
	const orders = await db.Order.findAll({
		order: [['startWorkOn', 'DESC']],
		attributes: ['id', 'startWorkOn', 'endWorkOn', 'ratingIdentificator', 'isCompleted', 'orderRating'],
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
