import {URL} from '../../data/constants/routeConstants';
import {Router} from 'express';
import {isAuth, checkRole} from '../controller/auth.controller';

import {postCity, putCity, deleteCity} from '../controller/city.controller';
import {postCityValidate, putCityValidate, deleteCityValidate} from '../controller/city.validate';

import {postMaster, getMasters, putMaster, deleteMaster} from '../controller/master.controller';
import {postMasterValidate, putMasterValidate, deleteMasterValidate} from '../controller/master.validate';

import {getOrderForUpdate, putOrder, deleteOrder, getXSLXOrders} from '../controller/order.controller';
import {putOrderValidate, deleteOrderValidate} from '../controller/order.validate';

import {getUsers, putUser, deleteUser} from '../controller/user.controller';
import {putUserValidate, deleteUserValidate} from '../controller/user.validate';

const router = Router();

router.post(URL.CITY, [isAuth, postCityValidate, checkRole(['admin'])], postCity);
router.put(URL.CITY, [isAuth, putCityValidate, checkRole(['admin'])], putCity);
router.delete(URL.CITY, [isAuth, deleteCityValidate, checkRole(['admin'])], deleteCity);

router.post(URL.MASTER, [isAuth, postMasterValidate, checkRole(['admin'])], postMaster);
router.get(URL.MASTER, [isAuth, checkRole(['admin'])], getMasters);
router.put(URL.MASTER, [isAuth, putMasterValidate, checkRole(['admin'])], putMaster);
router.delete(URL.MASTER, [isAuth, deleteMasterValidate, checkRole(['admin'])], deleteMaster);

router.get(URL.ORDER_FOR_UPDATE, [isAuth, checkRole(['admin'])], getOrderForUpdate);
router.put(URL.ORDER, [isAuth, putOrderValidate, checkRole(['admin'])], putOrder);
router.delete(URL.ORDER, [isAuth, deleteOrderValidate, checkRole(['admin'])], deleteOrder);

router.get(URL.USER, [isAuth, checkRole(['admin'])], getUsers);
router.put(URL.USER, [isAuth, putUserValidate, checkRole(['admin'])], putUser);
router.delete(URL.USER, [isAuth, deleteUserValidate, checkRole(['admin'])], deleteUser);

router.get(URL.EXPORT_XLSX, [isAuth, checkRole(['admin'])], getXSLXOrders);

export default router;
