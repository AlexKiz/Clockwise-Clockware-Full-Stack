import { Response, Request} from "express"
import { Master, City, Clock, Order, MasterCities } from '../models/Models'
import { Op } from 'sequelize'


export const postMaster = async (req: Request, res: Response)  => {

    try {
        const { name, cities_id } = req.body

            const createMaster = await Master.create({
                name: name
            })

            const citiesOfMaster = await createMaster.setCities(cities_id)

        res.status(201).json(createMaster)

    } catch(error) {

        res.status(500).send(error)
    }
}


export const getMasters = async (req: Request, res: Response) => {

    try {

        const readMasters = await Master.findAll({
            attributes: ['id', 'name', 'rating'],
            include: {
                model: City,
                
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                },   
            }
        })

        res.status(200).json(readMasters)
        
    } catch(error) {

        res.status(500).send(error)
    }
}


export const getAvailableMasters = async (req: Request, res: Response) => {
        
    try {
        const { currentOrderId, city_id, start_work_on, clock_id } = req.query

                const installationDuration = await Clock.findOne({
                    attributes: ['installation_time'],
                    where: {
                        id: clock_id
                    }
                })

                if(installationDuration) {

                    const { installation_time } = installationDuration

                    let endDate = new Date(`${start_work_on}`)
                    let startDate = new Date(`${start_work_on}`)
                    startDate.setUTCHours(startDate.getHours())
                    endDate.setUTCHours(endDate.getHours() + installation_time)
                    const endWorkOn = endDate.toISOString()
                    const startWorkOn = startDate.toISOString()
                
                let readBookedMasters

                if(currentOrderId) {

                    readBookedMasters = await Order.findAll({
                        attributes: ['master_id'],
                        where: {
                            [Op.or]: [ 
                                {
                                    [Op.and]: [ 
                                        { start_work_on: {[Op.lte]: startWorkOn} }, 
                                        { end_work_on:   {[Op.gte]: startWorkOn} } 
                                    ] 
                                }, 
                                {
                                    [Op.and]: [
                                        { start_work_on: { [Op.lte]: endWorkOn } }, 
                                        { end_work_on:   { [Op.gte]: endWorkOn } } 
                                    ] 
                                } 
                            ],
                            id : currentOrderId 
                        }
                    })

                } else {

                    readBookedMasters = await Order.findAll({
                        attributes: ['master_id'],
                        where: {
                            [Op.or]: [ 
                                {
                                    [Op.and]: [ 
                                        { start_work_on: {[Op.lte]: startWorkOn} }, 
                                        { end_work_on:   {[Op.gte]: startWorkOn} } 
                                    ] 
                                }, 
                                {
                                    [Op.and]: [
                                        { start_work_on: { [Op.lte]: endWorkOn } }, 
                                        { end_work_on:   { [Op.gte]: endWorkOn } } 
                                    ] 
                                } 
                            ]
                        }
                    })

                }

                const bookedMastersId = readBookedMasters.map(master => master.master_id)

                const readAvailableMasters = await Master.findAll({ 
                    where: {
                        id: { [Op.notIn]: bookedMastersId}
                    },
                    include: {
                        model: City,
                        attributes: [],
                        where: {
                            id: city_id
                        }
                    }
                })

                res.status(200).json(readAvailableMasters)
            }

    } catch(error) {

        res.status(500).send()
    }
}


export const putMaster = async (req: Request, res: Response) => {
        
    try {
        const { id, name, cities_id } = req.body

        const [rows, updateMaster] = await Master.update({
            name: name,
        }, {
            where: {
                id: id
            },
            returning: true
        })
        
        const updateCitiesOfMaster = await updateMaster[0].setCities(cities_id)

        res.status(200).json(updateMaster)

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteMaster = async (req: Request, res: Response) => {

    try {
        const { id } = req.body

        const deleteMaster = await Master.destroy({
            where: {
                id: id
            }
        })

        res.status(204).json(deleteMaster)

    } catch(error) {

        res.status(500).send()
    }
}



