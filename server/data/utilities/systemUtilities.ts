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

export const rolesMappingCreate: any = {
	'master': createMaster,
	'client': createClient,
};
