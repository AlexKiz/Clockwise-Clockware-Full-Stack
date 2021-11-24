import { Router } from 'express'
import { getAvailableMasters } from '../controller/master.controller'

const router = Router()

router.get('/availableMasters', getAvailableMasters)


export default router 