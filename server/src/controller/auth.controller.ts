import {METHOD} from './../../data/constants/systemConstants';
import {Response, Request, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models';
import {BearerParser} from 'bearer-token-parser';


export const auth = async (req: Request, res: Response) => {
	try {
		const {login, password} = req.body;

		const user = await db.User.findOne({where: {email: login}});

		if (!user) {
			return res.status(400).json({message: 'Wrong data'});
		}

		const {password: hashPass, role, id, isVerified: verify, name} = user;

		if (!verify) {
			return res.status(400).json({message: 'You need to verify your email first!'});
		}

		const isCompare = await bcrypt.compare(password, hashPass);

		if (!isCompare) {
			return res.status(400).json({message: 'Wrong login or password'});
		}

		const accessToken = jwt.sign({role, name}, `${process.env.PRIVATE_KEY}`, {expiresIn: '4h'});

		await db.User.updateById(id, {token: accessToken});

		res.set({
			Authorization: `Bearer ${accessToken}`,
		}).status(200).json({message: 'Successfully authorizated!', role, name});
	} catch (e) {
		res.status(400).json({message: 'Login error'});
	}
};


export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (req.method === METHOD) {
		return next();
	}

	try {
		const authorization = req.headers.authorization;

		if (!authorization) {
			return res.status(401).send();
		}

		const accessToken = authorization.split(' ')[1];
		jwt.verify(accessToken, `${process.env.PRIVATE_KEY}`);
		next();
	} catch (error) {
		res.status(404).send();
	}
};


export const checkRole = (roles: string[]) => {
	return function(req: Request, res: Response, next: NextFunction) {
		if (req.method === METHOD) {
			return next();
		}

		try {
			const accessToken = BearerParser.parseBearerToken(req.headers);
			const decoded: string | jwt.JwtPayload = jwt.verify(accessToken, `${process.env.PRIVATE_KEY}`);

			const checkingRole: string = (<JwtPayload>decoded).role;

			let hasRole = false;

			roles.forEach( (role) => {
				if (role.includes(checkingRole)) {
					hasRole = true;
				}
			});

			if (!hasRole) {
				return res.status(403).json({message: 'You do not have permission!'});
			}

			next();
		} catch (error) {
			res.status(404).send();
		}
	};
};
