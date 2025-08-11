/**
 * Level 3 SEO: Internal Linking Strategy Components
 * Breadcrumbs and Related Properties for better site architecture
 */

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface BreadcrumbProps {
  property: {
    title: string
    location: string
    type: string
  }
}

/**
 * SEO Breadcrumb Navigation Component
 */
export function PropertyBreadcrumb({ property }: BreadcrumbProps) {
  // Extract city and state for breadcrumb structure
  const parts = property.location.split(',').map(part => part.trim()).filter(Boolean)
  const city = parts.length >= 2 ? parts[parts.length - 2] : parts[0]
  const state = parts.length >= 2 ? parts[parts.length - 1] : ''
  
  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Properties', href: '/properties' },
    ...(state ? [{ label: state, href: `/properties/search?state=${encodeURIComponent(state)}` }] : []),
    { label: city, href: `/properties/search?city=${encodeURIComponent(city)}` },
    { label: property.title, href: '#', current: true }
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
            {item.current ? (
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-blue-600 transition-colors flex items-center"
              >
                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface RelatedProperty {
  id: string
  title: string
  price: number
  currency: string
  location: string
  slug?: string
  images?: Array<{
    url: string
    altText?: string
  }>
}

interface RelatedPropertiesProps {
  currentProperty: {
    id: string
    location: string
    type: string
    price: number
  }
  relatedProperties?: RelatedProperty[]
}

/**
 * Related Properties Module Component
 */
export function RelatedPropertiesModule({ currentProperty, relatedProperties = [] }: RelatedPropertiesProps) {
  // Extract city for related properties logic
  const parts = currentProperty.location.split(',').map(part => part.trim()).filter(Boolean)
  const city = parts.length >= 2 ? parts[parts.length - 2] : parts[0]
  const state = parts.length >= 2 ? parts[parts.length - 1] : ''

  return (
    <div className="mt-8 space-y-6">
      {/* More Properties in this Area */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">More Properties in this Area</h2>
          <Link 
            href={`/properties/search?city=${encodeURIComponent(city)}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            See all properties in {city}
          </Link>
        </div>
        
        {relatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedProperties.slice(0, 3).map((property) => (
              <RelatedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No related properties found in this area.</p>
            <Link 
              href="/properties"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse all properties
            </Link>
          </div>
        )}
      </div>

      {/* Useful Internal Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Explore by Location</h3>
            <div className="space-y-1">
              <Link 
                href={`/properties/search?city=${encodeURIComponent(city)}`}
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                All properties in {city}
              </Link>
              {state && (
                <Link 
                  href={`/properties/search?state=${encodeURIComponent(state)}`}
                  className="block text-blue-600 hover:text-blue-700 text-sm"
                >
                  All properties in {state}
                </Link>
              )}
              <Link 
                href={`/properties/search?type=${currentProperty.type}`}
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Similar properties for {currentProperty.type}
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="space-y-1">
              <Link 
                href={`/properties/search?min_price=${Math.floor(currentProperty.price * 0.8)}&max_price=${Math.floor(currentProperty.price * 1.2)}`}
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Similar price range
              </Link>
              <Link 
                href={`/properties/search?max_price=${currentProperty.price}`}
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Properties under ${(currentProperty.price / 1000).toFixed(0)}K
              </Link>
              <Link 
                href="/properties/search?sort=price_asc"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Browse by price (low to high)
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * Individual Related Property Card
 */
function RelatedPropertyCard({ property }: { property: RelatedProperty }) {
  const propertyUrl = `/properties/${property.slug || property.id}`
  const imageUrl = property.images?.[0]?.url || '/placeholder-property.jpg'
  
  return (
    <Link href={propertyUrl}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={property.images?.[0]?.altText || property.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
              {property.title}
            </h3>
            <div className="text-xs text-gray-600 mb-2">
              {property.location}
            </div>
            <div className="text-lg font-bold text-blue-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: property.currency || 'USD',
                maximumFractionDigits: 0
              }).format(property.price)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/**
 * Hook to fetch related properties (you can implement the API call)
 */
export function useRelatedProperties(propertyId: string, city: string, type: string) {
  // This would typically make an API call to get related properties
  // For now, returning empty array - implement based on your API structure
  return {
    relatedProperties: [] as RelatedProperty[],
    loading: false,
    error: null
  }
}
