/**
 * Level 2 SEO: RealEstateListing Structured Data (Schema Markup)
 * This is the secret weapon for rich snippets and search engine communication
 */

interface PropertySchemaData {
  id: string
  title: string
  description?: string
  metaDescription?: string
  price: number
  currency: string
  location: string
  type: string
  slug?: string
  images?: Array<{
    url_large?: string
    url?: string
    altText?: string
  }>
  agent?: {
    name?: string
    email?: string
    phone?: string
    agencyName?: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Extract structured address components from location string
 */
function parseAddress(location: string): {
  streetAddress?: string
  addressLocality: string
  addressRegion: string
  addressCountry: string
  postalCode?: string
} {
  const parts = location.split(',').map(part => part.trim()).filter(Boolean)
  
  if (parts.length >= 3) {
    // Format: "123 Main St, Miami Beach, Florida" or "Address, City, State"
    return {
      streetAddress: parts[0],
      addressLocality: parts[1], // City
      addressRegion: parts[2],   // State/Region
      addressCountry: 'US'       // Default to US, could be enhanced
    }
  } else if (parts.length === 2) {
    // Format: "Miami Beach, Florida"
    return {
      addressLocality: parts[0], // City
      addressRegion: parts[1],   // State/Region  
      addressCountry: 'US'
    }
  } else {
    // Single location
    return {
      addressLocality: parts[0] || location,
      addressRegion: '',
      addressCountry: 'US'
    }
  }
}

/**
 * Map property type to Schema.org type
 */
function mapPropertyType(type: string): string {
  const typeMap: { [key: string]: string } = {
    'sale': 'House',
    'rent': 'House', 
    'lease': 'House',
    'apartment': 'Apartment',
    'condo': 'Apartment',
    'townhouse': 'House',
    'villa': 'House',
    'penthouse': 'Apartment'
  }
  
  return typeMap[type.toLowerCase()] || 'House'
}

/**
 * Map listing type to Schema.org offer availability
 */
function mapAvailability(type: string, status?: string): string {
  if (status === 'sold' || status === 'rented') {
    return 'https://schema.org/OutOfStock'
  }
  
  return 'https://schema.org/InStock'
}

/**
 * Generate RealEstateListing structured data
 */
export function generatePropertySchema(property: PropertySchemaData, baseUrl: string): string {
  const address = parseAddress(property.location)
  const propertyType = mapPropertyType(property.type)
  const availability = mapAvailability(property.type)
  
  // Get the best available images
  const imageUrls = property.images
    ?.map(img => img.url_large || img.url)
    .filter(Boolean)
    .slice(0, 5) // Limit to 5 images for performance
    || []
  
  const propertyUrl = `${baseUrl}/properties/${property.slug || property.id}`
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "url": propertyUrl,
    "description": property.metaDescription || property.description || `${property.title} in ${property.location}`,
    
    // Property Details
    "address": {
      "@type": "PostalAddress",
      ...(address.streetAddress && { "streetAddress": address.streetAddress }),
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "addressCountry": address.addressCountry,
      ...(address.postalCode && { "postalCode": address.postalCode })
    },
    
    // Pricing Information
    "offers": {
      "@type": "Offer",
      "price": property.price.toString(),
      "priceCurrency": property.currency,
      "availability": availability,
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days
      "url": propertyUrl
    },
    
    // Images
    ...(imageUrls.length > 0 && {
      "image": imageUrls.length === 1 ? imageUrls[0] : imageUrls
    }),
    
    // Property Type
    "additionalType": propertyType,
    
    // Agent/Seller Information
    ...(property.agent && {
      "provider": {
        "@type": property.agent.agencyName ? "RealEstateAgent" : "Person",
        "name": property.agent.name || "Real Estate Agent",
        ...(property.agent.email && { "email": property.agent.email }),
        ...(property.agent.phone && { "telephone": property.agent.phone }),
        ...(property.agent.agencyName && { 
          "affiliation": {
            "@type": "Organization",
            "name": property.agent.agencyName
          }
        })
      }
    }),
    
    // Dates
    "datePosted": property.createdAt,
    "dateModified": property.updatedAt,
    
    // Additional SEO Properties
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": propertyUrl
    }
  }
  
  return JSON.stringify(schema, null, 2)
}

/**
 * React component for injecting structured data
 */
interface PropertySchemaProps {
  property: PropertySchemaData
  baseUrl?: string
}

export function PropertyStructuredData({ property, baseUrl = 'https://www.yourdomain.com' }: PropertySchemaProps) {
  const schemaJson = generatePropertySchema(property, baseUrl)
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson }}
    />
  )
}

/**
 * Validation function for structured data
 */
export function validatePropertySchema(property: PropertySchemaData): {
  valid: boolean
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []
  
  // Required fields validation
  if (!property.title) errors.push('Property title is required')
  if (!property.location) errors.push('Property location is required')
  if (!property.price) errors.push('Property price is required')
  
  // Recommendations
  if (!property.metaDescription && !property.description) {
    warnings.push('Property description recommended for better SEO')
  }
  
  if (!property.images || property.images.length === 0) {
    warnings.push('Property images recommended for rich snippets')
  }
  
  if (!property.agent?.name) {
    warnings.push('Agent information recommended for trust signals')
  }
  
  return {
    valid: errors.length === 0,
    warnings,
    errors
  }
}

// Example usage
export const SCHEMA_EXAMPLES = {
  luxury: generatePropertySchema({
    id: 'example-1',
    title: 'Luxury Ocean Penthouse',
    metaDescription: 'For sale: Luxury Ocean Penthouse in Miami Beach, Florida. 3BR, 2BA, ocean views. Contact us today!',
    price: 2500000,
    currency: 'USD',
    location: '123 Ocean Drive, Miami Beach, Florida',
    type: 'sale',
    slug: 'luxury-ocean-penthouse-miami-beach-florida',
    images: [
      { url_large: 'https://example.com/image1.jpg', altText: 'Ocean view from penthouse balcony' }
    ],
    agent: {
      name: 'John Smith',
      email: 'john@realestate.com',
      agencyName: 'Premium Properties'
    },
    createdAt: '2025-08-11T00:00:00Z',
    updatedAt: '2025-08-11T00:00:00Z'
  }, 'https://www.realestatehub.com')
}
