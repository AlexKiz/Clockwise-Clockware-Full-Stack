import { Response, Request, NextFunction } from "express" 
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Admin } from '../models/Models'


export const Auth = async (req: Request, res: Response) => {

    const { adminLogin, adminPassword } = req.body 
    
    const credentials = await Admin.findOne({
        where: {
            email: adminLogin
        }
    })
    
    if(credentials) {

        const hashPass = credentials.password
        const isCompare = await bcrypt.compare(adminPassword,hashPass)

        if(isCompare) {
            
            const accessToken = jwt.sign({}, `${process.env.PRIVAT_KEY}`, {expiresIn: '2h'})
            
            res.set({Authorization: `Bearer ${accessToken}`}).status(200).json({message: "Successfully authorizated!"})

        } else {

            res.status(400).send('Wrong login or password')
        }

    } else { 

        res.status(400).send('Wrong data')
    }
}


export const isAuth = async (req: Request, res: Response, next: NextFunction) => {

    if(req.method === 'OPTIONS') {

        return next()
    }

    try {
        if(req.headers.authorization) {

            const accessToken = req.headers.authorization.split(' ')[1]
            jwt.verify(accessToken, `${process.env.PRIVAT_KEY}`)
            next()
            
        } else {
            
            res.status(401).send()
        }
        
    } catch(error) {
        
        res.status(404).send()
    }
}
