import {Response, Request} from 'express';
import db from '../models';
import bcrypt from 'bcrypt';
import {rolesMappingCreate} from './../../data/utilities/systemUtilities';


export const userRegistration = async (req: Request, res: Response) => {
	try {
		const {name, email, password, citiesId, role} = req.body;

		const salt = bcrypt.genSaltSync(10);
		const hashPassword = bcrypt.hashSync(password, salt);
		const hashForVerification = bcrypt.hashSync(`${name}${email}`, salt);
		const hashVerify = hashForVerification.replace(/\//g, 'i');

		const user = await rolesMappingCreate[role](name, email, hashPassword, hashVerify, citiesId);

		res.status(201).json(user);
	} catch (error) {
		res.status(500).send();
	}
};


export const getUsers = async (req: Request, res: Response) => {
	const users = await db.User.findAll({where: {role: 'client'}});

	res.status(200).json(users);
};


export const putUser = async (req: Request, res: Response) => {
	try {
		const {id, name, email} = req.body;

		const userChecking = await db.User.findOne({
			attributes: ['id'],
			where: {email},
		});

		if ((!userChecking) || (userChecking.id === id)) {
			const user = await db.User.updateById(id, {name, email});

			res.status(200).json(user);
		} else {
			res.status(400).send('User with current email exists');
		}
	} catch (error) {
		res.status(500).send();
	}
};


export const userVerification = async (req: Request, res: Response) => {
	try {
		const {hashVerify, password} = req.body;

		if (password) {
			const salt = bcrypt.genSaltSync(10);
			const hashPassword = bcrypt.hashSync(password, salt);
			const userVerify = await db.User.update(
				{hashVerify: '', isVerified: true, password: hashPassword},
				{where: {hashVerify}},
			);
			return res.status(200).json(userVerify);
		}

		const userVerify = await db.User.update({hashVerify: '', isVerified: true}, {where: {hashVerify}});

		res.status(200).json(userVerify);
	} catch (error) {
		res.status(500).send();
	}
};


export const deleteUser = async (req: Request, res: Response) => {
	try {
		const {id} = req.body;

		const user = await db.User.deleteById(id);

		res.status(204).json(user);
	} catch (error) {
		res.status(500).send();
	}
};
