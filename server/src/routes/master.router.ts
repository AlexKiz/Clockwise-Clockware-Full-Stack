import { Router } from 'express'
import { URL } from '../../data/constants/routeConstants'
import { getAvailableMasters } from '../controller/master.controller'

const router = Router()

router.get(`/${URL.AVAILABLE_MASTER}`, getAvailableMasters)


export default router 