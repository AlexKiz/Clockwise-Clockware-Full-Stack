import {StripeService} from './services/stripe';
import express from 'express';
import {Request, Response} from 'express';
import cityRouter from './routes/city.router';
import masterRouter from './routes/master.router';
import orderRouter from './routes/order.router';
import userRouter from './routes/user.router';
import login from './routes/auth.router';
import adminRouter from './routes/admin.router';
import blogRouter from './routes/blog.router';
import cors from 'cors';
import path from 'path';
import {URL} from '../data/constants/routeConstants';
import db from './models';
import {nearOrderNotification} from './services/cron';
import {postOrder} from '../data/utilities/systemUtilities';
import Stripe from 'stripe';


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({exposedHeaders: 'Authorization'}));
app.use(express.static(`../client/build`));

app.post(URL.PAYMENT_HANDLER, express.raw({type: 'application/json'}), (req: Request, res: Response) => {
	const payload = req.body;
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
	const stripe = new StripeService(<string>process.env.STRIPE_API_KEY, {
		apiVersion: '2020-08-27',
	});

	let event;

	if (endpointSecret) {
		const sig = req.headers['stripe-signature'];

		try {
			if (sig) {
				event = stripe.createEvent(payload, sig, endpointSecret);
			}
		} catch (err) {
			return res.status(400).send();
		}
	}

	if (event?.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Response<Stripe.Checkout.Session>;
		postOrder(session);
		return res.status(200);
	} else {
		res.send();
	}
});

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));


app.use(URL.API, cityRouter);
app.use(URL.API, masterRouter);
app.use(URL.API, orderRouter);
app.use(URL.API, userRouter);
app.use(URL.API, adminRouter);
app.use(URL.API, login);
app.use(URL.API, blogRouter);


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
