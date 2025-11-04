import http from 'http';
import nodemailer from 'nodemailer';
import VerificationEmail from '../utils/verifyEmailTemplate.js';
import dotenv from 'dotenv';
dotenv.config()

//configure the smtp transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com' for gmail
  port: 465, // or 465 for secure
  secure: true,  //true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,  //your SMTP username
    pass: process.env.EMAIL_PASS,  //your SMTP password,,\
  },
});

sendEmail(VerificationEmail).then(console.log).catch(console.error);
// sendEmail(
//   "bigbagshopping9@gmail.com",
//   "Please Verify Your Email",
  
// )

//function to send Email
async function sendEmail(to, subject, text, html) {
  try{
    // console.log("send mail", to);
    const info = await transporter.sendMail({
      from: `"Bigbag Shopping" <${process.env.EMAIL}>`, // sender address
      to:to.trim(), //list of receivers
      subject, //subject line
      text,  //plain text body
      html,  //html body
    });

    console.log("email sent successfully", info);

    return {success: true, messageId: info.messageId};
  }catch(error) {
    console.error('Error Sending email:', error);
    return {success: false, error: error.message};
  }
}

export {sendEmail};
