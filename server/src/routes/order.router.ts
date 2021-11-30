import { Router } from 'express'
import { URL } from '../../data/constants/routeConstants'
import { postOrder, putRatedOrder, getClocks, getOrderForRate } from '../controller/order.controller'
import { postOrderValidate, putRatedOrderValidate } from '../controller/order.validate'

const router = Router()

router.post(`/${URL.ORDER}`, [postOrderValidate], postOrder)
router.get(`/${URL.ORDER_FOR_RATE}`, getOrderForRate)
router.get(`/${URL.CLOCKS}`, getClocks)
router.put(`/${URL.RATED_ORDER}`, [putRatedOrderValidate], putRatedOrder)

export default router 