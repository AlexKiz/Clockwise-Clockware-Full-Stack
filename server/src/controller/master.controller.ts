import { Response, Request} from "express"
import db from '../models'
import { Op } from 'sequelize'


export const postMaster = async (req: Request, res: Response)  => {

    try {
        const { name, citiesId } = req.body

            const createdMaster = await db.Master.create({ name })

            const citiesOfMaster = await createdMaster.setCities(citiesId)

        res.status(201).json(createdMaster)

    } catch(error) {

        res.status(500).send(error)
    }
}


export const getMasters = async (req: Request, res: Response) => {

        const readMasters = await db.Master.findAll({
            attributes: ['id', 'name', 'rating'],
            include: {
                model: db.City,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }
        })

        res.status(200).json(readMasters)
}


export const getAvailableMasters = async (req: Request, res: Response) => {
        
    try {
        const { currentOrderId, cityId, startWorkOn, endWorkOn } = req.query

                let readBookedMasters

                if(currentOrderId) {

                    readBookedMasters = await db.Order.findAll({
                        attributes: ['masterId'],
                        where: {
                            [Op.or]: [ 
                                {
                                    [Op.and]: [ 
                                        { startWorkOn: { [Op.lte]: startWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: startWorkOn } } 
                                    ] 
                                }, 
                                {
                                    [Op.and]: [
                                        { startWorkOn: { [Op.lte]: endWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: endWorkOn } } 
                                    ] 
                                } 
                            ],
                            id : {
                                [Op.not]: currentOrderId
                            } 
                        }
                    })

                } else {

                    readBookedMasters = await db.Order.findAll({
                        attributes: ['masterId'],
                        where: {
                            [Op.or]: [ 
                                {
                                    [Op.and]: [ 
                                        { startWorkOn: { [Op.lte]: startWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: startWorkOn } } 
                                    ] 
                                }, 
                                {
                                    [Op.and]: [
                                        { startWorkOn: { [Op.lte]: endWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: endWorkOn } } 
                                    ] 
                                } 
                            ]
                        }
                    })

                }

                const bookedMastersId = readBookedMasters.map((master: any) => master.masterId)

                const readAvailableMasters = await db.Master.findAll({ 
                    where: {
                        id: { [Op.notIn]: bookedMastersId }
                    },
                    include: {
                        model: db.City,
                        attributes: [],
                        where: { id: cityId }
                    }
                })

                res.status(200).json(readAvailableMasters)

    } catch(error) {

        res.status(500).send()
    }
}


export const putMaster = async (req: Request, res: Response) => {
        
    try {
        const { id, name, citiesId } = req.body

        const [rows, updatedMaster] = await db.Master.update({ name }, {where:{ id }, returning: true})
        
        if (updatedMaster.length) {
            const updateCitiesOfMaster = await updatedMaster[0].setCities(citiesId)

        res.status(200).json(updatedMaster)
        }

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteMaster = async (req: Request, res: Response) => {

    try {
        const { id } = req.body

        const deleteMaster = await db.Master.deleteById(id)

        res.status(204).json(deleteMaster)

    } catch(error) {

        res.status(500).send()
    }
}



