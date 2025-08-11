'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'AGENT' | 'EXPERT'
  subscriptionStatus: 'FREE' | 'PENDING' | 'ACTIVE' | 'CANCELED' | 'EXPIRED'
  packageId?: string
  subscriptionEnd?: Date
  emailVerified?: Date | null
  package?: {
    id: string
    name: string
    description: string
    price: number
    interval: string
    listingsMax: number
    features: Record<string, any>
  }
}

interface UserContextType {
  user: User | null
  loading: boolean
  refetch: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    if (!session?.user?.email) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      // Get user details from our database
      const response = await fetch('/api/user/profile')
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchUser()
    } else {
      setUser(null)
      setLoading(false)
    }
  }, [session])

  const refetch = async () => {
    setLoading(true)
    await fetchUser()
  }

  return (
    <UserContext.Provider value={{ user, loading, refetch }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
