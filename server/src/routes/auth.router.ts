import {Router} from 'express';
import {URL} from '../../data/constants/routeConstants';
import {auth} from '../controller/auth.controller';

const router = Router();

router.post(URL.LOGIN, auth);


export default router;
