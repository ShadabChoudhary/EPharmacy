const nodemailer = require('nodemailer')
const userMODEL = require("../model/userModel.js");
const catchAsyncError= require('../middleware/catchAsyncError.js')


const maildetail = async(req,res)=>{
const user = await userMODEL.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //Get ResetPass Token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetPassUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/password/reset/${resetToken}`;

    return resetPassUrl
}

//send Email
async function sendMails(options,req,res) {

    const a = await maildetail(req,res)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        html: `<div><h1>Your Reset Password Token <a href="${a}">Reset</a><h1></div>`
    }

    const mailsent = transporter.sendMail(mailOptions)

    return mailsent
}

module.exports = sendMails
