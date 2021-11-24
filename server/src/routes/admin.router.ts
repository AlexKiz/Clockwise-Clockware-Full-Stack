import { Router } from 'express'
import { isAuth }  from '../controller/auth.controller'

import { postCity, getCity, putCity, deleteCity } from '../controller/city.controller'
import { postCityValidate, putCityValidate, deleteCityValidate } from '../controller/city.validate'

import { postMaster, getMaster, getAvailableMastersForUpdate, putMaster, deleteMaster } from '../controller/master.controller'
import { postMasterValidate, putMasterValidate, deleteMasterValidate } from '../controller/master.validate'

import { getOrder, putOrder, deleteOrder } from '../controller/order.controller'
import { putOrderValidate, deleteOrderValidate } from '../controller/order.validate'

import { getUser, putUser, deleteUser } from '../controller/user.controller'
import { putUserValidate, deleteUserValidate } from '../controller/user.validate'

const router = Router()

router.get('/city', [isAuth], getCity)
router.post('/city', [isAuth, postCityValidate], postCity)
router.put('/city', [isAuth, putCityValidate], putCity)
router.delete('/city', [isAuth, deleteCityValidate], deleteCity)

router.post('/master', [isAuth, postMasterValidate], postMaster)
router.get('/master', [isAuth], getMaster)
router.get('/availableMastersforUpdate', [isAuth], getAvailableMastersForUpdate) 
router.put('/master', [isAuth, putMasterValidate], putMaster) 
router.delete('/master', [isAuth, deleteMasterValidate], deleteMaster) 

router.get('/order', [isAuth], getOrder)
router.put('/order', [isAuth, putOrderValidate], putOrder)
router.delete('/order', [isAuth, deleteOrderValidate], deleteOrder)

router.get('/user', [isAuth], getUser)
router.put('/user', [isAuth, putUserValidate], putUser)
router.delete('/user', [isAuth, deleteUserValidate], deleteUser)


export default router