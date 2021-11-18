const Router = require('express')
const router = new Router()
const {getCityForOrder} = require('../controller/city.controller')


router.get('/cityForOrder', getCityForOrder)


module.exports = router 