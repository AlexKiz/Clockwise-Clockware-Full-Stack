import {METHOD} from './../../data/constants/systemConstants';
import {Response, Request, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models';


export const Auth = async (req: Request, res: Response) => {
	try {
		
	const {userLogin, userPassword} = req.body;

	const user = await db.User.findOne({where: {email: userLogin}});

	if (!user) {
		return res.status(400).json({message: 'Wrong data'})
	} 

	const {password: hashPass, role: userRole, id: userId} = user;
	const isCompare = await bcrypt.compare(userPassword, hashPass);

	if (!isCompare) {
		res.status(400).send('Wrong login or password');
	}

	const accessToken = jwt.sign({userId, userRole}, `${process.env.PRIVATE_KEY}`, {expiresIn: '4h'});

	res.set({Authorization: `Bearer ${accessToken}`}).status(200).json({message: 'Successfully authorizated!'});

	} catch(e) {
		res.status(400).json({message: 'Login error'})
	}
};


export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (req.method === METHOD) {
		return next();
	}
	const authorization = req.headers.authorization;
	try {
		if (authorization) {
			const accessToken = authorization.split(' ')[1];
			jwt.verify(accessToken, `${process.env.PRIVATE_KEY}`);
			next();
		} else {
			res.status(401).send();
		}
	} catch (error) {
		res.status(404).send();
	}
};
