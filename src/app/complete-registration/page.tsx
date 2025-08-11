'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, Crown, Building, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Package {
  id: string
  name: string
  description: string
  price: number
  interval: string
  listingsMax: number
  features: Record<string, any>
  stripePriceId: string
}

export default function CompleteRegistrationPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    // TODO: Get user role from session or API
    // For now, assume we can get it from somewhere
    loadPackages()
  }, [session, router])

  const loadPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      const data = await response.json()
      
      if (data.success) {
        setPackages(data.packages)
        
        // Auto-select first compatible package
        if (userRole === 'AGENT') {
          const agentPackage = data.packages.find((pkg: Package) => 
            pkg.name.toLowerCase().includes('agent')
          )
          if (agentPackage) setSelectedPackage(agentPackage)
        } else if (userRole === 'EXPERT') {
          const expertPackage = data.packages.find((pkg: Package) => 
            pkg.name.toLowerCase().includes('expert')
          )
          if (expertPackage) setSelectedPackage(expertPackage)
        }
      }
    } catch (error) {
      console.error('Failed to load packages:', error)
      toast({
        title: 'Error',
        description: 'Failed to load subscription packages',
        variant: 'destructive'
      })
    }
  }

  const handlePayment = async () => {
    if (!selectedPackage) {
      toast({
        title: 'No package selected',
        description: 'Please select a subscription package',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: `${window.location.origin}/complete-registration?payment=canceled`
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Redirect to Stripe Checkout
        const stripe = await stripePromise
        if (stripe && result.checkoutUrl) {
          window.location.href = result.checkoutUrl
        }
      } else {
        toast({
          title: 'Payment setup failed',
          description: result.error || 'Unable to create payment session',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Payment error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    if (role.includes('AGENT')) return <Building className="h-6 w-6" />
    if (role.includes('EXPERT')) return <Crown className="h-6 w-6" />
    return <Building className="h-6 w-6" />
  }

  const formatPrice = (price: number, interval: string) => {
    const amount = price / 100
    return `$${amount}/${interval}`
  }

  const getFilteredPackages = () => {
    return packages.filter(pkg => {
      if (userRole === 'AGENT') {
        return pkg.name.toLowerCase().includes('agent')
      }
      if (userRole === 'EXPERT') {
        return pkg.name.toLowerCase().includes('expert')
      }
      return false
    })
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Complete Your Registration
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Choose your subscription plan to unlock all features
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-green-800">
                <strong>✅ Email verified!</strong> Now select your subscription to get started.
              </p>
            </div>
          </div>

          {/* Package Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {getFilteredPackages().map((pkg) => (
              <Card 
                key={pkg.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPackage?.id === pkg.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(pkg.name)}
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    </div>
                    {selectedPackage?.id === pkg.id && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(pkg.price, pkg.interval)}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Up to {pkg.listingsMax} listings
                    </li>
                    {pkg.features.support && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {pkg.features.support.replace('_', ' ')} support
                      </li>
                    )}
                    {pkg.features.analytics && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Advanced analytics
                      </li>
                    )}
                    {pkg.features.marketing && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Marketing toolkit
                      </li>
                    )}
                    {pkg.features.ai_blog && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        AI-powered blog
                      </li>
                    )}
                    {pkg.features.social_media && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Social media integration
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Button */}
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Selected Plan</CardTitle>
                  <CardDescription>
                    {selectedPackage.name} - {formatPrice(selectedPackage.price, selectedPackage.interval)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handlePayment}
                    disabled={isLoading}
                    size="lg"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Complete Subscription
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-600">
                    Secure payment powered by Stripe. Cancel anytime.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-600">
            <p>Already have an active subscription? 
              <Link href="/dashboard" className="text-blue-600 hover:underline ml-1">
                Go to Dashboard
              </Link>
            </p>
            <p className="mt-2">
              Questions? 
              <Link href="/contact" className="text-blue-600 hover:underline ml-1">
                Contact Support
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
