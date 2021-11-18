const Router = require('express')
const router = new Router()
const {postUser} = require('../controller/user.controller')
const {postUserValidate} = require('../controller/user.validate')


router.post('/user', [postUserValidate], postUser)


module.exports = router 