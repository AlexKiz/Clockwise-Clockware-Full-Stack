const Router = require('express')
const router = new Router()
const {getAvailableMasters} = require('../controller/master.controller')


router.get('/availableMasters', getAvailableMasters)


module.exports = router 