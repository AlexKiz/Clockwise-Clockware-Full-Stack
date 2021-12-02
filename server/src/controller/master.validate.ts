import { Response, Request, NextFunction } from "express"
import { VALID } from "../../data/constants/systemConstants"
import { City, Master } from '../models/Models'


export const postMasterValidate = async(req: Request, res: Response, next: NextFunction) => {

    const { name, cities_id } = req.body

    const validationErrors: string[] = []

    if(!VALID.MASTER_NAME.test(name)) {

        validationErrors.push('Invalid master name')
    }
    
    const validCityId = await City.findAll({
        where: {
            id: cities_id
        }
    })

    if(!validCityId.length) {

        validationErrors.push('Cities with current ids does not exist')
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


export const putMasterValidate = async(req: Request, res: Response, next: NextFunction) => {
    
    const { id, name, cities_id } = req.body

    const validationErrors: string[] = []

    const validMaster = await Master.findAll({
        where: {
            id: id
        }
    })

    if(!validMaster.length) {

        validationErrors.push('Master with current id does not exist')

    }

    if(!VALID.MASTER_NAME.test(name)) {

        validationErrors.push('Invalid master name')

    }

    const validCityId = await City.findAll({
        where: {
            id: cities_id
        }
    })

    if(!validCityId.length) {

        validationErrors.push('Cities with current ids does not exist')
    }
    
    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


export const deleteMasterValidate = async(req: Request, res: Response, next: NextFunction) => {

    const { id } = req.body

    const validationErrors: string[] = []

    const validMaster = await Master.findAll({
        where: {
            id: id
        }
    })

    if(!validMaster.length) {

        validationErrors.push('Master with current id does not exist')
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}