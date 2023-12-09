const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (message, user) => {
    try {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Welcome to Blog App",
    text: message,
  };

  const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {

    console.error('Email error:', error);
  }
};
module.exports = 
  sendEmail

