const db = require('../db')
const validName = new RegExp(/^[A-Za-zА-Яа-я]{3,49}$|^[A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50}$/)

const postMasterValidate = async(req, res, next) => {

    const {name, cities_id} = req.body

    const validationErrors = []

    if(!validName.test(name)) {

        validationErrors.push('Invalid master name')
    }
    
    const validCityId = await db.query(`SELECT * FROM cities WHERE id IN (${cities_id})`)

    if(!validCityId.rows.length) {

        validationErrors.push('City with current id does not exist')
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


const putMasterValidate = async(req, res, next) => {
    
    const {id, name, cities_id} = req.body.data 

    const validationErrors = []

    const validMaster = await db.query('SELECT * FROM masters WHERE id = $1', [id])

    if(!validMaster.rows.length) {

        validationErrors.push('Master with current id does not exist')

    }

    if(!validName.test(name)) {

        validationErrors.push('Invalid master name')

    }

    const validCityId = await db.query(`SELECT * FROM cities WHERE id IN (${cities_id})`)

    if(!validCityId.rows.length) {

        validationErrors.push('City with current id does not exist')
    }
    
    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


const deleteMasterValidate = async(req, res, next) => {

    const { id } = req.body

    const validationErrors = []

    const validMaster = await db.query('SELECT * FROM masters WHERE id = $1', [id])

    if(!validMaster.rows.length) {

        validationErrors.push('Master with current id does not exist', [id])
    }

    if(validationErrors.length) {

        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}



module.exports = {postMasterValidate, putMasterValidate, deleteMasterValidate}