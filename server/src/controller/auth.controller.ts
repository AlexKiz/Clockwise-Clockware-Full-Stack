import {METHOD} from './../../data/constants/systemConstants';
import {Response, Request, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models';


export const auth = async (req: Request, res: Response) => {
	try {
		
	const {userLogin, userPassword} = req.body;

	const user = await db.User.findOne({where: {email: userLogin}});

	if (!user) {
		return res.status(400).json({message: 'Wrong data'})
	} 

	const {password: hashPass, role: userRole, id: userId, isVerified: verify, name: userName} = user;

	if(!verify) {
		res.status(400).json({message: 'You need to verify your email first!'})
	}

	const isCompare = await bcrypt.compare(userPassword, hashPass);

	if (!isCompare) {
		res.status(400).json({message: 'Wrong login or password'});
	}

	const accessToken = jwt.sign({userRole}, `${process.env.PRIVATE_KEY}`, {expiresIn: '4h'});

	await db.User.updateById(userId, {token: accessToken})

	res.set({Authorization: `Bearer ${accessToken}`}).status(200).json({message: 'Successfully authorizated!', data:{ role: userRole, userName}});

	} catch(e) {
		res.status(400).json({message: 'Login error'})
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
	return function (req: Request, res: Response, next: NextFunction) {

		if (req.method === METHOD) {
			return next();
		}
	
		try {
			const authorization = req.headers.authorization;
	
			if (!authorization) {
				return res.status(401).send();
			}
	
			const accessToken = authorization.split(' ')[1];
			const decoded = jwt.verify(accessToken, `${process.env.PRIVATE_KEY}`);

			const checkingRole:string = (<any>decoded).userRole; 

			let hasRole = false;

			roles.forEach( role => {
				if (role.includes(checkingRole)) {
					hasRole = true
				}
			})

			if (!hasRole) {
				return res.status(403).json({message: 'You do not have permission!'})
			}

			next();
	
		} catch (error) {
			res.status(404).send();
		}
	}
}

export const authorizationRole = async (req: Request, res: Response) => {
	try {
		const { token } = req.query

		const userRole = await db.User.findOne({
			attributes: ['role'],
			where: token
		})

		res.status(200).json(userRole)
	} catch(e) {
		res.status(500).send()
	}
}