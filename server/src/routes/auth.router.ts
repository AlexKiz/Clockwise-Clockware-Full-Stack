import {Router} from 'express';
import {URL} from '../../data/constants/routeConstants';
import {auth, isAuth, authorizationRole} from '../controller/auth.controller';

const router = Router();

router.post(URL.LOGIN, auth);
router.get(URL.LOGIN, isAuth, authorizationRole)


export default router;
