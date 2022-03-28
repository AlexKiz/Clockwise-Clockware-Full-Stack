import {Router} from 'express';
import {URL} from '../../data/constants/routeConstants';
import {getCoordinates, postCoordinates} from '../controller/geo.controller';
import {isAuth, checkRole} from '../controller/auth.controller';

const router = Router();

router.get(URL.GEO_COORDINATES, getCoordinates);
router.post(URL.GEO_COORDINATES, [isAuth, checkRole(['admin'])], postCoordinates);


export default router;
