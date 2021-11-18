const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
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

module.exports = transporter