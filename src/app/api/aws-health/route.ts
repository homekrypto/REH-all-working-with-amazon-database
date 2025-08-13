// AWS Services Health Check API Route
import { NextRequest } from 'next/server'
import { checkAWSHealth, withAWS } from '@/lib/aws-services'

export const GET = withAWS(async (req: NextRequest, context) => {
  const health = await checkAWSHealth()
  
  // Only consider critical services for health status
  // Monitoring is optional in development
  const criticalServices = ['database', 's3', 'email', 'cache']
  const criticalHealthy = criticalServices.every(service => health[service] === true)
  
  return new Response(JSON.stringify({
    status: criticalHealthy ? 'healthy' : 'degraded',
    services: health,
    environment: process.env.NODE_ENV,
    requestId: context.requestId
  }), {
    status: criticalHealthy ? 200 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  })
})
