// AWS Services Integration - Central hub for all AWS services
import { logger, logAPIRequest } from './logger-aws'
import { sendEmail, sendVerificationEmail, sendPasswordResetEmail } from './email-aws'
import { cache, checkRateLimit } from './cache-aws'
import { NextRequest } from 'next/server'

// Request context for AWS services
interface AWSContext {
  requestId: string
  userId?: string
  ip: string
  userAgent: string
}

export function createAWSContext(req: NextRequest, userId?: string): AWSContext {
  return {
    requestId: Math.random().toString(36).substr(2, 9),
    userId,
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown'
  }
}

// Enhanced API route wrapper with AWS services
export function withAWS(handler: (req: NextRequest, context: AWSContext) => Promise<Response>) {
  return async (req: NextRequest) => {
    const context = createAWSContext(req)
    
    try {
      // Log API request
      logAPIRequest(req.method, req.url, context.userId, context.requestId)
      
      // Rate limiting (if Redis is available)
      const rateLimit = await checkRateLimit(context.ip, req.url)
      if (!rateLimit.allowed) {
        logger.warn('Rate limit exceeded', {
          ip: context.ip,
          endpoint: req.url,
          current: rateLimit.current,
          max: rateLimit.max
        }, context)
        
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded',
          resetTime: rateLimit.resetTime
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimit.max.toString(),
            'X-RateLimit-Remaining': Math.max(0, rateLimit.max - rateLimit.current).toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
          }
        })
      }
      
      // Execute the handler
      const response = await handler(req, context)
      
      // Log successful response
      logger.info('API request completed', {
        status: response.status,
        endpoint: req.url
      }, context)
      
      return response
      
    } catch (error) {
      // Log and handle errors
      logger.error('API request failed', error, context)
      
      return new Response(JSON.stringify({
        error: 'Internal server error',
        requestId: context.requestId
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

// Email service wrapper
export class AWSEmailService {
  static async sendVerification(email: string, token: string, context?: AWSContext) {
    try {
      const result = await sendVerificationEmail(email, token)
      
      logger.info('Verification email sent', {
        email: email.replace(/(.{3}).*@/, '$1***@'), // Partially mask email
        success: result.success,
        messageId: result.messageId
      }, context)
      
      return result
    } catch (error) {
      logger.error('Failed to send verification email', error, context)
      throw error
    }
  }

  static async sendPasswordReset(email: string, token: string, context?: AWSContext) {
    try {
      const result = await sendPasswordResetEmail(email, token)
      
      logger.info('Password reset email sent', {
        email: email.replace(/(.{3}).*@/, '$1***@'),
        success: result.success,
        messageId: result.messageId
      }, context)
      
      return result
    } catch (error) {
      logger.error('Failed to send password reset email', error, context)
      throw error
    }
  }

  static async sendCustom(to: string, subject: string, htmlBody: string, context?: AWSContext) {
    try {
      const result = await sendEmail(to, subject, htmlBody)
      
      logger.info('Custom email sent', {
        to: to.replace(/(.{3}).*@/, '$1***@'),
        subject,
        success: result.success,
        messageId: result.messageId
      }, context)
      
      return result
    } catch (error) {
      logger.error('Failed to send custom email', error, context)
      throw error
    }
  }
}

// Cache service wrapper
export class AWSCacheService {
  static async get<T>(key: string, context?: AWSContext): Promise<T | null> {
    try {
      const result = await cache.get<T>(key)
      
      logger.debug('Cache get', {
        key,
        hit: result !== null
      }, context)
      
      return result
    } catch (error) {
      logger.error('Cache get failed', error, context)
      return null
    }
  }

  static async set(key: string, value: any, ttlSeconds?: number, context?: AWSContext): Promise<boolean> {
    try {
      const result = await cache.set(key, value, ttlSeconds)
      
      logger.debug('Cache set', {
        key,
        ttl: ttlSeconds,
        success: result
      }, context)
      
      return result
    } catch (error) {
      logger.error('Cache set failed', error, context)
      return false
    }
  }
}

// Health check for all AWS services
export async function checkAWSHealth() {
  const health = {
    database: false,
    s3: false,
    email: false,
    cache: false,
    monitoring: false,
    timestamp: new Date().toISOString()
  }

  try {
    // Test database connection
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    await prisma.$queryRaw`SELECT 1`
    health.database = true
    await prisma.$disconnect()
  } catch (error) {
    logger.error('Database health check failed', error)
  }

  try {
    // Test S3 connection (via existing AWS SDK)
    const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3')
    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      }
    })
    await s3Client.send(new HeadBucketCommand({ Bucket: process.env.S3_BUCKET_NAME }))
    health.s3 = true
  } catch (error) {
    logger.error('S3 health check failed', error)
  }

  try {
    // Test email service (just check if SES client can be created)
    health.email = !!(process.env.USE_AWS_SES === 'true' || process.env.SMTP_HOST)
  } catch (error) {
    logger.error('Email health check failed', error)
  }

  try {
    // Test cache service
    const testKey = 'health-check-' + Date.now()
    await cache.set(testKey, 'ok', 10)
    const value = await cache.get(testKey)
    health.cache = value === 'ok'
    await cache.del(testKey)
  } catch (error) {
    logger.error('Cache health check failed', error)
  }

  health.monitoring = process.env.ENABLE_AWS_MONITORING === 'true'

  logger.info('AWS services health check completed', health)
  return health
}

export { logger, cache, sendEmail }
