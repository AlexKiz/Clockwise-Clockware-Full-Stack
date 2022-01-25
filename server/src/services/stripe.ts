/* eslint-disable require-jsdoc */
import Stripe from 'stripe';


export class StripeService extends Stripe {
	constructor(apiKey: string, config: Stripe.StripeConfig) {
		super(apiKey, config);
	}

	public createSession = (
		params: Stripe.Checkout.SessionCreateParams,
		options?: Stripe.RequestOptions,
	) => {
		const session = this.checkout.sessions.create(params, options);
		return session;
	};

	public createEvent = (payload: string | Buffer, header: string | Buffer | string[], secret: string) => {
		return this.webhooks.constructEvent(payload, header, secret);
	};
}
