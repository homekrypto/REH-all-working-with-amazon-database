// AWS SES Email Service - Replace nodemailer
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({ 
  region: process.env.S3_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  }
})

export async function sendEmail(to: string, subject: string, htmlBody: string, textBody?: string) {
  try {
    const command = new SendEmailCommand({
      Source: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      Destination: { 
        ToAddresses: [to] 
      },
      Message: {
        Subject: { 
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: { 
            Data: htmlBody,
            Charset: 'UTF-8'
          },
          Text: textBody ? {
            Data: textBody,
            Charset: 'UTF-8'
          } : undefined
        }
      }
    })
    
    const result = await sesClient.send(command)
    console.log('✅ Email sent via AWS SES:', result.MessageId)
    return { success: true, messageId: result.MessageId }
    
  } catch (error) {
    console.error('❌ AWS SES email failed:', error)
    
    // Fallback to nodemailer if SES fails
    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: htmlBody,
        text: textBody,
      })

      console.log('✅ Email sent via SMTP fallback:', info.messageId)
      return { success: true, messageId: info.messageId, fallback: true }
      
    } catch (fallbackError) {
      console.error('❌ Both SES and SMTP failed:', fallbackError)
      return { success: false, error: fallbackError }
    }
  }
}

// Utility functions for common email types
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Thank you for registering with our Real Estate Platform!</p>
      <p>Please click the button below to verify your email address:</p>
      <a href="${verifyUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Verify Email
      </a>
      <p>Or copy and paste this link: ${verifyUrl}</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `
  
  return await sendEmail(email, 'Verify Your Email Address', htmlBody)
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password.</p>
      <p>Please click the button below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
      <p>Or copy and paste this link: ${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `
  
  return await sendEmail(email, 'Reset Your Password', htmlBody)
}
