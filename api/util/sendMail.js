const nodemailer = require('nodemailer')
async function sendMail(options){
    const transporter = nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port :process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    })
    const mailOpions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject :options.subject,
        text : options.message,
    }
    await transporter.sendMail(mailOpions)
} 
module.exports = sendMail
