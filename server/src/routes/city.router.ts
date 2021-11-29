import { Router } from 'express'
import { URL } from '../../data/constants/routeConstants'
import { getCityForOrder } from '../controller/city.controller'

const router = Router()

router.get(`/${URL.CITY_FOR_ORDER}`, getCityForOrder)


export default router 