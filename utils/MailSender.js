// utils/mailSender.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        // Create a Transporter to send emails
        let transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            port: 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        // Send emails to users
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            html: body,
        });
        return info;
    } catch (error) {
        console.log(error.message);
    }
};
module.exports = mailSender;
