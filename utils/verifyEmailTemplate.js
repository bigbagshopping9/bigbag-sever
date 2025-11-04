const VerificationEmail = (username, otp) =>{
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
  body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
  }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
      }

      .header {
        text-align: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }

      .header h1 {
         color: #4caf50;
      }

      .content{
         text-align: center;
      }

      .content p {
         font-size: 16px;
         line-height: 1.5;
      }

      .otp {
         font-size: 20px;
         font-weight: bold;
         color: #4caf50;
         margin-top: 20px;
      }
      
      .footer{
         text-align: center;
         font-size: 14px;
         color: #777;
         margin-top: 20px;
      }
         </style>
       </head>
      <body>
         <div class="container">
         <div class="header">
         <h1> Hii ${username} please Verify Your Email Address </h1>
         </div>
         <div class="content">

         <p> Thank You for registering with Bigbag Online Shopping. Please use the OTP below to verify your Email address:</p>
         <div class="otp">${otp}</div>
         <p> If you didn't create an Account, you can safely ignore this Email.</p>
       </div>
      <div class="footer">
        <p>&copy; 2025 Bigbag Online Shopping. All right reserved.</p>
        </div>
      </div>
    </body>
   </html>
   
   `;
};

export default VerificationEmail;
