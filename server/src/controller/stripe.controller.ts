import {stripe} from '../services/stripe';
import {Response, Request} from 'express';

export const createStripeCheckoutSession = async (req: Request, res: Response) => {
	const {
		name,
		email,
		clockId,
		cityId,
		masterId,
		startWorkOn,
		endWorkOn,
		orderPhotos,
	} = req.body;

	console.log(req.body);

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: `Repair clock with big Black size`,
					},
					unit_amount: 10 * 1000,
				},
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: 'http://localhost:5000', // route
		cancel_url: 'http://localhost:5000',
	});

	res.status(200).json(session.url);
};
