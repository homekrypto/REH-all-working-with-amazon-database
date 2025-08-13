// AWS ElastiCache Redis Client - For caching and sessions
import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType | null = null
let isConnected = false

// Initialize Redis connection
export async function initRedis() {
  if (redisClient && isConnected) return redisClient

  const redisUrl = process.env.REDIS_URL
  
  if (!redisUrl) {
    console.log('📝 Redis not configured - using in-memory caching')
    return null
  }

  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      }
    })

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err)
      isConnected = false
    })

    redisClient.on('connect', () => {
      console.log('✅ Redis connected')
      isConnected = true
    })

    redisClient.on('disconnect', () => {
      console.log('📡 Redis disconnected')
      isConnected = false
    })

    await redisClient.connect()
    return redisClient

  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error)
    redisClient = null
    isConnected = false
    return null
  }
}

// Cache utility functions
export class AWSCache {
  private fallbackCache: Map<string, { value: any, expiry: number }> = new Map()

  async get<T>(key: string): Promise<T | null> {
    try {
      if (redisClient && isConnected) {
        const value = await redisClient.get(key)
        return value ? JSON.parse(value) : null
      }
      
      // Fallback to in-memory cache
      const cached = this.fallbackCache.get(key)
      if (cached && cached.expiry > Date.now()) {
        return cached.value
      }
      
      this.fallbackCache.delete(key)
      return null
      
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<boolean> {
    try {
      if (redisClient && isConnected) {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value))
        return true
      }
      
      // Fallback to in-memory cache
      this.fallbackCache.set(key, {
        value,
        expiry: Date.now() + (ttlSeconds * 1000)
      })
      
      return true
      
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (redisClient && isConnected) {
        await redisClient.del(key)
      }
      
      this.fallbackCache.delete(key)
      return true
      
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (redisClient && isConnected) {
        const exists = await redisClient.exists(key)
        return exists === 1
      }
      
      const cached = this.fallbackCache.get(key)
      return cached ? cached.expiry > Date.now() : false
      
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  // Increment counter (useful for rate limiting)
  async incr(key: string, ttlSeconds?: number): Promise<number> {
    try {
      if (redisClient && isConnected) {
        const result = await redisClient.incr(key)
        if (ttlSeconds && result === 1) {
          await redisClient.expire(key, ttlSeconds)
        }
        return result
      }
      
      // Fallback implementation
      const current = this.fallbackCache.get(key)
      const newValue = current ? current.value + 1 : 1
      
      this.fallbackCache.set(key, {
        value: newValue,
        expiry: Date.now() + ((ttlSeconds || 300) * 1000)
      })
      
      return newValue
      
    } catch (error) {
      console.error('Cache incr error:', error)
      return 0
    }
  }

  // Clear expired entries from fallback cache
  private cleanup() {
    const now = Date.now()
    for (const [key, cached] of this.fallbackCache.entries()) {
      if (cached.expiry <= now) {
        this.fallbackCache.delete(key)
      }
    }
  }
}

// Export singleton instance
export const cache = new AWSCache()

// Common cache keys and utilities
export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  listing: (id: string) => `listing:${id}`,
  listings: (page: number, filters?: string) => `listings:${page}:${filters || 'all'}`,
  session: (token: string) => `session:${token}`,
  rateLimit: (ip: string, endpoint: string) => `rate:${ip}:${endpoint}`,
  emailVerification: (email: string) => `email_verify:${email}`,
  passwordReset: (email: string) => `pwd_reset:${email}`
}

// Cache user data
export async function cacheUser(user: any, ttlSeconds = 300) {
  return await cache.set(CacheKeys.user(user.id), user, ttlSeconds)
}

export async function getCachedUser(userId: string) {
  return await cache.get(CacheKeys.user(userId))
}

// Cache listings
export async function cacheListings(page: number, listings: any[], filters?: string, ttlSeconds = 180) {
  return await cache.set(CacheKeys.listings(page, filters), listings, ttlSeconds)
}

export async function getCachedListings(page: number, filters?: string) {
  return await cache.get(CacheKeys.listings(page, filters))
}

// Rate limiting
export async function checkRateLimit(ip: string, endpoint: string, maxRequests = 100, windowSeconds = 3600) {
  const key = CacheKeys.rateLimit(ip, endpoint)
  const current = await cache.incr(key, windowSeconds)
  return {
    allowed: current <= maxRequests,
    current,
    max: maxRequests,
    resetTime: Date.now() + (windowSeconds * 1000)
  }
}

// Initialize Redis on startup
initRedis().catch(console.error)
