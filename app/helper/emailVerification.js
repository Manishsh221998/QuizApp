const transporter = require("../config/emailConfig");
const UserModel = require("../model/users");
const dotenv=require('dotenv')
dotenv.config()

const sendEmailVerification = async (req, data) => {
  try {
      const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${data._id}`;
    
    const info = await transporter.sendMail({
      from: `"Quize App" <${process.env.EMAIL_FROM}>`,
      to: data.email,
      subject: "Verify Your Email for Quize App",
      text: `Please verify your email by clicking the following link: ${verificationLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Quize App!</h2>
          <p>Thank you for registering. Please verify your email address to complete your account setup.</p>
          <p style="margin: 20px 0;">
            <a href="${verificationLink}" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
          <p>If you didn't create an account with Quize App, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">This email was sent to ${data.email} as part of your Quize App account registration.</p>
        </div>
      `,
    });
    
    console.log("Verification email sent successfully: %s", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;  
  }
};

module.exports = sendEmailVerification;