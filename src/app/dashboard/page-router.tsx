'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/contexts/user-context'

// Import dashboard components
import UserDashboard from '@/components/dashboard/user-dashboard'
import AgentDashboard from '@/components/dashboard/agent-dashboard'
import ExpertDashboard from '@/components/dashboard/expert-dashboard'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    // Check if email verification is required
    if (user && !user.emailVerified) {
      router.push('/verify-email')
      return
    }

    // Check if subscription completion is required
    if (user && user.role !== 'USER' && user.subscriptionStatus === 'PENDING') {
      router.push('/complete-registration')
      return
    }
  }, [session, user, status, router])

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state if no user data
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Unable to load user data</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="text-blue-600 hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'AGENT':
      return <AgentDashboard user={user} />
    case 'EXPERT':
      return <ExpertDashboard user={user} />
    case 'USER':
    default:
      return <UserDashboard user={user} />
  }
}
