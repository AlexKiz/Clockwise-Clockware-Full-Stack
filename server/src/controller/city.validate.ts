import { VALID } from '../../data/constants/systemConstants';
import { Response, Request, NextFunction } from "express"
import db from '../db'


export const postCityValidate = async (req: Request, res: Response, next: NextFunction) => {

    const { name } = req.body 

    const validationErrors: string[] = []

    const allCitiesName = await db.query('SELECT name FROM cities')

    if (allCitiesName.rows.length) {

        allCitiesName.rows.map((elem) => {

            if(name.toLowerCase().includes(elem.name.toLowerCase())) {

                validationErrors.push('City with similar name already exists')
            }

        })

    }

    if(!VALID.CITY_NAME.test(name)) {

        validationErrors.push('Invalid city name')
    }

    if(validationErrors.length) {
        
        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


export const putCityValidate = async (req: Request, res: Response, next: NextFunction) => {
    
    const { id, name } = req.body

    const validationErrors: string[] = []

    const validCity = await db.query('SELECT * FROM cities WHERE id = $1', [id])

    if(!validCity.rows.length) {

        validationErrors.push('City with current id does not exist')
    }

    if(!VALID.CITY_NAME.test(name)) {

        validationErrors.push('Invalid city name')
    }

    if(validationErrors.length) {
        
        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


export const deleteCityValidate = async (req: Request, res: Response, next: NextFunction) => {
    
    const { id } = req.body 

    const validationErrors :string[] = []

    const validCity = await db.query('SELECT * FROM cities WHERE id = $1', [id])

    if(!validCity.rows.length) {

        validationErrors.push('City with current id does not exist')
    }

    if(validationErrors.length) {
        
        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}

