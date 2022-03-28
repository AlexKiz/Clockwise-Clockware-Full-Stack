import {CronJob} from 'cron';
import db from '../models';
import {sendNearOrderMailNotification} from './nodemailer';

export const nearOrderNotification = new CronJob('0 * * * *', async () => {
	const currentDate = new Date();
	currentDate.setUTCHours(currentDate.getHours() + 1);
	const nearOrderDate = currentDate.toISOString();

	const nearOrders = await db.Order.findAll({
		attributes: ['masterId'],
		where: {
			startWorkOn: nearOrderDate,
		},
	});

	const masterIds = nearOrders.map((order:{masterId: string}) => {
		return order.masterId;
	});

	const mastersEmail = await db.User.findAll({
		attributes: ['email'],
		where: {
			masterId: masterIds,
		},
	});

	const sendNotificationMail = async () => {
		mastersEmail.map(async (elem:{email: string}) => {
			await sendNearOrderMailNotification(elem.email);
		});
	};

	sendNotificationMail();
} );

