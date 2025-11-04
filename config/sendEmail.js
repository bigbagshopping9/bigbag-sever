import { error } from "console";
import { sendEmail } from "./emailService.js";

const sendEmailFun = async({to, subject, text, html})=>{
   try {
     console.log("sending email to", to)

     if(!to ||!to.includes('@')){
      throw new Error("Invalid recipient email.", +to);
     }

     const result = await sendEmail(to, subject, text, html);

     if(result.success){
      console.log("Email sent successfully", result.messageId);
      return {success:true, messageId:result.messageId};
     }else{
      console.error("Failed to send email",result.error);
      return {success:false, error:result.error};
     }

   } catch (error) {
     console.error("Error in sendEmailFun",result.message);
      return {success:false, error:error.message};
   }
}

export default sendEmailFun;