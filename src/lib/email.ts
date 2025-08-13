import nodemailer from 'nodemailer'

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor(config?: EmailConfig) {
    // Use environment variables or fallback to development config
    const emailConfig = config || {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    }

    // For development, use Ethereal Email (test service)
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
      console.log('Using development email mode - emails will be logged to console')
      this.transporter = nodemailer.createTransport({
        jsonTransport: true
      })
    } else {
      this.transporter = nodemailer.createTransport(emailConfig)
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@realestateplatform.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html)
      }

      const result = await this.transporter.sendMail(mailOptions)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email sent (development mode):')
        console.log('To:', options.to)
        console.log('Subject:', options.subject)
        console.log('Preview URL:', nodemailer.getTestMessageUrl(result))
        console.log('Message:', JSON.stringify(result.message, null, 2))
      }

      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  async sendVerificationEmail(email: string, name: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/auth/verify-email?token=${verificationToken}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Real Estate Platform!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for registering with our platform. To complete your registration, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #3b82f6;">${verificationUrl}</p>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create an account with us, please ignore this email.</p>
              
              <p>Best regards,<br>The Real Estate Platform Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address - Real Estate Platform',
      html
    })
  }

  async sendWelcomeEmail(email: string, name: string, role: string): Promise<boolean> {
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/dashboard`
    
    const roleMessages = {
      USER: 'You can now browse properties and connect with agents.',
      AGENT: 'You can now manage your listings and connect with potential clients.',
      EXPERT: 'You now have access to premium marketing tools and AI-powered features.'
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Real Estate Platform</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Real Estate Platform!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Your email has been verified and your account is now active!</p>
              
              <p><strong>Account Type:</strong> ${role}</p>
              <p>${roleMessages[role as keyof typeof roleMessages] || 'Welcome to our platform!'}</p>
              
              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
              </div>
              
              <p>Here are some things you can do next:</p>
              <ul>
                ${role === 'USER' ? `
                  <li>Browse available properties</li>
                  <li>Save your favorite listings</li>
                  <li>Contact agents directly</li>
                ` : role === 'AGENT' ? `
                  <li>Create your first property listing</li>
                  <li>Set up your agent profile</li>
                  <li>Start connecting with potential buyers</li>
                ` : `
                  <li>Create premium property listings</li>
                  <li>Access AI-powered marketing tools</li>
                  <li>Set up automated social media posting</li>
                  <li>Configure your lead capture forms</li>
                `}
              </ul>
              
              <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
              
              <p>Best regards,<br>The Real Estate Platform Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Real Estate Platform - Account Activated!',
      html
    })
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }
}

// Export singleton instance
export const emailService = new EmailService()
