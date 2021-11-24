import { Router } from 'express'
import { postUser } from '../controller/user.controller'
import { postUserValidate } from '../controller/user.validate'

const router = Router()

router.post('/user', [postUserValidate], postUser)


export default router 