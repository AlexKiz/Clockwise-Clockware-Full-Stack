import { Router } from 'express'
import { postOrder, getClocks, getOrderForRate, putRatedOrder } from '../controller/order.controller'
import { postOrderValidate } from '../controller/order.validate'

const router = Router()

router.post('/order', [postOrderValidate], postOrder)
router.get('/OrderForRate', getOrderForRate)
router.get('/clocks', getClocks)
router.put('/RatedOrder', putRatedOrder)


export default router 