import {Router} from 'express';
import {URL} from '../../data/constants/routeConstants';
import {postUser} from '../controller/user.controller';
import {postUserValidate} from '../controller/user.validate';

const router = Router();

router.post(URL.USER, [postUserValidate], postUser);


export default router;
