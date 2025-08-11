// Test SEO slug generation
import { generatePropertySlug, generateUniquePropertySlug, validateSlug, SLUG_EXAMPLES } from './src/lib/slug-generator.js'

console.log('🔍 Testing SEO Slug Generation:')
console.log('===============================')
console.log()

// Test basic examples
console.log('📋 Basic Slug Examples:')
Object.entries(SLUG_EXAMPLES).forEach(([type, slug]) => {
  console.log(`${type.padEnd(12)}: ${slug}`)
})
console.log()

// Test real property examples
console.log('🏠 Real Property Examples:')
const properties = [
  { title: 'Beautiful Beach House', location: 'Miami Beach, Florida', price: 1200000 },
  { title: 'Luxury Penthouse', location: 'Manhattan, New York', price: 5500000 },
  { title: 'Charming Victorian Home', location: 'San Francisco, CA', price: 2800000 },
  { title: 'Modern Loft', location: 'Downtown Los Angeles', price: 950000 },
  { title: '3-Bedroom Family Home', location: 'Austin, Texas', price: 650000 }
]

properties.forEach(prop => {
  const slug = generatePropertySlug(prop.title, prop.location, prop.price)
  const validation = validateSlug(slug)
  console.log(`${prop.title}:`)
  console.log(`  Slug: ${slug}`)
  console.log(`  Valid: ${validation.valid ? '✅' : '❌'}`)
  if (!validation.valid) {
    console.log(`  Errors: ${validation.errors.join(', ')}`)
  }
  console.log()
})

// Test edge cases
console.log('⚠️  Edge Cases:')
const edgeCases = [
  'Property with Special Characters!@#$%',
  'Übër Luxury Mansion with Açcents',
  'A Really Really Really Really Really Really Long Property Title That Exceeds Normal Limits',
  'property with lowercase',
  'PROPERTY WITH UPPERCASE'
]

edgeCases.forEach(title => {
  const slug = generatePropertySlug(title, 'Test Location')
  console.log(`"${title}":`)
  console.log(`  → ${slug}`)
  console.log()
})
