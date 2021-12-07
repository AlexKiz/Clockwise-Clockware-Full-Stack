import { Response, Request} from "express"
import db from '../models'
import { Op } from 'sequelize'


export const postMaster = async (req: Request, res: Response)  => {

    try {
        const { name, citiesId } = req.body

            const createMaster = await db.master.create({ name })

            const citiesOfMaster = await createMaster.setCities(citiesId)

        res.status(201).json(createMaster)

    } catch(error) {

        res.status(500).send(error)
    }
}


export const getMasters = async (req: Request, res: Response) => {

        const readMasters = await db.master.findAll({
            attributes: ['id', 'name', 'rating'],
            include: {
                model: db.city,
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
                console.log(startWorkOn, endWorkOn);
                
                let readBookedMasters

                if(currentOrderId) {

                    readBookedMasters = await db.order.findAll({
                        attributes: ['masterId'],
                        where: {
                            [Op.or]: [ 
                                {
                                    [Op.and]: [ 
                                        { startWorkOn: {[Op.lte]: compareStartWorkOn} }, 
                                        { endWorkOn:   {[Op.gte]: compareStartWorkOn} } 
                                    ] 
                                }, 
                                {
                                    [Op.and]: [
                                        { startWorkOn: { [Op.lte]: compareEndWorkOn } }, 
                                        { endWorkOn:   { [Op.gte]: compareEndWorkOn } } 
                                    ] 
                                } 
                            ],
                            id : currentOrderId 
                        }
                    })

                } else {

                    readBookedMasters = await db.order.findAll({
                        attributes: ['masterId'],
                        where: {
                            [Op.or]: [ 
                                {
                                    [Op.and]: [ 
                                        { startWorkOn: {[Op.lte]: compareStartWorkOn} }, 
                                        { endWorkOn:   {[Op.gte]: compareStartWorkOn} } 
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

                const readAvailableMasters = await db.master.findAll({ 
                    where: {
                        id: { [Op.notIn]: bookedMastersId }
                    },
                    include: {
                        model: db.city,
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

        const [rows, updateMaster] = await db.master.update({ name }, {where:{ id }, returning: true})
        
        const updateCitiesOfMaster = await updateMaster[0].setCities(citiesId)

        res.status(200).json(updateMaster)

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteMaster = async (req: Request, res: Response) => {

    try {
        const { id } = req.body

        const deleteMaster = await db.master.deleteById(id)

        res.status(204).json(deleteMaster)

    } catch(error) {

        res.status(500).send()
    }
}



