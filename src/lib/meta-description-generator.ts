/**
 * Generates SEO-optimized meta descriptions for property listings
 * Follows best practices for real estate SEO with 160 character limit
 */

interface MetaDescriptionData {
  title: string
  location: string
  type: string  // "sale", "rent", "lease", etc.
  description?: string
  price?: number
  currency?: string
}

/**
 * Extract meaningful location components (city, state/country)
 */
function extractLocationForMeta(location: string): string {
  const parts = location.split(',').map(part => part.trim()).filter(Boolean)
  
  if (parts.length >= 2) {
    // Return last two parts for "City, State" format
    return parts.slice(-2).join(', ')
  }
  
  return parts[0] || location
}

/**
 * Extract key features from description for meta content
 */
function extractKeyFeatures(description?: string): string {
  if (!description) return ''
  
  // Look for common real estate features
  const patterns = [
    /(\d+)\s*(bedroom|bed|br)/i,
    /(\d+)\s*(bathroom|bath|ba)/i,
    /(pool|swimming pool)/i,
    /(garage|parking)/i,
    /(ocean view|sea view|city view|mountain view)/i,
    /(modern|luxury|updated|renovated)/i,
    /(kitchen|balcony|terrace|patio)/i
  ]
  
  const features: string[] = []
  
  patterns.forEach(pattern => {
    const match = description.match(pattern)
    if (match && features.length < 3) {
      if (match[1] && match[2]) {
        // For numbered features like "3BR/2BA"
        features.push(`${match[1]}${match[2].charAt(0).toUpperCase()}`)
      } else {
        // For text features
        features.push(match[0].toLowerCase())
      }
    }
  })
  
  return features.length > 0 ? ` ${features.join(', ')}.` : ''
}

/**
 * Format listing type for natural language
 */
function formatListingType(type: string): string {
  const typeMap: { [key: string]: string } = {
    'sale': 'for sale',
    'rent': 'for rent', 
    'lease': 'for lease',
    'sold': 'sold',
    'rented': 'rented'
  }
  
  return typeMap[type.toLowerCase()] || type.toLowerCase()
}

/**
 * Truncate text at word boundaries to fit within character limit
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  
  // Find the last space within the limit
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  // If we found a space and it's not too close to the beginning
  if (lastSpace > maxLength * 0.75) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  // Otherwise, cut at the limit and add ellipsis
  return truncated.substring(0, maxLength - 3) + '...'
}

/**
 * Generate SEO-optimized meta description for property listing
 * Format: "For [type]: [title] in [location]. [features] [call-to-action]"
 * Max 160 characters, cut at word boundaries
 */
export function generateMetaDescription(data: MetaDescriptionData): string {
  const {
    title,
    location,
    type,
    description,
    price,
    currency = 'USD'
  } = data
  
  // Clean and format components
  const cleanTitle = title.trim()
  const cleanLocation = extractLocationForMeta(location)
  const listingType = formatListingType(type)
  const features = extractKeyFeatures(description)
  
  // Start building the meta description
  let meta = `${listingType.charAt(0).toUpperCase() + listingType.slice(1)}: ${cleanTitle}`
  
  // Add location
  if (cleanLocation) {
    meta += ` in ${cleanLocation}`
  }
  
  // Add period after main info
  meta += '.'
  
  // Add features if we have room and they exist
  if (features && meta.length + features.length < 140) {
    meta += features
  }
  
  // Add call-to-action if we have room
  const ctaSpace = 160 - meta.length
  if (ctaSpace > 20) {
    meta += ' Contact us today!'
  } else if (ctaSpace > 15) {
    meta += ' View details.'
  }
  
  // Ensure we don't exceed 160 characters
  return truncateAtWordBoundary(meta, 160)
}

/**
 * Validate meta description meets SEO best practices
 */
export function validateMetaDescription(metaDescription: string): {
  valid: boolean
  warnings: string[]
  length: number
} {
  const warnings: string[] = []
  
  if (metaDescription.length < 120) {
    warnings.push('Meta description is shorter than recommended (120-160 chars)')
  }
  
  if (metaDescription.length > 160) {
    warnings.push('Meta description exceeds 160 character limit')
  }
  
  if (!metaDescription.includes('.')) {
    warnings.push('Meta description should end with proper punctuation')
  }
  
  if (!/^[A-Z]/.test(metaDescription)) {
    warnings.push('Meta description should start with a capital letter')
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
    length: metaDescription.length
  }
}

// Example usage and test cases
export const META_DESCRIPTION_EXAMPLES = {
  luxury: generateMetaDescription({
    title: 'Luxury Ocean Penthouse',
    location: 'Miami Beach, Florida',
    type: 'sale',
    description: 'Beautiful 3-bedroom, 2-bathroom penthouse with ocean views. Features modern kitchen and large balcony.',
    price: 850000
  }),
  
  rental: generateMetaDescription({
    title: 'Modern Downtown Loft',
    location: 'Manhattan, New York',
    type: 'rent', 
    description: 'Spacious 2-bedroom loft with city views, updated kitchen, and gym access.',
    price: 4500
  }),
  
  family: generateMetaDescription({
    title: 'Family Home with Pool',
    location: 'Austin, Texas',
    type: 'sale',
    description: 'Charming 4-bedroom, 3-bathroom family home with swimming pool, garage, and large backyard.',
    price: 425000
  })
}
