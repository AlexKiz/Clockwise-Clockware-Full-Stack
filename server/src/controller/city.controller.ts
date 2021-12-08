import { Request, Response } from "express"
import db from '../models'


export const postCity = async (req: Request, res: Response) => {

    try {
        const { name } = req.body

        const createdCity = await db.City.create({ name })
        
        res.status(201).json(createdCity)

    } catch(error) {
        
        res.status(500).send()
    }
    
}


export const getCities = async (req: Request, res: Response) => {

    const readCities = await db.City.findAll()

    res.status(200).json(readCities)
}


export const getCitiesForOrder = async (req: Request, res: Response) => {

    const readCitiesForOrder = await db.City.findAll({
        include: {
            model: db.Master,
            attributes: [],
            required: true
        }
    })

    res.status(200).json(readCitiesForOrder)

}


export const putCity = async (req: Request, res: Response) => {

    try {
        const { id, name } = req.body

        const updateCity = await db.City.updateById(id, { name })

        res.status(200).json(updateCity)

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteCity = async (req: Request, res: Response) => {

    try {
        const { id } = req.body

        const deleteCity = await db.City.deleteById(id)

        res.status(204).json(deleteCity)

    } catch(error) {

        res.status(500).send()
    }
} 


