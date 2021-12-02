import { Response, Request } from "express" 
import { transporter } from '../services/nodemailer'
import { v4 as uuidv4 } from 'uuid'
import { RESOURCE } from "../../data/constants/routeConstants"
import { Order, Clock, User, Master, City } from '../models/Models'


export const postOrder = async (req: Request, res: Response) => {
        
    try {
        const { clock_id, city_id, master_id, start_work_on, name, email } = req.body

        const [createdUser, isUserCreated] = await User.findOrCreate({
            where: {
                email: email
            }, 
            defaults: {
                email: email,
                name: name
            }

        })

        const userId = createdUser.id

                const durationTime = await Clock.findOne({
                    attributes: ['installation_time'],
                    where: {
                        id: clock_id
                    }
                })

        if(durationTime) {
            const { installation_time } = durationTime
            
            let endDate = new Date(`${start_work_on}`)
            let startDate = new Date(`${start_work_on}`)
            startDate.setUTCHours(startDate.getHours())
            endDate.setUTCHours(endDate.getHours() + installation_time)
            const endWorkOn = endDate.toISOString()
            const startWorkOn = startDate.toISOString()

            const ratingIdentificator = uuidv4();
            console.log(clock_id, userId, city_id, master_id, startWorkOn, endWorkOn, ratingIdentificator);
            
            const createOrder = await Order.create({
                clock_id: clock_id,
                user_id: userId,
                city_id: city_id,
                master_id: master_id,
                start_work_on: startWorkOn,
                end_work_on: endWorkOn,
                rating_identificator: ratingIdentificator
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
        }

    } catch(error) {

        res.status(500).send()
    }
}


export const getOrders = async (req: Request, res: Response) => {

    try {
        
        const readOrders = await Order.findAll({
            attributes: [
                'id',
                ['start_work_on', 'startWorkOn'],
                ['end_work_on', 'endWorkOn']
            ],
            include: [
                {
                    model: Clock,
                    attributes: ['id', 'size'],
                    required:true
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                    required:true
                },
                {
                    model: City,
                    attributes: ['id', 'name'],
                    required: true
                },
                {
                    model: Master,
                    attributes: ['id', 'name'],
                    required: true
                }
            ]
        })

        res.status(200).json(readOrders)

    } catch(error) {

        res.status(500).send()
    }
}


export const getOrderForRate = async (req: Request, res: Response) => { 
    
    try {
        
        const { ratingIdentificator } = req.query

        const readOrderForRate = await Order.findAll({
            attributes: [
                'id',
                ['start_work_on', 'startWorkOn'],
                ['end_work_on', 'endWorkOn']
            ],
            include: [
                {
                    model: Clock,
                    attributes: ['id', 'size'],
                    required:true
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                    required:true
                },
                {
                    model: City,
                    attributes: ['id', 'name'],
                    required: true
                },
                {
                    model: Master,
                    attributes: ['id', 'name'],
                    required: true
                }
            ],
            where: {
                rating_identificator: ratingIdentificator
            }
        })

        res.status(200).json(readOrderForRate)

    } catch(error) {

        res.status(500).send()
    }
}


export const putRatedOrder = async (req: Request, res: Response) => {

    try {

        const { id, order_rated, master_id } = req.body

        const readMasterRating = await Master.findOne({
            attributes: ['rated_sum', 'rated_quantity'],
            where: {
                id: id
            }
        })
        
        if( readMasterRating ) {
            const { rated_sum, rated_quantity } = readMasterRating
        
            const newRatedSum = rated_sum + order_rated
            
            const newRatedQuantity = rated_quantity + 1
            
            const newRating = Number((newRatedSum / newRatedQuantity).toFixed(2)) 
            
            const updateMasterRating = await Master.update({
                rating: newRating,
                rated_sum: newRatedSum,
                rated_quantity: newRatedQuantity
            },{
                where: {
                    id: master_id
                }
            })

            const updateRatedOrder = await Order.update({
                order_rating: order_rated,
                rating_identificator: ''
            }, {
                where: {
                    id: id
                }
            })
            
            res.status(200).json(updateRatedOrder)
        }

    } catch(error) {

        res.status(500).send()
    }
}


export const getClocks = async (req: Request, res: Response) => {

    try {

        const readClocks = await Clock.findAll()
        
        res.status(200).json(readClocks)
        
    } catch(err) {

        res.status(500).send()
    }
}


export const putOrder = async (req: Request, res: Response) => {

    try {
        const { id, clock_id, user_id, city_id, master_id, start_work_on } = req.body

        const updateOrder = await Order.update({
            clock_id: clock_id,
            user_id: user_id,
            city_id: city_id,
            master_id: master_id,
            start_work_on: start_work_on
        }, {
            where: {
                id: id
            }
        })

        res.status(200).json(updateOrder)

    } catch(error) {

        res.status(500).send()
    }
}


export const deleteOrder = async (req: Request, res: Response) => {

    try {
        const { id } = req.body

        const deleteOrder = await Order.destroy({
            where: {
                id: id
            }
        })

        res.status(204).json(deleteOrder)

    } catch(error) {

        res.status(500).send()
    }
}