import { Response, Request } from "express"
import db from '../db'


export const postUser = async (req: Request, res: Response) => {

    try {
        const {name, email} = req.body

        const createUser = await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email])

        res.status(201).json(createUser.rows)

    } catch(error) {
        
        res.status(500).send()
    }
}


export const getUser = async (req: Request, res: Response) => {

    try {
        const readUser = await db.query('SELECT id as "userId", name as "userName", email as "userEmail" FROM users')

        res.status(200).json(readUser.rows)

    } catch(error) {

        res.status(500).send()
    }
}


export const putUser = async (req: Request, res: Response) => {

    try {
        const {id, name, email} = req.body

        const userChecking = await db.query('SELECT id FROM users WHERE email = $1', [email])

        if ((!userChecking.rows.length) || (userChecking.rows[0].id === +id)) {

            const updateUser = await db.query('UPDATE users SET name = $2, email = $3 WHERE id = $1', [id, name, email])

            res.status(200).json(updateUser.rows)

        } else {

            res.status(400).send('User with current email exists')
        }

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteUser = async (req: Request, res: Response) => {

    try {
        const {id} = req.body

        const deleteUser = await db.query('DELETE FROM users WHERE id = $1', [id])
        
        res.status(204).json(deleteUser.rows)

    } catch(error) {

        res.status(500).send()
    }
}