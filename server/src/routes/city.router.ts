import {Router} from 'express';
import {URL} from '../../data/constants/routeConstants';
import {getCitiesForOrder} from '../controller/city.controller';

const router = Router();

router.get(`/${URL.CITY_FOR_ORDER}`, getCitiesForOrder);


export default router;
