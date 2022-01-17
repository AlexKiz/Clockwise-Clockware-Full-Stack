import {Router} from 'express';
import {URL} from '../../data/constants/routeConstants';
import {userRegistration, userVerification} from '../controller/user.controller';
import {userRegistrationValidate} from '../controller/user.validate';

const router = Router();

router.post(URL.REGISTRATION, [userRegistrationValidate], userRegistration);
router.put(URL.VERIFY, userVerification);

export default router;
