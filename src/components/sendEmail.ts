import { Resend } from 'resend';
import VerificationEmailTemplate from '../../emailTemplates/verificationEmailTemplate';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(username: string, otp: string, email: string) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message | Verification Code",
      react: VerificationEmailTemplate({ username, otp })
    })
    return true
  } catch (emailError) {
    console.error("Error sending verification email", emailError)
    return false 
  }
}
