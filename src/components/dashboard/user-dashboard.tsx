'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Filter,
  Star,
  Phone,
  Mail,
  Building2,
  TrendingUp,
  Users,
  Home,
  BookmarkPlus,
  Eye,
  MessageSquare,
  Crown,
  Zap
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'AGENT' | 'EXPERT'
  subscriptionStatus: string
  emailVerified?: Date | null
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
  image: string
  agent: {
    name: string
    phone: string
    email: string
    avatar?: string
  }
  isFavorite?: boolean
}

interface UserDashboardProps {
  user: User
}

// Mock data for properties
const mockProperties: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: 450000,
    location: "New York, NY",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
    agent: {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah@realestate.com"
    }
  },
  {
    id: 2,
    title: "Family House with Garden",
    price: 620000,
    location: "Los Angeles, CA",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
    agent: {
      name: "Mike Davis",
      phone: "+1 (555) 987-6543",
      email: "mike@realestate.com"
    }
  },
  {
    id: 3,
    title: "Luxury Penthouse",
    price: 1200000,
    location: "Miami, FL",
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    agent: {
      name: "Emily Chen",
      phone: "+1 (555) 456-7890",
      email: "emily@realestate.com"
    }
  }
]

export default function UserDashboard({ user }: UserDashboardProps) {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [favorites, setFavorites] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFavorite = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      const isFavorite = favorites.some(f => f.id === propertyId)
      if (isFavorite) {
        setFavorites(favorites.filter(f => f.id !== propertyId))
      } else {
        setFavorites([...favorites, property])
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">
                Discover your dream property
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Free Account
              </Badge>
              <Avatar>
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Find Your Perfect Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by location, property type, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Unlock Pro Features
                    </h3>
                    <p className="text-gray-600">
                      List properties, manage leads, and grow your real estate business
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Starting at</p>
                    <p className="text-2xl font-bold text-purple-600">$49/mo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">
              <Home className="mr-2 h-4 w-4" />
              Browse Properties
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="mr-2 h-4 w-4" />
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="activity">
              <TrendingUp className="mr-2 h-4 w-4" />
              My Activity
            </TabsTrigger>
          </TabsList>

          {/* Browse Properties Tab */}
          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => handleFavorite(property.id)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.some(f => f.id === property.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600'
                          }`}
                        />
                      </Button>
                      <Badge className="absolute top-2 left-2">
                        {property.type}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
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
                          {property.bedrooms} bed
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms} bath
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {property.area} m²
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {property.agent.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{property.agent.name}</p>
                              <p className="text-xs text-gray-600">Agent</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    Start browsing properties and save your favorites to see them here.
                  </p>
                  <Button>
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Browse Properties
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => handleFavorite(property.id)}
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <p className="text-2xl font-bold text-blue-600 mb-2">
                        {formatPrice(property.price)}
                      </p>
                      <p className="text-gray-600 flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </p>
                      <Button className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Agent
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Recent Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=60"
                        alt="Property"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">Modern Downtown Apartment</p>
                        <p className="text-sm text-gray-600">Viewed 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=60"
                        alt="Property"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">Family House with Garden</p>
                        <p className="text-sm text-gray-600">Viewed yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Thanks for your interest in...</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>MD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">Mike Davis</p>
                        <p className="text-sm text-gray-600">The viewing is scheduled for...</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
