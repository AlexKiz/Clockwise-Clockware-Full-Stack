import {Router} from 'express';
import {checkRole, isAuth} from '../controller/auth.controller';
import {URL} from '../../data/constants/routeConstants';
import {
	postOrder,
	putRatedOrder,
	getClocks,
	getOrderForRate,
	getOrders,
	completeOrder,
	downloadPDFReceipt,
	getOrdersForCalendar,
} from '../controller/order.controller';
import {postOrderValidate, putRatedOrderValidate} from '../controller/order.validate';
import {createStripeCheckoutSession} from '../controller/stripe.controller';

const router = Router();

router.post(URL.ORDER, [postOrderValidate], postOrder);
router.get(URL.ORDER, [isAuth, checkRole(['admin', 'master', 'client'])], getOrders);
router.get(URL.ORDER_FOR_RATE, getOrderForRate);
router.get(URL.CLOCKS, getClocks);
router.put(URL.RATED_ORDER, [putRatedOrderValidate], putRatedOrder);
router.put(URL.COMPLETE_ORDER, [isAuth, checkRole(['master'])], completeOrder);
router.post(URL.STRIPE, [postOrderValidate], createStripeCheckoutSession);
router.get(URL.DOWNLOAD_ORDER_RECEIPT, [isAuth, checkRole(['master'])], downloadPDFReceipt);
router.get(URL.ORDERS_FOR_CALENDAR, [isAuth, checkRole(['master'])], getOrdersForCalendar);

export default router;
