import { Router } from 'express'
import { getCityForOrder } from '../controller/city.controller'

const router = Router()

router.get('/cityForOrder', getCityForOrder)


export default router 