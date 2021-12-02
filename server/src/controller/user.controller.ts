import { Response, Request } from "express"
import { User } from '../models/Models'


export const postUser = async (req: Request, res: Response) => {

    try {
        const { name, email } = req.body

        const createUser = await User.create({
            name: name,
            email: email
        })

        res.status(201).json(createUser)

    } catch(error) {
        
        res.status(500).send()
    }
}


export const getUsers = async (req: Request, res: Response) => {

    try {

        const readUsers = await User.findAll()

        res.status(200).json(readUsers)

    } catch(error) {

        res.status(500).send()
    }
}


export const putUser = async (req: Request, res: Response) => {

    try {
        const { id, name, email } = req.body

        const userChecking = await User.findOne({
            attributes: ['id'],
            where: {
                email: email
            }
        })

        if ((!userChecking) || (userChecking.id === +id)) {

            const updateUser = await User.update({
                name: name,
                email: email
            },{
                where: {
                    id: id
                }
            })

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

        const deleteUser = await User.destroy({
            where: {
                id: id
            }
        })
        
        res.status(204).json(deleteUser)

    } catch(error) {

        res.status(500).send()
    }
}