const nodemailer = require('nodemailer');

require('dotenv').config();

//console.log(process.env.SMTP_SERVER, process.env.SMTP_USERNAME, process.env.SMTP_PASSWORD);



module.exports = async(to, subject, text) => {

    const smtpTransport = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    const message = {
        from: process.env.SMTP_USERNAME,
        to: to,
        subject: subject,
        text: text
    };
    // const message = {
    //     to: to,
    //     from: process.env.SMTP_USERNAME,
    //     subject,
    //     text
    // }

    try {
        await smtpTransport.sendMail(message);
        console.log("E-mail enviado com sucesso");
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        smtpTransport.close();
    }

};