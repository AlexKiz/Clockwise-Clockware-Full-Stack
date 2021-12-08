import { Response, Request } from "express"
import db from '../models'


export const postUser = async (req: Request, res: Response) => {

    try {
        const { name, email } = req.body

        const createUser = await db.User.create({ name, email })

        res.status(201).json(createUser)

    } catch(error) {
        
        res.status(500).send()
    }
}


export const getUsers = async (req: Request, res: Response) => {
    
    const readUsers = await db.User.findAll()

    res.status(200).json(readUsers)
}


export const putUser = async (req: Request, res: Response) => {

    try {
        const { id, name, email } = req.body

        const userChecking = await db.User.findOne({
            attributes: ['id'],
            where: { email }
        })

        if ((!userChecking) || (userChecking.id === +id)) {

            const updateUser = await db.User.updateById(id, { name, email })

            res.status(200).json(updateUser)

        } else {

            res.status(400).send('User with current email exists')
        }

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteUser = async (req: Request, res: Response) => {

    try {
        const { id } = req.body

        const deleteUser = await db.User.deleteById(id)
        
        res.status(204).json(deleteUser)

    } catch(error) {

        res.status(500).send()
    }
}