import { Router } from 'express'
import { Auth } from '../controller/auth.controller'

const router = Router()

router.post('/login', Auth)


export default router 