const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "90acdc9303a27a",
        pass: "a0f9f1932ef339"
    }
});