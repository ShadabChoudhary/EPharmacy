const nodemailer = require("nodemailer");
const userMODEL = require("../model/userModel.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");

const maildetail = async (req, res) => {
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

  return resetPassUrl;
};

//send Email
async function sendMails(options, req, res) {
  const a = await maildetail(req, res);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body{
              font-family: 'Raleway', sans-serif;            
            }
            
            .main-container {
              height: 50%px;
              width: 40%px;
              padding: 20px;
              background-color: rgb(228, 222, 222);
            }

            .container{
              background: "https://www.google.com/intl/en_com/images/srpr/logo3w.png";
              margin: 0 auto;
              text-align: center;
              color: black;
              box-shadow: 0 4px 8px 0 rgb(0, 0, 0, 0.5);
            }

            .middle-title{
              margin: 60px 0;
            }

            .a-link {
              margin: 60px 0;
              color: #ffffff;
            }

            .a-link-button{
              background-color:#fb641b;
              padding: 20px;
              border-radius: 50px;
              text-decoration: none;
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
            }

            .lower-title{
              margin: 60px 0;
            }
          </style>
        </head>
        
        <body>
 
        <div class="main-container">
          <div class="container">
            <div class="upper-title">
              <h1 class="uppar-txt"> Reset your Online Pharmacy password</h1>
            </div>
            <div class=middle-title>
              <h3 class="middel-txt">You recently requested to reset the password for your Online Medical Shop account. Click the button below to proceed.</h3>
            </div>
            <div class="a-link">
              <a class="a-link-button" href="${a}">Set a new password</a>
            </div>
            <div class="lower-title">
              <h4 class="lower-txt">If you didn't request a password reset, you can ignore this email. Your password will not be changed</h4>
            </div>
          </div>
        </div> 
      </body>
        </html>`,
  };

  const mailsent = transporter.sendMail(mailOptions);

  return mailsent;
}

module.exports = sendMails;
