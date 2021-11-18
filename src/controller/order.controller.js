const { fdatasync } = require('fs')
const { queryResult } = require('pg-promise')
const db = require('../db')
const transporter = require('../services/nodemailer.js')
const { v4: uuidv4 } = require('uuid');

const postOrder = async (req, res) => {
        
    try {
        const {clocks_id, city_id, master_id, start_work_on, name, email} = req.body
        
        const durationTime = await db.query('SELECT installation_time FROM clocks WHERE id = $1',[clocks_id])

        let user_id
        const userId = await db.query('SELECT id FROM users WHERE email = $1', [email])

        if(userId.rows.length) {
            user_id = userId.rows[0].id
        }

        if(!userId.rows.length) {
            const createUser = await db.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email])
            user_id = createUser.rows[0].id
        }

        if(durationTime.rows.length) {
            const { installation_time } = durationTime.rows[0]
            
            let date = new Date(`${start_work_on}`)

            date.setUTCHours(date.getHours() + installation_time)
            
            const end_work_on = date.toISOString()

            const ratingIdentificator = uuidv4();

            const createOrder = await db.query('INSERT INTO orders (clocks_id, user_id, city_id, master_id, start_work_on, end_work_on, uuid_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [clocks_id, user_id, city_id, master_id, start_work_on, end_work_on, ratingIdentificator])

            await transporter.sendMail({
                from: '"Clockwise Clockware" <clockwiseclockwaremailbox@gmail.com>', 
                to: email, 
                subject: "Order confirmation",
                text: 'Order has been succesfully created!', 
                html: ` <p>Your order has been succesfully created!</p>
                        <p>Please rate master's work <a href="${process.env.FRONT_URL}/rate/${ratingIdentificator}">here</a></p>`
            });

            res.status(201).json(createOrder.rows)
        }

    } catch(error) {

        res.status(500).send()
    }
}


const getOrder = async (req, res) => {

    try {
        
        const readOrder = await db.query('SELECT orders.id AS "orderId", orders.clocks_id AS "clocksId", orders.user_id AS "userId", orders.city_id AS "cityId", orders.master_id AS "masterId", (TO_CHAR(orders.start_work_on, \'YYYY-MM-DD,HH24:MI\')) AS "startWorkOn", (TO_CHAR(orders.end_work_on, \'YYYY-MM-DD HH24:MI\')) AS "endWorkOn", clocks.size AS "clockSize", users.name AS "userName", users.email AS "userEmail", cities.name AS "cityName", masters.name AS "masterName" FROM orders INNER JOIN clocks ON orders.clocks_id = clocks.id INNER JOIN users ON orders.user_id = users.id INNER JOIN cities ON orders.city_id = cities.id INNER JOIN masters ON orders.master_id = masters.id')
        
        res.status(200).json(readOrder.rows)

    } catch(error) {

        res.status(500).send()
    }
}

const getOrderForRate = async (req, res) => { 
    
    try {
        
        const { ratingIdentificator } = req.query
        
        const readOrderForRate = await db.query('SELECT orders.id AS "orderId", orders.clocks_id AS "clocksId", orders.user_id AS "userId", orders.city_id AS "cityId", orders.master_id AS "masterId", (TO_CHAR(orders.start_work_on, \'YYYY-MM-DD,HH24:MI\')) AS "startWorkOn", (TO_CHAR(orders.end_work_on, \'YYYY-MM-DD HH24:MI\')) AS "endWorkOn", clocks.size AS "clockSize", users.name AS "userName", users.email AS "userEmail", cities.name AS "cityName", masters.name AS "masterName" FROM orders INNER JOIN clocks ON orders.clocks_id = clocks.id INNER JOIN users ON orders.user_id = users.id INNER JOIN cities ON orders.city_id = cities.id INNER JOIN masters ON orders.master_id = masters.id WHERE uuid_id = $1', [ratingIdentificator])

        res.status(200).json(readOrderForRate.rows)

    } catch(error) {

        res.status(500).send()
    }
}

const putRatedOrder = async (req, res) => {

    try {

        const {id, order_rated, master_id} = req.body
        
        const readMasterRating = await db.query('SELECT rated_sum, rated_quantity FROM masters WHERE id = $1', [master_id])
        
        const { rated_sum, rated_quantity } = readMasterRating.rows[0]
        
        const newRatedSum = rated_sum + order_rated
        
        const newRatedQuantity = rated_quantity + 1
        
        const newRating = Number((newRatedSum / newRatedQuantity).toFixed(2)) 
        
        const updateMasterRating = await db.query('UPDATE masters SET rating = $1, rated_sum = $2, rated_quantity = $3 WHERE id = $4', [newRating, newRatedSum, newRatedQuantity, master_id])
        
        const updateRatedOrder = await db.query(`UPDATE orders SET order_rating = $1, uuid_id = 'Rated' WHERE id = $2`, [order_rated, id])
        
        res.status(200).json(updateRatedOrder.rows)

    } catch(error) {

        res.status(500).send()
    }
}


const getClocks = async (req, res) => {

    try {
        
        const readClocks = await db.query('SELECT * FROM clocks')
        
        res.status(200).json(readClocks.rows)
        
    } catch(err) {

        res.status(500).send()
    }
}


const putOrder = async (req, res) => {

    try {
        const {id, clocks_id, user_id, city_id, master_id, start_work_on} = req.body

        const updateOrder = await db.query('UPDATE orders SET clocks_id = $2, user_id = $3, city_id = $4, master_id = $5, start_work_on = $6 WHERE id = $1', [id, clocks_id, user_id, city_id, master_id, start_work_on])

        res.status(200).json(updateOrder.rows)

    } catch(error) {

        res.status(500).send()
    }
}


const deleteOrder = async (req, res) => {

    try {
        const {id} = req.body

        const deleteOrder = await db.query('DELETE FROM orders WHERE id = $1', [id])

        res.status(204).json(deleteOrder.rows)

    } catch(error) {

        res.status(500).send()
    }
}

module.exports = {postOrder, getOrder, getOrderForRate, getClocks, putOrder, putRatedOrder, deleteOrder}