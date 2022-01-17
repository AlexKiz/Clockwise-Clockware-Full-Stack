import db from '../../src/models';
import {sendVerificationMail} from '../../src/services/nodemailer';

const createMaster = async (name: string, email: string, password: string, hashVerify: string, citiesId: number[]) => {
	const master = await db.Master.create({name});
	master.setCities(citiesId);

	const user = await db.User.create({name, email, password, role: 'master', hashVerify, masterId: master.id});
	await sendVerificationMail(email, hashVerify);
	return user;
};

const createClient = async (name: string, email: string, password: string, hashVerify: string, ...arg:any) => {
	const user = await db.User.create({name, email, password, role: 'client', hashVerify});
	await sendVerificationMail(email, hashVerify);
	return user;
};

export const rolesMappingCreate: any = {
	'master': createMaster,
	'client': createClient,
};
