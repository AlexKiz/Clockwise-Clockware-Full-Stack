const db = require('../db')
const validDate = new RegExp(/(\d{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}\d{1}|3[0-1]{1})|([0-2]{1}\d{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-]\d{4})\s([0-2]{1}\d{1}[:][0-5]{1}\d{1})/)
const validName = new RegExp(/^([(A-Za-zА-Яа-я]{3,49})$|^([A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50})$/)
const validEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const postOrderValidate = async(req, res, next) => {

    const {clocks_id, city_id, master_id, start_work_on, name, email} = req.body

    const validationErrors = []

    const validClocksId = await db.query('SELECT * FROM clocks WHERE id = $1', [clocks_id])

    if(!validClocksId.rows.length) {

        validationErrors.push('Clocks with current id does not exist')

    }

    const validCityId = await db.query('SELECT * FROM cities WHERE id = $1', [city_id])

    if(!validCityId.rows.length) {

        validationErrors.push('City with current id does not exist')

    }

    const validMasterId = await db.query('SELECT * FROM masters WHERE id = $1', [master_id])

    if(!validMasterId.rows.length) {

        validationErrors.push('Master with current id does not exist')

    }

    if(!validDate.test(start_work_on)) {

        validationErrors.push('Invalid date')

    }

    if(!validName.test(name)) {

        validationErrors.push('Invalid user name')

    }

    if(!validEmail.test(email)) {

        validationErrors.push('Invalid user email')

    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


const putOrderValidate = async(req, res, next) => {

    const {id, clocks_id, user_id, city_id, master_id, start_work_on} = req.body

    const validationErrors = []

    const validOrder = await db.query('SELECT * FROM orders WHERE id = $1', [id])

    if(!validOrder.rows.length) {

        validationErrors.push('Order with current id does not exist')

    }

    const validClocksId = await db.query('SELECT * FROM clocks WHERE id = $1', [clocks_id])

    if(!validClocksId.rows.length) {

        validationErrors.push('Clocks with current id does not exist')

    }

    const validUserId = await db.query('SELECT * FROM users WHERE id = $1', [user_id])

    if(!validUserId.rows.length) {

        validationErrors.push('User with current id does not exist')

    }

    const validCityId = await db.query('SELECT * FROM cities WHERE id = $1', [city_id])

    if(!validCityId.rows.length) {

        validationErrors.push('City with current id does not exist')

    }

    const validMasterId = await db.query('SELECT * FROM masters WHERE id = $1', [master_id])

    if(!validMasterId.rows.length) {

        validationErrors.push('Master with current id does not exist')

    }
    
    if(!validDate.test(start_work_on)) {

        validationErrors.push('Invalid date')
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


const deleteOrderValidate = async(req, res, next) => {

    const { id } = req.body

    const validationErrors = []

    const validOrder = await db.query('SELECT * FROM orders WHERE id = $1', [id])

    if(!validOrder.rows.length) {

        validationErrors.push('Order with current id does not exist')

    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}



module.exports = {postOrderValidate, putOrderValidate, deleteOrderValidate}