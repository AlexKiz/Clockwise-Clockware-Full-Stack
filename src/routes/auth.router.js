const Router = require('express')
const router = new Router()
const {Auth} = require('../controller/auth.controller')


router.post('/login', Auth)


module.exports = router 