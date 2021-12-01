import { Response, Request, NextFunction } from "express"
import { VALID } from "../../data/constants/systemConstants"
import db from '../db'


export const postOrderValidate = async(req: Request, res: Response, next: NextFunction) => {

    const {clock_id, city_id, master_id, start_work_on, name, email} = req.body

    const validationErrors = []

    const validClocksId = await db.query('SELECT * FROM clocks WHERE id = $1', [clock_id])

    if(!validClocksId.rows.length) {

        validationErrors.push('Clocks with current id does not exist')

    }

    const validCityId = await db.query('SELECT * FROM cities WHERE id = $1', [city_id])

    if(!validCityId.rows.length) {

        validationErrors.push('City with current id does not exist')

    }

    const validMasterId = await db.query('SELECT * FROM masters WHERE id = $1', [master_id])

    if(!validMasterId.rows.length) {

        validationErrors.push('Master with current id does not exist')

    }

    if(!VALID.DATE.test(start_work_on)) {

        validationErrors.push('Invalid date')

    }

    if(!VALID.USER_NAME.test(name)) {

        validationErrors.push('Invalid user name')

    }

    if(!VALID.USER_EMAIL.test(email)) {

        validationErrors.push('Invalid user email')

    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


export const putOrderValidate = async(req: Request, res: Response, next: NextFunction) => {

    const {id, clock_id, user_id, city_id, master_id, start_work_on} = req.body

    const validationErrors = []

    const validOrder = await db.query('SELECT * FROM orders WHERE id = $1', [id])

    if(!validOrder.rows.length) {

        validationErrors.push('Order with current id does not exist')

    }

    const validClocksId = await db.query('SELECT * FROM clocks WHERE id = $1', [clock_id])

    if(!validClocksId.rows.length) {

        validationErrors.push('Clocks with current id does not exist')

    }

    const validUserId = await db.query('SELECT * FROM users WHERE id = $1', [user_id])

    if(!validUserId.rows.length) {

        validationErrors.push('User with current id does not exist')

    }

    const validCityId = await db.query('SELECT * FROM cities WHERE id = $1', [city_id])

    if(!validCityId.rows.length) {

        validationErrors.push('City with current id does not exist')

    }

    const validMasterId = await db.query('SELECT * FROM masters WHERE id = $1', [master_id])

    if(!validMasterId.rows.length) {

        validationErrors.push('Master with current id does not exist')

    }
    
    if(!VALID.DATE.test(start_work_on)) {

        validationErrors.push('Invalid date')
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


export const putRatedOrderValidate = async(req: Request, res: Response, next:NextFunction) => {

    const { id, order_rated, master_id } = req.body

    const validationErrors: string[] = []

    const validOrder = await db.query('SELECT * FROM orders WHERE id = $1', [id])

    if(!validOrder.rows.length) {

        validationErrors.push('Order with current id does not exist')
    }

    const validMasterId = await db.query('SELECT * FROM masters WHERE id = $1', [master_id])
    
    if(!validMasterId.rows.length) {

        validationErrors.push('Master with current id does not exist')
    }

    if(order_rated < 0 || order_rated > 5) {

        validationErrors.push('Order rating must be from 0 to 5 range')
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)
    } else {

        return next()
    }

}


export const deleteOrderValidate = async(req: Request, res: Response, next: NextFunction) => {

    const { id } = req.body

    const validationErrors: string[] = []

    const validOrder = await db.query('SELECT * FROM orders WHERE id = $1', [id])

    if(!validOrder.rows.length) {

        validationErrors.push('Order with current id does not exist')

    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}