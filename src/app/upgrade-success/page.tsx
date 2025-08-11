'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Crown, Building2, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function UpgradeSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState('')
  const [upgradeDetails, setUpgradeDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      fetchUpgradeDetails(sessionIdParam)
    } else {
      // Redirect if no session ID
      setTimeout(() => router.push('/dashboard'), 3000)
    }
  }, [searchParams, router])

  const fetchUpgradeDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/upgrade-session?session_id=${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        setUpgradeDetails(data.details)
      }
    } catch (error) {
      console.error('Error fetching upgrade details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'agent': return <Building2 className="h-8 w-8 text-green-600" />
      case 'expert': return <Crown className="h-8 w-8 text-purple-600" />
      default: return <CheckCircle className="h-8 w-8 text-blue-600" />
    }
  }

  const getRoleName = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'agent': return 'Agent'
      case 'expert': return 'Expert'
      default: return 'Pro'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'agent': return 'bg-green-100 text-green-800'
      case 'expert': return 'bg-purple-100 text-purple-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your upgrade...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Upgrade Successful! 🎉
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-gray-600"
            >
              Welcome to your new plan! Your account has been upgraded.
            </motion.p>
          </div>

          {/* Upgrade Details */}
          {upgradeDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="mb-6 border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getRoleIcon(upgradeDetails.newRole)}
                    <span>Your New Plan</span>
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan:</span>
                    <Badge className={getRoleColor(upgradeDetails.newRole)}>
                      {getRoleName(upgradeDetails.newRole)} Plan
                    </Badge>
                  </div>
                  {upgradeDetails.billingPeriod && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Billing:</span>
                      <span className="font-medium capitalize">{upgradeDetails.billingPeriod}</span>
                    </div>
                  )}
                  {upgradeDetails.amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${upgradeDetails.amount}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-center">What's Next?</CardTitle>
                <CardDescription className="text-center">
                  Start exploring your new features and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-900 mb-1">
                        Explore Your New Dashboard
                      </h3>
                      <p className="text-sm text-purple-800">
                        Your dashboard has been updated with new features and tools
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Set Up Your Profile
                      </h3>
                      <p className="text-sm text-blue-800">
                        Complete your profile to get the most out of your new plan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1">
                        Start Using New Features
                      </h3>
                      <p className="text-sm text-green-800">
                        Begin leveraging your new tools to grow your business
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-center"
          >
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>

          {/* Receipt Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500">
              A receipt has been sent to your email address.
              <br />
              Need help? <Link href="/support" className="text-purple-600 hover:underline">Contact our support team</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpgradeSuccessContent />
    </Suspense>
  )
}
