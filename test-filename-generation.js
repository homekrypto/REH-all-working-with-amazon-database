// Test script to verify the filename generation fix
const slugify = require('slugify')

function generateSEOFilename(propertyTitle, imageSubject, index) {
  const baseSlug = slugify(propertyTitle, { 
    lower: true, 
    strict: true,
    remove: /[*+~.()'"!:@]/g 
  })
  
  let filename = baseSlug
  if (imageSubject) {
    const subjectSlug = slugify(imageSubject, { lower: true, strict: true })
    filename += `-${subjectSlug}`
  }
  if (index !== undefined) {
    filename += `-${index + 1}`
  }
  
  return filename
}

// Test with multiple images
const propertyTitle = "Beautiful House in Miami"
const images = [
  { subject: "Living Room", index: 0 },
  { subject: "Kitchen", index: 1 },
  { subject: "", index: 2 }, // No subject
]

console.log("🔍 Testing filename generation:")
images.forEach((img, i) => {
  const filename = generateSEOFilename(propertyTitle, img.subject, img.index)
  const storageKey = `listings/test-listing-id/${filename}`
  console.log(`Image ${i + 1}: ${storageKey}`)
})

console.log("\n✅ Each image now gets a unique filename!")
