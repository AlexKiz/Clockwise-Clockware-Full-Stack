import {Router} from 'express';
import {URL} from '../../data/constants/routeConstants';
import {Auth} from '../controller/auth.controller';

const router = Router();

router.post(`/${URL.LOGIN}`, Auth);


export default router;
