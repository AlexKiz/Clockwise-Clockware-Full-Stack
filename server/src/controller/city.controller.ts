import { Request, Response } from "express"
import { City, Master } from '../models/Models'


export const postCity = async (req: Request, res: Response) => {

    try {
        const { name } = req.body

        const createdCity = await City.create({
            name: name 
        })
        
        res.status(201).json(createdCity)

    } catch(error) {
        
        res.status(500).send()
    }
    
}


export const getCities = async (req: Request, res: Response) => {

    try {

        const readCities = await City.findAll()

        res.status(200).json(readCities)

    } catch(error) {

        res.status(500).send()
    }
}


export const getCitiesForOrder = async (req: Request, res: Response) => {

    try {

        const readCitiesForOrder = await City.findAll({
            include: {
                model: Master,
                attributes: [],
                required: true
            }
        })

        res.status(200).json(readCitiesForOrder)

    } catch(error) {

        res.status(500).send()
    }
}


export const putCity = async (req: Request, res: Response) => {

    try {
        const { id, name } = req.body

        //const updateCity = await db.query('UPDATE cities SET name = $2 WHERE id = $1', [id, name])

        const updateCity = await City.update({
            name: name
        }, {
            where: {
                id: id
            }
        })

        res.status(200).json(updateCity)

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteCity = async (req: Request, res: Response) => {

    try {
        const { id } = req.body

        //const deleteMasterCities = await db.query('DELETE FROM masters_cities WHERE city_id = $1', [id])

        //const deleteCity = await db.query('DELETE FROM cities WHERE id = $1', [id])

        const deleteCity = await City.destroy({
            where: {
                id: id
            }
        })

        

        res.status(204).json(deleteCity)

    } catch(error) {

        res.status(500).send()
    }
} 


