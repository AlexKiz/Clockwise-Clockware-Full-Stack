import {URL} from '../../data/constants/routeConstants';
import {Router} from 'express';
import {isAuth, checkRole} from '../controller/auth.controller';

import {getCityForUpdate, postCity, putCity, deleteCity} from '../controller/city.controller';
import {
	postCityValidate,
	putCityValidate,
	deleteCityValidate,
	cityBelongsCheck,
} from '../controller/city.validate';

import {postMaster, getMasters, putMaster, deleteMaster} from '../controller/master.controller';
import {
	postMasterValidate,
	putMasterValidate,
	deleteMasterValidate,
	masterBelongsCheck,
} from '../controller/master.validate';

import {
	getOrderForUpdate,
	putOrder,
	deleteOrder,
	getXSLXOrders,
	getOrdersForChart,
	getOrdersForCitiesPieChart,
	getOrdersForMastersPieChart,
	getOrdersForMastersTable,
} from '../controller/order.controller';
import {putOrderValidate, deleteOrderValidate} from '../controller/order.validate';

import {getUsers, putUser, deleteUser} from '../controller/user.controller';
import {putUserValidate, deleteUserValidate, userBelongsCheck} from '../controller/user.validate';

const router = Router();

router.get(URL.CITY_FOR_UPDATE, [isAuth, checkRole(['admin'])], getCityForUpdate);
router.post(URL.CITY, [isAuth, postCityValidate, checkRole(['admin'])], postCity);
router.put(URL.CITY, [isAuth, putCityValidate, checkRole(['admin'])], putCity);
router.delete(URL.CITY, [isAuth, deleteCityValidate, cityBelongsCheck, checkRole(['admin'])], deleteCity);

router.post(URL.MASTER, [isAuth, postMasterValidate, checkRole(['admin'])], postMaster);
router.get(URL.MASTER, [isAuth, checkRole(['admin'])], getMasters);
router.put(URL.MASTER, [isAuth, putMasterValidate, checkRole(['admin'])], putMaster);
router.delete(URL.MASTER, [isAuth, deleteMasterValidate, masterBelongsCheck, checkRole(['admin'])], deleteMaster);

router.get(URL.ORDER_FOR_UPDATE, [isAuth, checkRole(['admin'])], getOrderForUpdate);
router.put(URL.ORDER, [isAuth, putOrderValidate, checkRole(['admin'])], putOrder);
router.delete(URL.ORDER, [isAuth, deleteOrderValidate, checkRole(['admin'])], deleteOrder);

router.get(URL.USER, [isAuth, checkRole(['admin'])], getUsers);
router.put(URL.USER, [isAuth, putUserValidate, checkRole(['admin'])], putUser);
router.delete(URL.USER, [isAuth, deleteUserValidate, userBelongsCheck, checkRole(['admin'])], deleteUser);

router.get(URL.TOTAL_ORDERS_CHART, [isAuth, checkRole(['admin'])], getOrdersForChart);
router.get(URL.TOTAL_ORDERS_CITIES_PIE_CHART, [isAuth, checkRole(['admin'])], getOrdersForCitiesPieChart);
router.get(URL.TOTAL_ORDERS_MASTERS_PIE_CHART, [isAuth, checkRole(['admin'])], getOrdersForMastersPieChart);
router.get(URL.MASTERS_STATISTICS_TABLE, [isAuth, checkRole(['admin'])], getOrdersForMastersTable);

export default router;
