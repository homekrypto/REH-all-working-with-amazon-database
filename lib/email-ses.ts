// Replace your current email service with AWS SES
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({ 
  region: process.env.AWS_SES_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  }
})

export async function sendEmailSES(to: string, subject: string, htmlBody: string) {
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: htmlBody } }
    }
  })
  
  return await sesClient.send(command)
}

// Use same AWS credentials as S3 - no additional setup needed!
