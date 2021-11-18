const db = require('../db')
const validName = new RegExp(/^[A-Za-zА-Яа-я]{3,100}$|^[A-Za-zА-Яа-я]{3,49}[-\s]{1}[A-Za-zА-Яа-я]{3,50}$/)

const postCityValidate = async (req, res, next) => {

    const { name } = req.body 

    const validationErrors = []

    const allCitiesName = await db.query('SELECT name FROM cities')

    if (allCitiesName.rows.length) {

        allCitiesName.rows.map((elem) => {

            if(name.toLowerCase().includes(elem.name.toLowerCase())) {

                validationErrors.push('City with similar name already exists')
            }

        })

    }

    if(!validName.test(name)) {

        validationErrors.push('Invalid city name')
    }

    if(validationErrors.length) {
        
        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


const putCityValidate = async (req, res, next) => {
    
    const { id, name } = req.body.data

    const validationErrors = []

    const validCity = await db.query('SELECT * FROM cities WHERE id = $1', [id])

    if(!validCity.rows.length) {

        validationErrors.push('City with current id does not exist')
    }

    if(!validName.test(name)) {

        validationErrors.push('Invalid city name')
    }

    if(validationErrors.length) {
        
        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}


const deleteCityValidate = async (req, res, next) => {
    
    const { id } = req.body 

    const validationErrors = []

    const validCity = await db.query('SELECT * FROM cities WHERE id = $1', [id])

    if(!validCity.rows.length) {

        validationErrors.push('City with current id does not exist')
    }

    if(validationErrors.length) {
        
        res.status(400).json(validationErrors)

    } else {

        return next()
    }
}



module.exports = {postCityValidate, putCityValidate, deleteCityValidate}