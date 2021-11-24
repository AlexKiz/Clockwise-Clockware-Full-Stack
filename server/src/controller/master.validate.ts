import { Response, Request, NextFunction } from "express"
import db from '../db'

const validName = new RegExp(/^[A-Za-zА-Яа-я]{3,49}$|^[A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50}$/)


export const postMasterValidate = async(req: Request, res: Response, next: NextFunction) => {

    const {name, cities_id} = req.body

    const validationErrors = []

    if(!validName.test(name)) {

        validationErrors.push('Invalid master name')
    }
    
    const validCityId = await db.query(`SELECT * FROM cities WHERE id IN (${cities_id})`)

    if(!validCityId.rows.length) {

        validationErrors.push('City with current id does not exist')
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


export const putMasterValidate = async(req: Request, res: Response, next: NextFunction) => {
    
    const {id, name, cities_id} = req.body

    const validationErrors = []

    const validMaster = await db.query('SELECT * FROM masters WHERE id = $1', [id])

    if(!validMaster.rows.length) {

        validationErrors.push('Master with current id does not exist')

    }

    if(!validName.test(name)) {

        validationErrors.push('Invalid master name')

    }

    const validCityId = await db.query(`SELECT * FROM cities WHERE id IN (${cities_id})`)

    if(!validCityId.rows.length) {

        validationErrors.push('City with current id does not exist')
    }
    
    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


export const deleteMasterValidate = async(req: Request, res: Response, next: NextFunction) => {

    const { id } = req.body

    const validationErrors = []

    const validMaster = await db.query('SELECT * FROM masters WHERE id = $1', [id])

    if(!validMaster.rows.length) {

        validationErrors.push('Master with current id does not exist', [id])
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}