import {StripeService} from '../services/stripe';
import {Response, Request} from 'express';
import {CloudinaryService} from '../services/cloudinary';


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

	const cloudinary = new CloudinaryService({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUD_API_KEY,
		api_secret: process.env.CLOUD_API_SECRET,
	});

	const orderImagesURL = await cloudinary.uploadPhotos(orderPhotos);

	const session = await stripe.createSession({
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
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
			orderImages: orderImagesURL?.join(','),
			price,
		},
		mode: 'payment',
		success_url: 'http://localhost:5000',
		cancel_url: 'http://localhost:5000',
	});

	res.status(200).json(session.url);
};
