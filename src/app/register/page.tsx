'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Check, CheckCircle, User, Building, Crown, Mail, Lock, Phone, Building2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

// Form schemas for each step
const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const businessInfoSchema = z.object({
  agencyName: z.string().min(2, 'Agency name must be at least 2 characters'),
  bio: z.string().optional(),
})

type PersonalInfo = z.infer<typeof personalInfoSchema>
type BusinessInfo = z.infer<typeof businessInfoSchema>

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

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<'USER' | 'AGENT' | 'EXPERT' | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [registrationData, setRegistrationData] = useState<Partial<PersonalInfo & BusinessInfo>>({})
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  // Form for personal info
  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    }
  })

  // Form for business info
  const businessForm = useForm<BusinessInfo>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      agencyName: '',
      bio: '',
    }
  })

  // Load packages when role is selected
  const loadPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      const data = await response.json()
      if (data.success) {
        setPackages(data.packages)
      }
    } catch (error) {
      console.error('Failed to load packages:', error)
    }
  }

  const handleRoleSelect = (role: 'USER' | 'AGENT' | 'EXPERT') => {
    setSelectedRole(role)
    if (role !== 'USER') {
      loadPackages()
    }
    setCurrentStep(2)
  }

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    setRegistrationData({ ...registrationData, ...data })
    if (selectedRole === 'USER') {
      // Free users can register immediately
      handleFinalSubmit({ ...registrationData, ...data })
    } else {
      setCurrentStep(3)
    }
  }

  const handleBusinessInfoSubmit = (data: BusinessInfo) => {
    setRegistrationData({ ...registrationData, ...data })
    setCurrentStep(4)
  }

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg)
  }

  const handleFinalSubmit = async (finalData?: Partial<PersonalInfo & BusinessInfo>) => {
    setIsLoading(true)
    
    try {
      const submitData = finalData || registrationData
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submitData,
          role: selectedRole,
          packageId: selectedPackage?.id,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Set registration complete state
        setRegistrationComplete(true)
        
        // Show immediate success toast for all users
        toast({
          title: 'Registration successful! 🎉',
          description: selectedRole === 'USER' 
            ? 'Welcome to our platform. You can now log in.' 
            : 'Check your email for verification and payment instructions.',
          duration: 5000, // Make toast stay longer
        })

        // For free users, redirect to login
        if (selectedRole === 'USER') {
          setTimeout(() => {
            router.push('/auth/login')
          }, 2500) // Give time to read the toast
        } else {
          // For paid users, redirect to confirmation page with email and role info
          const emailParam = encodeURIComponent(submitData.email || '')
          const roleParam = selectedRole?.toLowerCase() || ''
          const packageParam = selectedPackage?.name || ''
          
          // Add a small delay to ensure the success state is visible
          setTimeout(() => {
            router.push(`/registration-success?email=${emailParam}&role=${roleParam}&package=${encodeURIComponent(packageParam)}`)
          }, 2000)
        }
      } else {
        toast({
          title: 'Registration failed',
          description: result.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      })
    } finally {
      // Don't reset loading immediately if registration was successful
      if (!registrationComplete) {
        setIsLoading(false)
      }
    }
  }

  // Helper functions
  function formatPrice(priceInCents: number, interval: string) {
    const price = priceInCents / 100
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
    
    return `${formatted}/${interval}`
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case 'USER':
        return <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      case 'AGENT':
        return <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
      case 'EXPERT':
        return <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      default:
        return <User className="h-6 w-6 text-muted-foreground" />
    }
  }

  function getRoleDescription(role: string) {
    switch (role) {
      case 'USER':
        return 'Browse properties and connect with agents'
      case 'AGENT':
        return 'List properties, manage leads, and grow your business'
      case 'EXPERT':
        return 'Advanced marketing tools, AI features, and analytics'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <Check className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mx-auto max-w-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Choose Your Account Type</CardTitle>
                  <CardDescription>
                    Select the option that best describes your needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { role: 'USER', title: 'Regular User', subtitle: 'Free Account', price: 'Free' },
                    { role: 'AGENT', title: 'Real Estate Agent', subtitle: 'Professional Tools', price: 'From $30/month' },
                    { role: 'EXPERT', title: 'Real Estate Expert', subtitle: 'Premium Features', price: 'From $200/month' },
                  ].map(({ role, title, subtitle, price }) => (
                    <Button
                      key={role}
                      variant="outline"
                      className="w-full h-auto p-6 flex items-center justify-between hover:bg-accent hover:border-accent-foreground"
                      onClick={() => handleRoleSelect(role as any)}
                    >
                      <div className="flex items-center space-x-4">
                        {getRoleIcon(role)}
                        <div className="text-left">
                          <div className="font-semibold">{title}</div>
                          <div className="text-sm text-muted-foreground">{getRoleDescription(role)}</div>
                          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">{price}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mx-auto max-w-2xl">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Tell us about yourself to create your account
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...personalForm}>
                    <form onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
                      <FormField
                        control={personalForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="John Doe" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="john@example.com" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={personalForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        {selectedRole === 'USER' ? 'Create Account' : 'Continue'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Business Information (for Agents/Experts) */}
          {currentStep === 3 && selectedRole !== 'USER' && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mx-auto max-w-2xl">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>
                        Help us understand your business
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...businessForm}>
                    <form onSubmit={businessForm.handleSubmit(handleBusinessInfoSubmit)} className="space-y-4">
                      <FormField
                        control={businessForm.control}
                        name="agencyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agency/Company Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="ABC Real Estate" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Bio (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell potential clients about your experience and expertise..."
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Continue to Pricing
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Package Selection (for Agents/Experts) */}
          {currentStep === 4 && selectedRole !== 'USER' && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mx-auto max-w-4xl">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(3)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle>Choose Your Plan</CardTitle>
                      <CardDescription>
                        Select a subscription plan that fits your needs
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Billing Period Toggle for Agents */}
                  {selectedRole === 'AGENT' && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-xl shadow-sm">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-foreground mb-2">Choose Your Billing Period</h3>
                          <p className="text-sm text-muted-foreground">Save money with annual billing</p>
                        </div>
                        
                        {/* Enhanced Toggle Switch */}
                        <div className="relative flex items-center justify-center p-1 bg-background dark:bg-gray-800 rounded-xl border-2 border-border shadow-inner">
                          {/* Background slider */}
                          <div className={`absolute inset-1 w-24 h-10 bg-gradient-to-r transition-all duration-300 ease-in-out rounded-lg shadow-sm ${
                            billingPeriod === 'yearly' 
                              ? 'from-green-400 to-green-500 translate-x-24' 
                              : 'from-blue-400 to-blue-500 translate-x-0'
                          }`} />
                          
                          {/* Monthly Button */}
                          <button
                            onClick={() => {
                              console.log('Monthly button clicked')
                              setBillingPeriod('monthly')
                              setSelectedPackage(null)
                            }}
                            className={`relative z-10 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                              billingPeriod === 'monthly'
                                ? 'text-white shadow-lg transform scale-105'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            Monthly
                          </button>
                          
                          {/* Yearly Button */}
                          <button
                            onClick={() => {
                              console.log('Yearly button clicked')
                              setBillingPeriod('yearly')
                              setSelectedPackage(null)
                            }}
                            className={`relative z-10 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                              billingPeriod === 'yearly'
                                ? 'text-white shadow-lg transform scale-105'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            Yearly
                            <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs">
                              -10%
                            </Badge>
                          </button>
                        </div>
                        
                        {/* Savings Information */}
                        <div className="text-center">
                          {billingPeriod === 'yearly' ? (
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-green-600 dark:text-green-400 text-lg">🎉</span>
                              <p className="text-sm text-green-700 font-semibold">
                                You're saving 10% with annual billing!
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">
                              Switch to yearly billing to save 10% on your subscription
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${
                    billingPeriod === 'yearly' ? 'transform scale-[1.02]' : ''
                  }`}>
                    {(() => {
                      const filteredPackages = packages.filter(pkg => {
                        if (selectedRole === 'AGENT') {
                          const isAgentPackage = pkg.name.toLowerCase().includes('agent')
                          const isCorrectPeriod = billingPeriod === 'yearly' 
                            ? pkg.interval === 'year' 
                            : pkg.interval === 'month'
                          console.log(`Package: ${pkg.name}, isAgent: ${isAgentPackage}, period: ${pkg.interval}, matches: ${isCorrectPeriod}`)
                          return isAgentPackage && isCorrectPeriod
                        }
                        if (selectedRole === 'EXPERT') {
                          return pkg.name.toLowerCase().includes('expert')
                        }
                        return false
                      })
                      
                      console.log(`Billing period: ${billingPeriod}, Filtered packages:`, filteredPackages.map(p => p.name))
                      
                      return filteredPackages.map((pkg) => (
                        <Card 
                          key={pkg.id}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            selectedPackage?.id === pkg.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => handlePackageSelect(pkg)}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {pkg.name}
                              {selectedPackage?.id === pkg.id && (
                                <Check className="h-5 w-5 text-blue-500" />
                              )}
                            </CardTitle>
                            <CardDescription>{pkg.description}</CardDescription>
                            <div className="flex items-center space-x-2">
                              <div className="text-2xl font-bold text-blue-600">
                                {formatPrice(pkg.price, pkg.interval)}
                              </div>
                              {pkg.interval === 'year' && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Save 10%
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li>• Up to {pkg.listingsMax} listings</li>
                              {(() => {
                                const features = typeof pkg.features === 'string' 
                                  ? JSON.parse(pkg.features) 
                                  : pkg.features
                                return (
                                  <>
                                    {features.support && (
                                      <li>• {features.support.replace('_', ' ')} support</li>
                                    )}
                                    {features.analytics && <li>• Advanced analytics</li>}
                                    {features.marketing && <li>• Marketing toolkit</li>}
                                    {features.ai_blog && <li>• AI-powered blog</li>}
                                    {features.social_media && <li>• Social media integration</li>}
                                    {features.lead_capture && <li>• Lead capture forms</li>}
                                    {features.booking_calendar && <li>• Booking calendar</li>}
                                    {features.discount && <li>• {features.discount} yearly discount</li>}
                                  </>
                                )
                              })()}
                            </ul>
                          </CardContent>
                        </Card>
                      ))
                    })()}
                  </div>

                  {selectedPackage && (
                    <div className="mt-8 text-center">
                      <Button 
                        onClick={() => handleFinalSubmit()}
                        disabled={isLoading || registrationComplete}
                        size="lg"
                        className={`px-8 ${registrationComplete ? 'bg-green-600 hover:bg-green-600' : ''}`}
                      >
                        {registrationComplete ? (
                          <div className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Registration Complete! Redirecting...
                          </div>
                        ) : isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Creating Account...
                          </div>
                        ) : (
                          'Complete Registration'
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </div>

        {/* Registration Success Overlay */}
        <AnimatePresence>
          {registrationComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Registration Successful! 🎉
                </h2>
                
                <div className="text-gray-600 mb-6">
                  {selectedRole === 'USER' ? (
                    <p>Welcome to our platform! You can now log in to access your dashboard.</p>
                  ) : (
                    <div>
                      <p className="mb-3">
                        <strong>Important next steps:</strong>
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left text-sm">
                        <div className="flex items-start space-x-3 mb-3">
                          <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900">Check your email</p>
                            <p className="text-blue-700">Verify your email address to activate your account</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Building className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900">Complete payment</p>
                            <p className="text-blue-700">Follow the payment link in your email to activate your {selectedRole?.toLowerCase()} plan</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  {selectedRole === 'USER' 
                    ? 'Redirecting to login...' 
                    : 'Redirecting to confirmation page...'
                  }
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
