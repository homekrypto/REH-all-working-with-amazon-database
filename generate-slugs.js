// Generate slugs for existing listings
const { PrismaClient } = require('@prisma/client')
const slugify = require('slugify')

const db = new PrismaClient()

function extractCityCountry(location) {
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

function generatePropertySlug(title, location) {
  // Extract only city and country for ultra-clean URLs
  const cityCountry = extractCityCountry(location)
  const baseSlug = `${title} ${cityCountry}`
  
  const slug = slugify(baseSlug, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: '-',
    trim: true
  })
  
  const maxLength = 60
  if (slug.length > maxLength) {
    const trimmedSlug = slug.substring(0, maxLength)
    const lastHyphen = trimmedSlug.lastIndexOf('-')
    return lastHyphen > 30 ? trimmedSlug.substring(0, lastHyphen) : trimmedSlug
  }
  
  return slug
}

async function generateUniqueSlug(title, location) {
  const baseSlug = generatePropertySlug(title, location)
  
  // Check if slug exists
  const existing = await db.listing.findUnique({
    where: { slug: baseSlug }
  })
  
  if (!existing) {
    return baseSlug
  }
  
  // Add number suffix if slug exists
  let counter = 1
  let uniqueSlug = `${baseSlug}-${counter}`
  
  while (true) {
    const existingWithNumber = await db.listing.findUnique({
      where: { slug: uniqueSlug }
    })
    
    if (!existingWithNumber) {
      return uniqueSlug
    }
    
    counter++
    uniqueSlug = `${baseSlug}-${counter}`
    
    if (counter > 100) {
      throw new Error('Could not generate unique slug after 100 attempts')
    }
  }
}

async function updateExistingListings() {
  console.log('🔄 Regenerating ULTRA-CLEAN slugs (title + city + country only)...')
  
  const listings = await db.listing.findMany()
  
  console.log(`Found ${listings.length} listings to update`)
  
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i]
    console.log(`Processing ${i + 1}/${listings.length}: "${listing.title}"`)
    console.log(`  Location: ${listing.location}`)
    
    try {
      const slug = await generateUniqueSlug(listing.title, listing.location)
      
      await db.listing.update({
        where: { id: listing.id },
        data: { slug }
      })
      
      console.log(`  ✅ Generated slug: ${slug}`)
    } catch (error) {
      console.error(`  ❌ Error generating slug for listing ${listing.id}:`, error.message)
    }
  }
  
  console.log('✅ Slug generation complete!')
}

updateExistingListings()
  .catch(console.error)
  .finally(() => db.$disconnect())
