import nodemailer from 'nodemailer';
import {RESOURCE} from '../../data/constants/routeConstants';

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	secure: true,
	port: 587,
	auth: {
		user: process.env.CONFIRMATION_EMAIL,
		pass: process.env.CONFIRMATION_PASSWORD,
	},
	logger: true,
});

export const sendMail = (
	email: string,
	ratingIdentificator: string,
	file: any,
	masterName: string,
	orderId: string,
) => transporter.sendMail({
	from: `"Clockwise Clockware" <${process.env.CONFIRMATION_EMAIL}>`,
	to: email,
	subject: 'Order confirmation',
	text: 'Order has been succesfully completed!',
	html: `<p>Master ${masterName} marked order #${orderId.slice(0, 4)}</p>
			<p>Please rate master's work 
				<a href="${process.env.FRONT_URL}/${RESOURCE.RATE}/${ratingIdentificator}">
					here
				</a>
			</p>`,
	attachments: [{
		filename: 'receipt.pdf',
		content: file,
	}],
});

export const sendVerificationMail = (email: string, hash: string) => transporter.sendMail({
	from: `"Clockwise Clockware" <${process.env.CONFIRMATION_EMAIL}>`,
	to: email,
	subject: 'Email Verification',
	text: 'Please verify your email on link below',
	html: `<p>Click 
				<a href="${process.env.FRONT_URL}/${RESOURCE.VERIFICATION}/${hash}">
					here
				</a> to confirm
			</p>`,
});

export const sendSuccessPaymentMail = (email: string) => transporter.sendMail({
	from: `"Clockwise Clockware" <${process.env.CONFIRMATION_EMAIL}>`,
	to: email,
	subject: 'Success Payment',
	text: 'Your payment was successfully completed',
	html: `<div style="line-height: 140%; text-align: left; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 140%; text-align: center;">
					<span style="font-size: 16px; line-height: 22.4px;">
						Your order was successfully paid and created!
					</span>
				</p>
				<p style="font-size: 14px; line-height: 140%; text-align: center;">
					<span style="font-size: 16px; line-height: 22.4px;">
						Thanks for choosing our service! Have a good day! 
					</span>
				</p>
				<p style="font-size: 14px; line-height: 140%; text-align: center;">
					<span style="font-size: 16px; line-height: 22.4px;">
						P.S. "<em><strong>Русский военный корабль, иди нах#й!</strong></em>"
					</span>
				</p>
			</div>`,
});

export const sendAutoRegistrationMail = (email: string, hash: string, password: string) => transporter.sendMail({
	from: `"Clockwise Clockware" <${process.env.CONFIRMATION_EMAIL}>`,
	to: email,
	subject: 'Email Registration',
	text: 'Please verify your email on link below',
	html: `<div style="line-height: 140%; text-align: left; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 140%; text-align: center;">
					<span style="font-size: 16px; line-height: 22.4px;">
						Your order was successfully paid and created!
					</span>
				</p>
				<p style="font-size: 14px; line-height: 140%; text-align: center;">
					<span style="font-size: 16px; line-height: 22.4px;">
						Thanks for choosing our service! Have a good day! 
					</span>
				</p>
				<p style="font-size: 14px; line-height: 140%; text-align: center;">
					<span style="font-size: 16px; line-height: 22.4px;">
						P.S. "<em><strong>Русский военный корабль, иди нах#й!</strong></em>"
					</span>
				</p><br>
				<p style="font-size: 14px; line-height: 140%; text-align: center;">
					<strong> Please, click 
						<a href="${process.env.FRONT_URL}/${RESOURCE.VERIFICATION}/${hash}/${password}">
							here
						</a> to continue registration</strong>
				</p>
		</div>`,
});

export const sendNearOrderMailNotification = (email: string) => transporter.sendMail({
	from: `"Clockwise Clockware" <${process.env.CONFIRMATION_EMAIL}>`,
	to: email,
	subject: 'Near Order',
	text: 'Please, pay attention!',
	html: `<p>You have order/orders that will have started in an hour</p>`,
});
