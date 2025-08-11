'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, CreditCard, ArrowRight, Clock, Shield } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function RegistrationSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [packageName, setPackageName] = useState('')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const roleParam = searchParams.get('role')
    const packageParam = searchParams.get('package')

    if (emailParam) setEmail(decodeURIComponent(emailParam))
    if (roleParam) setRole(roleParam)
    if (packageParam) setPackageName(decodeURIComponent(packageParam))

    // Only redirect to login if no parameters after a longer delay AND we're sure the page has loaded
    if (!emailParam && !roleParam) {
      console.log('No registration parameters found - this might be a direct visit')
      // Set a much longer delay to avoid premature redirects
      setTimeout(() => {
        if (!email && !role) { // Double check the state variables too
          console.log('Redirecting to registration page due to missing parameters')
          router.push('/register')
        }
      }, 8000) // Increased delay to 8 seconds
    }
  }, [searchParams, router, email, role])

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'agent': return 'Real Estate Agent'
      case 'expert': return 'Real Estate Expert'
      default: return 'User'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'agent': return '🏢'
      case 'expert': return '👑'
      default: return '👤'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
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
              Registration Successful! 🎉
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-gray-600"
            >
              {role ? (
                `Welcome to our platform, ${getRoleDisplayName(role)}!`
              ) : (
                'Welcome to our platform! Your registration was successful.'
              )}
            </motion.p>
          </div>

          {/* Registration Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="mb-6 border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{getRoleIcon(role)}</span>
                  <span>Your Registration Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Role:</span>
                  <Badge variant="secondary">{getRoleDisplayName(role)}</Badge>
                </div>
                {packageName && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Package:</span>
                    <Badge className="bg-blue-100 text-blue-800">{packageName}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-center">Next Steps to Complete Your Setup</CardTitle>
                <CardDescription className="text-center">
                  Follow these steps to activate your account and start using our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1: Email Verification */}
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Check Your Email for Verification
                      </h3>
                      <p className="text-sm text-blue-800 mb-2">
                        We've sent a verification email to <strong>{email}</strong>
                      </p>
                      <p className="text-xs text-blue-700">
                        Click the verification link in your email to activate your account
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Payment (for paid users) */}
                  {role !== 'user' && (
                    <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-900 mb-1 flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Complete Your Payment
                        </h3>
                        <p className="text-sm text-orange-800 mb-2">
                          After email verification, you'll be redirected to secure payment
                        </p>
                        <p className="text-xs text-orange-700">
                          Your subscription will be activated immediately after payment
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Dashboard Access */}
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {role !== 'user' ? '3' : '2'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Access Your Dashboard
                      </h3>
                      <p className="text-sm text-green-800 mb-2">
                        Start using all the features available in your {getRoleDisplayName(role)} account
                      </p>
                      <p className="text-xs text-green-700">
                        Full access will be available after completing the steps above
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => window.open('https://gmail.com', '_blank')}
              className="flex items-center justify-center"
              size="lg"
            >
              <Mail className="h-4 w-4 mr-2" />
              Open Email
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push('/auth/login')}
              size="lg"
            >
              Go to Login
            </Button>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Didn't receive the email? Check your spam folder or</span>
              <Link href="/auth/resend-verification" className="text-blue-600 hover:underline">
                resend verification
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationSuccessContent />
    </Suspense>
  )
}