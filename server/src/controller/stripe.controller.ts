import {StripeService} from '../services/stripe';
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
		clockSize,
		price,
	} = req.body;

	const stripe = new StripeService(<string>process.env.STRIPE_API_KEY, {
		apiVersion: '2020-08-27',
	});

	const session = await stripe.createSession({
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						images: orderPhotos,
						name: `Repair clock with ${clockSize} size`,
					},
					unit_amount: price * 1000,
				},
				quantity: 1,
			},
		],
		metadata: {
			name,
			email,
			clockId,
			cityId,
			masterId,
			startWorkOn,
			endWorkOn,
			price,
		},
		mode: 'payment',
		success_url: 'http://localhost:5000',
		cancel_url: 'http://localhost:5000',
	});

	res.status(200).json(session.url);
};
