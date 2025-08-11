'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Calendar, 
  Star,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  ImageIcon,
  Eye,
  Users,
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PropertyStructuredData } from '@/lib/structured-data-generator'
import { PropertyBreadcrumb, RelatedPropertiesModule } from '@/components/seo/internal-linking'

// This needs to be converted to a server component to support generateMetadata
// For now, we'll handle SEO via document head updates in the client component

interface PropertyDetail {
  id: string
  title: string
  description: string
  metaDescription?: string  // SEO meta description
  slug?: string             // SEO-friendly URL slug
  price: number
  currency: string
  location: string
  type: string
  status: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  yearBuilt?: number
  features?: string[]
  images: Array<{
    id: string
    url: string
    sortOrder: number
    altText?: string
  }>
  agent: {
    id: string
    name: string
    email: string
    phone?: string
    agencyName?: string
    image?: string
  }
  views: number
  favorites: number
  createdAt: string
  updatedAt: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageError, setImageError] = useState<boolean>(false)

  useEffect(() => {
    fetchProperty()
  }, [params.id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/listings/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Property not found')
        } else {
          setError('Failed to load property details')
        }
        return
      }
      
      const data = await response.json()
      
      // Handle SEO redirect from old ID-based URLs to slug URLs
      if (data.suggestedUrl && data.suggestedUrl !== window.location.pathname) {
        console.log('🔗 Redirecting to SEO-friendly URL:', data.suggestedUrl)
        router.replace(data.suggestedUrl)
        return
      }
      
      setProperty(data.listing) // Fix: API returns {listing: ...}
    } catch (err) {
      setError('Failed to load property details')
      console.error('Error fetching property:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleContactAgent = () => {
    if (!session) {
      router.push('/auth/login?returnTo=' + encodeURIComponent(window.location.pathname))
      return
    }
    
    // Create a lead or open contact modal
    console.log('Contact agent for property:', property?.id)
  }

  const handleScheduleTour = () => {
    if (!session) {
      router.push('/auth/login?returnTo=' + encodeURIComponent(window.location.pathname))
      return
    }
    
    // Open tour scheduling modal
    console.log('Schedule tour for property:', property?.id)
  }

  const handleToggleFavorite = async () => {
    if (!session) {
      router.push('/auth/login?returnTo=' + encodeURIComponent(window.location.pathname))
      return
    }

    try {
      const response = await fetch(`/api/favorites`, {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: property?.id })
      })

      if (response.ok) {
        setIsFavorited(!isFavorited)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  // Helper function to get proxied image URL
  const getProxiedImageUrl = (originalUrl: string) => {
    if (originalUrl.includes('real-estate-hub-michalbabula-2025.s3.eu-north-1.amazonaws.com')) {
      return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
    }
    return originalUrl
  }

  // Extract city and state for SEO H1 optimization
  const extractCityState = (location: string) => {
    const parts = location.split(',').map(part => part.trim()).filter(Boolean)
    if (parts.length >= 2) {
      return {
        city: parts[parts.length - 2],
        state: parts[parts.length - 1]
      }
    }
    return { city: parts[0] || '', state: '' }
  }

  const { city, state } = property ? extractCityState(property.location) : { city: '', state: '' }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Property not found'}
          </h1>
          <Button onClick={() => router.push('/properties')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Level 2 SEO: RealEstateListing Structured Data - The Secret Weapon */}
      <PropertyStructuredData 
        property={{
          id: property.id,
          title: property.title,
          description: property.description,
          metaDescription: property.metaDescription,
          price: property.price,
          currency: property.currency,
          location: property.location,
          type: property.type,
          slug: property.slug,
          images: property.images,
          agent: property.agent,
          createdAt: property.createdAt,
          updatedAt: property.updatedAt
        }}
        baseUrl={process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realestatehub.com'}
      />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level 3 SEO: Breadcrumb Navigation */}
        <PropertyBreadcrumb 
          property={{
            title: property.title,
            location: property.location,
            type: property.type
          }}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  {property.images && property.images.length > 0 && !imageError ? (
                    <Image
                      src={getProxiedImageUrl(property.images[selectedImageIndex]?.url || '/placeholder-property.jpg')}
                      alt={property.images[selectedImageIndex]?.altText || property.title}
                      fill
                      className="object-cover"
                      onError={() => {
                        console.warn('Image failed to load, falling back to placeholder')
                        setImageError(true)
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          {imageError ? 'Image temporarily unavailable' : 'No images available'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Image Navigation */}
                  {property.images && property.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex space-x-2 overflow-x-auto">
                        {property.images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => {
                              setSelectedImageIndex(index)
                              setImageError(false) // Reset image error when changing images
                            }}
                            className={cn(
                              "flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden",
                              selectedImageIndex === index 
                                ? "border-white" 
                                : "border-transparent opacity-70"
                            )}
                          >
                            <Image
                              src={getProxiedImageUrl(image.url)}
                              alt={`View ${index + 1}`}
                              width={64}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {/* Level 1 SEO: Optimized H1 tag mirrors meta title without brand */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {property.title} {property.type === 'sale' ? 'for Sale' : property.type === 'rent' ? 'for Rent' : ''} in {city}{state ? `, ${state}` : ''}
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: property.currency || 'USD',
                        maximumFractionDigits: 0
                      }).format(property.price)}
                    </div>
                    <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                      {property.status}
                    </Badge>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {property.bedrooms && (
                    <div className="text-center">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  {property.area && (
                    <div className="text-center">
                      <Home className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{property.area}</div>
                      <div className="text-sm text-gray-600">sq ft</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">Features</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {property.agent.image ? (
                      <Image
                        src={property.agent.image}
                        alt={property.agent.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-gray-600">
                        {property.agent.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{property.agent.name}</div>
                    {property.agent.agencyName && (
                      <div className="text-sm text-gray-600">{property.agent.agencyName}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleContactAgent}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Agent
                  </Button>
                  
                  <Button 
                    onClick={handleScheduleTour}
                    variant="outline" 
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Tour
                  </Button>

                  {property.agent.phone && (
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Property Stats</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-gray-600" />
                      Views
                    </div>
                    <span className="font-semibold">{property.views}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-gray-600" />
                      Favorites
                    </div>
                    <span className="font-semibold">{property.favorites}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                      Listed
                    </div>
                    <span className="font-semibold">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleToggleFavorite}
                    className="flex-1"
                  >
                    <Heart className={cn(
                      "h-4 w-4 mr-1",
                      isFavorited ? "fill-red-500 text-red-500" : ""
                    )} />
                    {isFavorited ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Level 3 SEO: Related Properties and Internal Linking */}
        <RelatedPropertiesModule 
          currentProperty={{
            id: property.id,
            location: property.location,
            type: property.type,
            price: property.price
          }}
        />
      </div>
    </div>
  )
}
