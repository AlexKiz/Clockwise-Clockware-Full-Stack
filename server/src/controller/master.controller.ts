import { Response, Request} from "express"
import db from '../models'
import { Op } from 'sequelize'


export const postMaster = async (req: Request, res: Response)  => {

    try {
        const { name, citiesId } = req.body

            const createMaster = await db.Master.create({ name })

            const citiesOfMaster = await createMaster.setCities(citiesId)

        res.status(201).json(createMaster)

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

                const compareStartWorkOn = `${startWorkOn}`
                const compareEndWorkOn = `${endWorkOn}`   
                
                let readBookedMasters

                if(currentOrderId) {

                    readBookedMasters = await db.Order.findAll({
                        attributes: ['masterId'],
                        where: {
                            [Op.or]: [ 
                                {
                                    [Op.and]: [ 
                                        { startWorkOn: { [Op.lte]: compareStartWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: compareStartWorkOn } } 
                                    ] 
                                }, 
                                {
                                    [Op.and]: [
                                        { startWorkOn: { [Op.lte]: compareEndWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: compareEndWorkOn } } 
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
                                        { startWorkOn: { [Op.lte]: compareStartWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: compareStartWorkOn } } 
                                    ] 
                                }, 
                                {
                                    [Op.and]: [
                                        { startWorkOn: { [Op.lte]: compareEndWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: compareEndWorkOn } } 
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

        const [rows, updateMaster] = await db.Master.update({ name }, {where:{ id }, returning: true})
        
        const updateCitiesOfMaster = await updateMaster[0].setCities(citiesId)

        res.status(200).json(updateMaster)

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



