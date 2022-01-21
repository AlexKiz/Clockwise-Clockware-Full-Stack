import express from 'express';
import {Request, Response} from 'express';
import cityRouter from './routes/city.router';
import masterRouter from './routes/master.router';
import orderRouter from './routes/order.router';
import userRouter from './routes/user.router';
import login from './routes/auth.router';
import adminRouter from './routes/admin.router';
import cors from 'cors';
import path from 'path';
import {URL} from '../data/constants/routeConstants';
import db from './models';
import {nearOrderNotification} from './services/cron';
import {stripe} from './services/stripe';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({exposedHeaders: 'Authorization'}));
app.use(express.static(`../client/build`));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));


app.use(URL.API, cityRouter);
app.use(URL.API, masterRouter);
app.use(URL.API, orderRouter);
app.use(URL.API, userRouter);
app.use(URL.API, adminRouter);
app.use(URL.API, login);

app.post('/webhook', express.raw({type: 'application/json'}), (req: Request, res: Response) => {
	/*  const {
		name,
		email,
		clockId,
		cityId,
		masterId,
		startWorkOn,
		endWorkOn,
		orderPhotos,
	} = req.body;*/
	const testpayload = req.body;

	console.log(testpayload);
	res.status(200).end();
}); /*
	const payload: any = {name, email, clockId, cityId, masterId, startWorkOn, endWorkOn};

	const sig = req.headers['stripe-signature'];

	const endpointSecret = 'whsec_nKu9ir2FCaWE9DUjjt0UW7Z3N2Fz5zgB';

	let event;

	try {
		if (sig) {
			event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
		}
	} catch (err) {
		return res.status(400).send();
	}

	if (event?.type === 'checkout.session.completed') {
		const session = event.data.object;

		const successPayment = async () => {
			const createdOrder = await createOrder(session, orderPhotos);

			await sendPaymentEmail();

			return res.status(200);
		};

		successPayment();
	} else {
		res.status(500).send({message: 'Something went wrong while payment!'});
	}
});
*/

app.get('/*', function(req: Request, res: Response) {
	res.sendFile(path.resolve('../', 'client', 'build', 'index.html'));
});


const start = async () => {
	try {
		await db.sequelize.authenticate();
		await db.sequelize.sync();
		nearOrderNotification.start();
		app.listen(PORT, () => {
			console.log(`Server has been started on port ${PORT} `);
		});
	} catch (e) {
		console.log(e);
	}
};

start();
