// AWS CloudWatch Logging - Replace console.log for production
import { 
  CloudWatchLogsClient, 
  CreateLogStreamCommand,
  PutLogEventsCommand,
  DescribeLogStreamsCommand
} from "@aws-sdk/client-cloudwatch-logs"

const isProduction = process.env.NODE_ENV === 'production'
const logGroupName = process.env.AWS_CLOUDWATCH_LOG_GROUP || '/aws/amplify/realestate-platform'

let cloudWatchClient: CloudWatchLogsClient | null = null

if (isProduction && process.env.ENABLE_AWS_MONITORING === 'true') {
  cloudWatchClient = new CloudWatchLogsClient({
    region: process.env.S3_REGION || 'eu-north-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    }
  })
}

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  data?: any
  userId?: string
  requestId?: string
}

export class AWSLogger {
  private logStreamName: string
  private buffer: any[] = []
  private flushTimer: NodeJS.Timeout | null = null

  constructor() {
    this.logStreamName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    this.createLogStream()
  }

  private async createLogStream() {
    if (!cloudWatchClient) return

    try {
      await cloudWatchClient.send(new CreateLogStreamCommand({
        logGroupName,
        logStreamName: this.logStreamName
      }))
    } catch (error) {
      // Log stream might already exist, continue
    }
  }

  private async flush() {
    if (!cloudWatchClient || this.buffer.length === 0) return

    try {
      const logEvents = this.buffer.map(entry => ({
        timestamp: entry.timestamp,
        message: JSON.stringify(entry)
      }))

      await cloudWatchClient.send(new PutLogEventsCommand({
        logGroupName,
        logStreamName: this.logStreamName,
        logEvents
      }))

      this.buffer = []
    } catch (error) {
      console.error('Failed to send logs to CloudWatch:', error)
    }
  }

  private addToBuffer(entry: LogEntry) {
    const logEntry = {
      timestamp: Date.now(),
      level: entry.level,
      message: entry.message,
      data: entry.data,
      userId: entry.userId,
      requestId: entry.requestId,
      environment: process.env.NODE_ENV,
      service: 'realestate-platform'
    }

    this.buffer.push(logEntry)

    // Flush buffer every 5 seconds or when it reaches 10 entries
    if (this.buffer.length >= 10) {
      this.flush()
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flush()
        this.flushTimer = null
      }, 5000)
    }
  }

  info(message: string, data?: any, context?: { userId?: string, requestId?: string }) {
    const entry: LogEntry = { level: 'info', message, data, ...context }
    
    // Always log to console in development
    if (!isProduction) {
      console.log(`[INFO] ${message}`, data || '')
    }
    
    // Send to CloudWatch in production
    if (cloudWatchClient) {
      this.addToBuffer(entry)
    }
  }

  error(message: string, error?: any, context?: { userId?: string, requestId?: string }) {
    const entry: LogEntry = { 
      level: 'error', 
      message, 
      data: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      ...context 
    }
    
    // Always log errors to console
    console.error(`[ERROR] ${message}`, error || '')
    
    // Send to CloudWatch
    if (cloudWatchClient) {
      this.addToBuffer(entry)
    }
  }

  warn(message: string, data?: any, context?: { userId?: string, requestId?: string }) {
    const entry: LogEntry = { level: 'warn', message, data, ...context }
    
    if (!isProduction) {
      console.warn(`[WARN] ${message}`, data || '')
    }
    
    if (cloudWatchClient) {
      this.addToBuffer(entry)
    }
  }

  debug(message: string, data?: any, context?: { userId?: string, requestId?: string }) {
    const entry: LogEntry = { level: 'debug', message, data, ...context }
    
    if (!isProduction) {
      console.debug(`[DEBUG] ${message}`, data || '')
    }
    
    if (cloudWatchClient && process.env.LOG_LEVEL === 'debug') {
      this.addToBuffer(entry)
    }
  }
}

// Export singleton instance
export const logger = new AWSLogger()

// Utility functions for common use cases
export const logUserAction = (action: string, userId: string, data?: any) => {
  logger.info(`User action: ${action}`, data, { userId })
}

export const logAPIRequest = (method: string, path: string, userId?: string, requestId?: string) => {
  logger.info(`API ${method} ${path}`, undefined, { userId, requestId })
}

export const logError = (error: Error, context?: string, userId?: string) => {
  logger.error(`${context || 'Application'} error: ${error.message}`, error, { userId })
}
