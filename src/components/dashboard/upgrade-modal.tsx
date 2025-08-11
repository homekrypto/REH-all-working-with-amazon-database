'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Building2, 
  Check, 
  X, 
  ArrowRight,
  Star,
  Zap,
  Users,
  BarChart3,
  Shield,
  CreditCard
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'AGENT' | 'EXPERT'
  subscriptionStatus: string
  packageId?: string
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

interface UpgradeModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

interface UpgradeOption {
  to: string
  name: string
  price: number
  priceId: string
  yearly?: boolean
  discount?: string
  description: string
  features: string[]
}

// Define the plans structure at the top level
const plans = {
  agent_basic: {
    name: 'Agent Basic',
    current_price: 30,
    upgrades: [
      { 
        to: 'agent_standard', 
        name: 'Agent Standard', 
        price: 50, 
        priceId: 'price_agent_standard_monthly',
        description: 'For growing real estate professionals',
        features: ['Up to 50 property listings', 'Advanced analytics dashboard', 'Priority customer support', 'Professional agent profile', 'Lead capture forms']
      },
      { 
        to: 'agent_professional', 
        name: 'Agent Professional', 
        price: 100, 
        priceId: 'price_agent_professional_monthly',
        description: 'Advanced features for established agents',
        features: ['Up to 200 property listings', 'Advanced analytics & reporting', 'CRM integration', 'Custom branding options', 'Virtual tour support', 'Priority support']
      },
      { 
        to: 'expert_monthly', 
        name: 'Expert Monthly', 
        price: 200, 
        priceId: 'price_expert_monthly',
        description: 'Complete marketing suite with AI tools',
        features: ['Unlimited property listings', 'Advanced AI-powered insights', 'Full CRM integration', 'Custom domain & branding', 'Virtual tours & 3D walkthroughs', 'Dedicated account manager', 'API access']
      },
      { 
        to: 'expert_yearly', 
        name: 'Expert Yearly', 
        price: 1920, 
        priceId: 'price_expert_yearly', 
        yearly: true, 
        discount: '20%',
        description: 'Complete marketing suite with 20% yearly discount',
        features: ['Everything in Expert Monthly', '20% annual savings', 'Priority feature requests', 'Advanced training sessions', 'Custom integrations']
      }
    ] as UpgradeOption[]
  },
  agent_standard: {
    name: 'Agent Standard', 
    current_price: 50,
    upgrades: [
      { 
        to: 'agent_professional', 
        name: 'Agent Professional', 
        price: 100, 
        priceId: 'price_agent_professional_monthly',
        description: 'Advanced features for established agents',
        features: ['Up to 200 property listings', 'Advanced analytics & reporting', 'CRM integration', 'Custom branding options', 'Virtual tour support', 'Priority support']
      },
      { 
        to: 'expert_monthly', 
        name: 'Expert Monthly', 
        price: 200, 
        priceId: 'price_expert_monthly',
        description: 'Complete marketing suite with AI tools',
        features: ['Unlimited property listings', 'Advanced AI-powered insights', 'Full CRM integration', 'Custom domain & branding', 'Virtual tours & 3D walkthroughs', 'Dedicated account manager', 'API access']
      },
      { 
        to: 'expert_yearly', 
        name: 'Expert Yearly', 
        price: 1920, 
        priceId: 'price_expert_yearly', 
        yearly: true, 
        discount: '20%',
        description: 'Complete marketing suite with 20% yearly discount',
        features: ['Everything in Expert Monthly', '20% annual savings', 'Priority feature requests', 'Advanced training sessions', 'Custom integrations']
      }
    ] as UpgradeOption[]
  },
  agent_professional: {
    name: 'Agent Professional',
    current_price: 100,
    upgrades: [
      { 
        to: 'expert_monthly', 
        name: 'Expert Monthly', 
        price: 200, 
        priceId: 'price_expert_monthly',
        description: 'Complete marketing suite with AI tools',
        features: ['Unlimited property listings', 'Advanced AI-powered insights', 'Full CRM integration', 'Custom domain & branding', 'Virtual tours & 3D walkthroughs', 'Dedicated account manager', 'API access']
      },
      { 
        to: 'expert_yearly', 
        name: 'Expert Yearly', 
        price: 1920, 
        priceId: 'price_expert_yearly', 
        yearly: true, 
        discount: '20%',
        description: 'Complete marketing suite with 20% yearly discount',
        features: ['Everything in Expert Monthly', '20% annual savings', 'Priority feature requests', 'Advanced training sessions', 'Custom integrations']
      }
    ] as UpgradeOption[]
  },
  expert_monthly: {
    name: 'Expert Monthly',
    current_price: 200,
    upgrades: [
      { 
        to: 'expert_yearly', 
        name: 'Expert Yearly', 
        price: 1920, 
        priceId: 'price_expert_yearly', 
        yearly: true, 
        discount: '20%',
        description: 'Complete marketing suite with 20% yearly discount',
        features: ['Everything in Expert Monthly', '20% annual savings', 'Priority feature requests', 'Advanced training sessions', 'Custom integrations']
      }
    ] as UpgradeOption[]
  },
  expert_yearly: {
    name: 'Expert Yearly',
    current_price: 1920,
    upgrades: [] as UpgradeOption[]
  }
}

export default function UpgradeModal({ user, isOpen, onClose }: UpgradeModalProps) {
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeOption | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  if (!isOpen) return null

  // Determine current package tier based on user's package
  const getCurrentPackageTier = () => {
    if (!user.package) return 'agent_basic' // Default fallback
    
    const packageName = user.package.name.toLowerCase()
    if (packageName.includes('basic')) return 'agent_basic'
    if (packageName.includes('standard')) return 'agent_standard'
    if (packageName.includes('professional')) return 'agent_professional'
    if (packageName.includes('expert') && user.package.interval === 'month') return 'expert_monthly'
    if (packageName.includes('expert') && user.package.interval === 'year') return 'expert_yearly'
    
    return 'agent_basic' // Fallback
  }

  const currentTier = getCurrentPackageTier()
  const availableUpgrades = plans[currentTier]?.upgrades || []

  // If no upgrades available, show message
  if (availableUpgrades.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">You're on the highest tier!</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="text-center py-8">
            <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You're already on our top-tier {plans[currentTier]?.name} plan with all premium features!
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const handleUpgrade = async (upgrade: UpgradeOption) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/create-upgrade-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          priceId: upgrade.priceId,
          packageId: upgrade.to,
          targetRole: upgrade.to.includes('expert') ? 'EXPERT' : 'AGENT',
          currentRole: user.role
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create upgrade session')
      }

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      toast({
        title: "Upgrade Failed",
        description: "There was an error processing your upgrade. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upgrade Your Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Currently on: <span className="font-semibold">{plans[currentTier]?.name}</span> (${plans[currentTier]?.current_price}/month)
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableUpgrades.map((upgrade) => {
              const isYearly = upgrade.yearly
              
              return (
                <Card 
                  key={upgrade.to} 
                  className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg z-10 ${
                    selectedUpgrade?.to === upgrade.to 
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedUpgrade(upgrade)}
                >
                  <CardHeader className="text-center pb-4">
                    {upgrade.to.includes('expert') && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}
                    
                    <div className="mb-2">
                      {upgrade.to.includes('expert') ? (
                        <Crown className="h-8 w-8 text-yellow-500 mx-auto" />
                      ) : upgrade.to.includes('professional') ? (
                        <Star className="h-8 w-8 text-purple-500 mx-auto" />
                      ) : (
                        <Building2 className="h-8 w-8 text-blue-500 mx-auto" />
                      )}
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{upgrade.name}</CardTitle>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${isYearly ? '160' : upgrade.price}
                        <span className="text-base font-normal text-gray-500">
                          /{isYearly ? 'month' : 'month'}
                        </span>
                      </div>
                      {isYearly && (
                        <div className="text-sm text-gray-500 mt-1">
                          ${upgrade.price}/year • {upgrade.discount} savings
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {upgrade.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpgrade(upgrade)
                        }}
                        disabled={isLoading}
                        className="w-full"
                        variant={selectedUpgrade?.to === upgrade.to ? "default" : "outline"}
                      >
                        {isLoading ? (
                          "Processing..."
                        ) : (
                          <>
                            Upgrade to {upgrade.name}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              You can cancel or change your plan at any time. No long-term contracts.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
