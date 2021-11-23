const { fdatasync } = require('fs')
const db = require('../db')


    
const postCity = async (req, res) => {

    try {
        const {name} = req.body

        const createdCity = await db.query('INSERT INTO cities (name) VALUES ($1)', [name])
        
        res.status(201).json(createdCity.rows)

    } catch(error) {
        
        res.status(500).send()
    }
    
}


const getCity = async (req, res) => {

    try {
        const readCity = await db.query('SELECT id as "cityId", name as "cityName" FROM cities')

        res.status(200).json(readCity.rows)

    } catch(error) {

        res.status(500).send()
    }
}

const getCityForOrder = async (req, res) => {

    try {
        const readCityForOrder = await db.query('SELECT DISTINCT cities.id as "cityId", cities.name as "cityName" FROM cities, masters_cities WHERE cities.id = masters_cities.city_id')

        res.status(200).json(readCityForOrder.rows)

    } catch(error) {

        res.status(500).send()
    }
}


const putCity = async (req, res) => {

    try {
        const {id, name} = req.body.data

        const updateCity = await db.query('UPDATE cities SET name = $2 WHERE id = $1', [id, name])

        res.status(200).json(updateCity.rows)

    } catch(error) {

        res.status(500).send()
    }
}


const deleteCity = async (req, res) => {

    try {
        const {id} = req.body

        const deleteMasterCities = await db.query('DELETE FROM masters_cities WHERE city_id = $1', [id])

        const deleteCity = await db.query('DELETE FROM cities WHERE id = $1', [id])

        res.status(204).json(deleteCity.rows)

    } catch(error) {

        res.status(500).send()
    }
} 



module.exports = {postCity, getCity, getCityForOrder, putCity, deleteCity}