import { Response, Request } from "express" 
import { transporter } from '../services/nodemailer'
import { v4 as uuidv4 } from 'uuid'
import { RESOURCE } from "../../data/constants/routeConstants"
import db from '../models'


export const postOrder = async (req: Request, res: Response) => {
        
    try {
        const { name, email, clockId, cityId, masterId, startWorkOn, endWorkOn } = req.body

        const [createdUser, isUserCreated] = await db.User.findOrCreate({where:{ email }, defaults:{ email, name }})

        const userId = createdUser.id
        
        const ratingIdentificator = uuidv4();
        
        const createOrder = await db.Order.create({
            clockId, 
            userId, 
            cityId, 
            masterId,
            startWorkOn,
            endWorkOn, 
            ratingIdentificator
        })

        await transporter.sendMail({
            from: `"Clockwise Clockware" <${process.env.CONFIRMATION_EMAIL}>`, 
            to: email, 
            subject: "Order confirmation",
            text: 'Order has been succesfully created!', 
            html: ` <p>Your order has been succesfully created!</p>
                    <p>Please rate master's work <a href="${process.env.FRONT_URL}/${RESOURCE.RATE}/${ratingIdentificator}">here</a></p>`
        });
        res.status(201).json(createOrder)
        

    } catch(error) {

        res.status(500).send()
    }
}


export const getOrders = async (req: Request, res: Response) => {

        const readOrders = await db.Order.findAll({
            attributes: ['id', 'startWorkOn', 'endWorkOn'],
            include: [
                {
                    model: db.Clock,
                    attributes: ['id', 'size'],
                    required:true
                },
                {
                    model: db.User,
                    attributes: ['id', 'name', 'email'],
                    required:true
                },
                {
                    model: db.City,
                    attributes: ['id', 'name'],
                    required: true
                },
                {
                    model: db.Master,
                    attributes: ['id', 'name'],
                    required: true
                }
            ]
        })

        res.status(200).json(readOrders)
}


export const getOrderForRate = async (req: Request, res: Response) => { 
    
    try {
        
        const { ratingIdentificator } = req.query
        
        const readOrderForRate = await db.Order.findAll({
            attributes: ['id','startWorkOn','endWorkOn'],
            where: { 
                ratingIdentificator: ratingIdentificator 
            },
            include: [
                {
                    model: db.Clock,
                    attributes: ['id', 'size'],
                    required:true
                },
                {
                    model: db.User,
                    attributes: ['id', 'name', 'email'],
                    required:true
                },
                {
                    model: db.City,
                    attributes: ['id', 'name'],
                    required: true
                },
                {
                    model: db.Master,
                    attributes: ['id', 'name', 'ratedSum', 'ratedQuantity'],
                    required: true
                }
            ]

        })

        res.status(200).json(readOrderForRate)

    } catch(error) {

        res.status(500).send()
    }
}


export const putRatedOrder = async (req: Request, res: Response) => {

    try {

        const { id, orderRated, masterId, newRating, newRatedSum, newRatedQuantity } = req.body 
        
        const updateMasterRating = await db.Master.updateById(masterId ,{
            rating: newRating,
            ratedSum: newRatedSum,
            ratedQuantity: newRatedQuantity
        })

        const updateRatedOrder = await db.Order.updateById(id, {
            orderRating: orderRated,
            ratingIdentificator: ''
        })
        
        res.status(200).json(updateRatedOrder)
        

    } catch(error) {

        res.status(500).send()
    }
}


export const getClocks = async (req: Request, res: Response) => {

    const readClocks = await db.Clock.findAll()

    res.status(200).json(readClocks)
}


export const putOrder = async (req: Request, res: Response) => {

    try {
        const { id, clockId, userId, cityId, masterId, startWorkOn, endWorkOn } = req.body

        const updateOrder = await db.Order.updateById(id, {
            clockId, 
            userId, 
            cityId,
            masterId, 
            startWorkOn,
            endWorkOn
        })

        res.status(200).json(updateOrder)

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteOrder = async (req: Request, res: Response) => {

    try {
        const { id } = req.body

        const deleteOrder = await db.Order.deleteById(id)

        res.status(204).json(deleteOrder)

    } catch(error) {

        res.status(500).send()
    }
}