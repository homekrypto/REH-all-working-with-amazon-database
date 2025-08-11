import slugify from 'slugify'

/**
 * Extract city and country from location string
 * Examples: 
 * "123 Main St, Miami Beach, Florida" -> "Miami Beach Florida"
 * "Downtown, New York, NY" -> "New York NY"
 * "1, miami, United States" -> "miami United States"
 */
function extractCityCountry(location: string): string {
  // Split by commas and clean up
  const parts = location.split(',').map(part => part.trim()).filter(Boolean)
  
  if (parts.length >= 2) {
    // Take the last two parts (city, country/state)
    return parts.slice(-2).join(' ')
  } else if (parts.length === 1) {
    // If only one part, use it as is
    return parts[0]
  }
  
  return location // Fallback to original
}

/**
 * Generate ultra-clean SEO slug: title + city + country only
 */
export function generatePropertySlug(title: string, location: string): string {
  // Extract only city and country for cleaner URLs
  const cityCountry = extractCityCountry(location)
  const baseSlug = `${title} ${cityCountry}`
  
  // Generate slug with proper options
  const slug = slugify(baseSlug, {
    lower: true,           // Convert to lowercase
    strict: true,          // Strip special characters
    remove: /[*+~.()'"!:@]/g,  // Remove additional unwanted characters
    replacement: '-',      // Use hyphens instead of spaces
    trim: true            // Trim leading/trailing replacement chars
  })
  
  // Limit length to 60 characters as per SEO best practices
  const maxLength = 60
  if (slug.length > maxLength) {
    // Find the last hyphen within the limit to avoid cutting words
    const trimmedSlug = slug.substring(0, maxLength)
    const lastHyphen = trimmedSlug.lastIndexOf('-')
    return lastHyphen > 30 ? trimmedSlug.substring(0, lastHyphen) : trimmedSlug
  }
  
  return slug
}

/**
 * Ensure slug uniqueness by checking database and adding number suffix if needed
 */
export async function generateUniquePropertySlug(
  title: string, 
  location: string, 
  dbCheckFunction?: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = generatePropertySlug(title, location)
  
  // If no database check function provided, return base slug
  if (!dbCheckFunction) {
    return baseSlug
  }
  
  // Check if base slug is unique
  const isUnique = await dbCheckFunction(baseSlug)
  if (isUnique) {
    return baseSlug
  }
  
  // If not unique, try with numbered suffixes
  let counter = 1
  let uniqueSlug = `${baseSlug}-${counter}`
  
  while (!(await dbCheckFunction(uniqueSlug)) && counter < 100) {
    counter++
    uniqueSlug = `${baseSlug}-${counter}`
  }
  
  return uniqueSlug
}

/**
 * Validate if a slug meets SEO requirements
 */
export function validateSlug(slug: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check length
  if (slug.length > 60) {
    errors.push('Slug should be under 60 characters')
  }
  
  if (slug.length < 3) {
    errors.push('Slug should be at least 3 characters')
  }
  
  // Check format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug should only contain lowercase letters, numbers, and hyphens')
  }
  
  // Check for consecutive hyphens
  if (slug.includes('--')) {
    errors.push('Slug should not contain consecutive hyphens')
  }
  
  // Check start/end with hyphens
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('Slug should not start or end with hyphens')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Example usage and test cases
export const SLUG_EXAMPLES = {
  basic: generatePropertySlug('Beautiful Beach House', 'Miami Beach, Florida'),
  luxury: generatePropertySlug('Luxury Villa', 'Beverly Hills, CA'),
  long: generatePropertySlug('An Absolutely Stunning and Magnificent Waterfront Estate with Panoramic Ocean Views', 'Malibu, California'),
  special: generatePropertySlug('3-Bedroom Condo @ Downtown!', 'New York, NY'),
}
