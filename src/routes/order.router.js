const Router = require('express')
const router = new Router()
const {postOrder, getClocks, getOrderForRate, putRatedOrder} = require('../controller/order.controller')
const {postOrderValidate} = require('../controller/order.validate')


router.post('/order', [postOrderValidate], postOrder)
router.get('/OrderForRate', getOrderForRate)
router.get('/clocks', getClocks)
router.put('/RatedOrder', putRatedOrder)


module.exports = router 