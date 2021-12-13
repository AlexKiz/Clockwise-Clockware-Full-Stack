import { RESOURCE } from 'data/constants/routeConstants';
import nodemailer from 'nodemailer'

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
})

export const sendMail = (email: string, ratingIdentificator: string) => transporter.sendMail({
	from: `"Clockwise Clockware" <${process.env.CONFIRMATION_EMAIL}>`, 
	to: email, 
	subject: "Order confirmation",
	text: 'Order has been succesfully created!', 
	html: ` <p>Your order has been succesfully created!</p>
			<p>Please rate master's work <a href="${process.env.FRONT_URL}/${RESOURCE.RATE}/${ratingIdentificator}">here</a></p>`
});