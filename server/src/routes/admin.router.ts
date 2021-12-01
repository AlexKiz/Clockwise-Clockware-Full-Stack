import { URL } from '../../data/constants/routeConstants';
import { Router } from 'express'
import { isAuth }  from '../controller/auth.controller'

import { postCity, getCities, putCity, deleteCity } from '../controller/city.controller'
import { postCityValidate, putCityValidate, deleteCityValidate } from '../controller/city.validate'

import { postMaster, getMasters, putMaster, deleteMaster } from '../controller/master.controller'
import { postMasterValidate, putMasterValidate, deleteMasterValidate } from '../controller/master.validate'

import { getOrders, putOrder, deleteOrder } from '../controller/order.controller'
import { putOrderValidate, deleteOrderValidate } from '../controller/order.validate'

import { getUsers, putUser, deleteUser } from '../controller/user.controller'
import { putUserValidate, deleteUserValidate } from '../controller/user.validate'

const router = Router()

router.get(`/${URL.CITY}`, [isAuth], getCities)
router.post(`/${URL.CITY}`, [isAuth, postCityValidate], postCity)
router.put(`/${URL.CITY}`, [isAuth, putCityValidate], putCity)
router.delete(`/${URL.CITY}`, [isAuth, deleteCityValidate], deleteCity)

router.post(`/${URL.MASTER}`, [isAuth, postMasterValidate], postMaster)
router.get(`/${URL.MASTER}`, [isAuth], getMasters) 
router.put(`/${URL.MASTER}`, [isAuth, putMasterValidate], putMaster) 
router.delete(`/${URL.MASTER}`, [isAuth, deleteMasterValidate], deleteMaster) 

router.get(`/${URL.ORDER}`, [isAuth], getOrders)
router.put(`/${URL.ORDER}`, [isAuth, putOrderValidate], putOrder)
router.delete(`/${URL.ORDER}`, [isAuth, deleteOrderValidate], deleteOrder)

router.get(`/${URL.USER}`, [isAuth], getUsers)
router.put(`/${URL.USER}`, [isAuth, putUserValidate], putUser)
router.delete(`/${URL.USER}`, [isAuth, deleteUserValidate], deleteUser)


export default router