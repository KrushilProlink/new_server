import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
import ejs from "ejs";

export const sendMail = async (data) => {

  try {
    // const templatePath = path.join(
    //   __dirname,
    //   "email-templates",
    //   `${templateName}.ejs`
    // );
    // const template = await ejs.renderFile(templatePath, data);

    // Create a Nodemailer transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vaibhav.specscale@gmail.com",
        pass: "btwtfowownkmtdvt",
      },
    });

    // Define the email options
    let mailOptions = {
      from: `${data.from}`,
      to: `${data.to}`,
      subject:`${data.subject}`,
      html: data.template.html,
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
