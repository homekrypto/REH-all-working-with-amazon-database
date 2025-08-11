'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Bed,
  Bath,
  Building2,
  CheckCircle,
  Clock,
  Archive,
  AlertTriangle,
  MoreHorizontal,
  FileText,
  Phone,
  Mail,
  BarChart3,
  Activity,
  Target,
  Crown
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UpgradeModal from './upgrade-modal'

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

interface AgentDashboardProps {
  user: User
}

interface Property {
  id: number
  title: string
  price: number
  location: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  status: 'active' | 'pending' | 'archived'
  views: number
  leads: number
  image: string
  dateAdded: string
}

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  property: string
  message: string
  date: string
  status: 'new' | 'contacted' | 'qualified' | 'closed'
}

// Mock data
const mockProperties: Property[] = [
  {
    id: 1,
    title: "Luxury Downtown Penthouse",
    price: 850000,
    location: "New York, NY",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 185,
    status: "active",
    views: 245,
    leads: 12,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
    dateAdded: "2024-01-15"
  },
  {
    id: 2,
    title: "Modern Family Villa",
    price: 1200000,
    location: "Los Angeles, CA",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    status: "pending",
    views: 189,
    leads: 8,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
    dateAdded: "2024-01-20"
  }
]

const mockLeads: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    property: "Luxury Downtown Penthouse",
    message: "I'm interested in viewing this property. When would be a good time?",
    date: "2024-02-15",
    status: "new"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 (555) 987-6543",
    property: "Modern Family Villa",
    message: "Could you provide more information about the neighborhood?",
    date: "2024-02-14",
    status: "contacted"
  }
]

export default function AgentDashboard({ user }: AgentDashboardProps) {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [isLoading, setIsLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Fetch real listings on component mount
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await fetch('/api/listings/my-listings')
        if (response.ok) {
          const data = await response.json()
          // Transform API data to match Property interface
          const transformedProperties = data.listings.map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            location: listing.location,
            type: listing.type,
            bedrooms: listing.bedrooms || 0,
            bathrooms: listing.bathrooms || 0,
            area: listing.area || 0,
            status: listing.status,
            views: listing.views || 0,
            leads: listing.leads?.length || 0,
            image: listing.images?.[0]?.url || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
            dateAdded: listing.createdAt
          }))
          setProperties(transformedProperties)
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error)
        // Fall back to mock data if API fails
        setProperties(mockProperties)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserListings()
  }, [])

  // Handle success messages from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const title = urlParams.get('title')
    
    if (success === 'listing-created' && title) {
      // Show success notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>Property "${decodeURIComponent(title)}" created successfully!</span>
        </div>
      `
      document.body.appendChild(notification)
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 5000)
      
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getLeadStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>
      case 'contacted':
        return <Badge className="bg-yellow-100 text-yellow-800">Contacted</Badge>
      case 'qualified':
        return <Badge className="bg-purple-100 text-purple-800">Qualified</Badge>
      case 'closed':
        return <Badge className="bg-green-100 text-green-800">Closed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const currentListings = properties.filter(p => p.status === 'active').length
  const maxListings = user.package?.listingsMax || 5
  const listingProgress = (currentListings / maxListings) * 100

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Agent Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowUpgradeModal(true)}
                variant="outline"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700"
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user.package?.name || 'Agent Account'}
              </Badge>
              {user.subscriptionStatus === 'ACTIVE' && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              )}
              <Avatar>
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold">{currentListings}</p>
                  <p className="text-xs text-gray-500">of {maxListings} max</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={listingProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">
                    {properties.reduce((sum, p) => sum + p.views, 0)}
                  </p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Leads</p>
                  <p className="text-2xl font-bold">
                    {leads.filter(l => l.status === 'new').length}
                  </p>
                  <p className="text-xs text-blue-600">+5 this week</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(properties.reduce((sum, p) => sum + p.price, 0))}
                  </p>
                  <p className="text-xs text-gray-500">Portfolio value</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="listings">
              <Building2 className="mr-2 h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="leads">
              <Users className="mr-2 h-4 w-4" />
              Leads ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="account">
              <Crown className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Property Listings</h2>
                <Button onClick={() => router.push('/add-listing')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Property
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeleton
                  <>
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : properties.length === 0 ? (
                  // Empty state
                  <div className="col-span-full">
                    <Card className="border-dashed border-2 border-gray-300">
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Properties Yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Create your first property listing to get started
                        </p>
                        <Button onClick={() => router.push('/add-listing')}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Listing
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  // Actual properties
                  <>
                    {properties.map((property) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="overflow-hidden">
                          <div className="relative">
                            <img 
                              src={property.image} 
                              alt={property.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              {getStatusBadge(property.status)}
                            </div>
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary">{property.type}</Badge>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="mb-3">
                              <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                              <p className="text-2xl font-bold text-blue-600 mb-2">
                                {formatPrice(property.price)}
                              </p>
                              <p className="text-gray-600 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {property.location}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center">
                                <Bed className="h-4 w-4 mr-1" />
                                {property.bedrooms}
                              </div>
                              <div className="flex items-center">
                                <Bath className="h-4 w-4 mr-1" />
                                {property.bathrooms}
                              </div>
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-1" />
                                {property.area}m²
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1 text-blue-600" />
                                <span>{property.views} views</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-green-600" />
                                <span>{property.leads} leads</span>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => router.push(`/add-listing?edit=${property.id}`)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => router.push(`/properties/${property.id}`)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                    {/* Add New Property Card - only show if user has available slots */}
                    {currentListings < maxListings && (
                      <Card 
                        className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
                        onClick={() => router.push('/add-listing')}
                      >
                        <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                          <Plus className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Add New Property
                          </h3>
                          <p className="text-gray-600 mb-4">
                            You have {maxListings - currentListings} listing slots available
                          </p>
                          <Button onClick={(e) => {
                            e.stopPropagation();
                            router.push('/add-listing');
                          }}>
                            Create Listing
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lead Management</h2>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Leads
                </Button>
              </div>

              <div className="space-y-4">
                {leads.map((lead) => (
                  <Card key={lead.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                              <AvatarFallback>
                                {lead.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{lead.name}</h3>
                              <p className="text-sm text-gray-600">{lead.property}</p>
                            </div>
                            {getLeadStatusBadge(lead.status)}
                          </div>
                          
                          <p className="text-gray-700 mb-3">{lead.message}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {lead.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {lead.phone}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(lead.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button size="sm">
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Performance Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Views This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <p className="text-gray-600">Chart placeholder - Views trend</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Conversion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <p className="text-gray-600">Chart placeholder - Conversion funnel</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Account & Subscription</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{user.package?.name || 'Agent Basic'}</h3>
                        <p className="text-gray-600">{user.package?.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Listings:</span>
                          <span>{currentListings} / {maxListings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span>${(user.package?.price || 3000) / 100}/{user.package?.interval || 'month'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="capitalize text-green-600">{user.subscriptionStatus.toLowerCase()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Listings Used</span>
                          <span>{currentListings}/{maxListings}</span>
                        </div>
                        <Progress value={listingProgress} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Monthly Views</span>
                          <span>{properties.reduce((sum, p) => sum + p.views, 0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Active Leads</span>
                          <span>{leads.filter(l => l.status !== 'closed').length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        user={user}
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  )
}
