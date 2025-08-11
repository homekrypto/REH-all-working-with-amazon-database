// Test alt text generation
const { generateAltText } = require('./src/lib/image-processing.ts')

console.log('🔍 Testing Alt Text Generation:')
console.log('================================')

// Test case 1: Image with subject
const altText1 = generateAltText(
  'Beautiful Beach House', 
  'Miami Beach, Florida', 
  'Living Room'
)
console.log('With subject:', altText1)

// Test case 2: Image without subject  
const altText2 = generateAltText(
  'Beautiful Beach House',
  'Miami Beach, Florida'
)
console.log('Without subject:', altText2)

// Test case 3: Multiple subjects
const subjects = ['Kitchen', 'Master Bedroom', 'Pool Area', 'Exterior View']
subjects.forEach((subject, index) => {
  const altText = generateAltText(
    'Luxury Villa',
    'Beverly Hills, California', 
    subject
  )
  console.log(`Image ${index + 1} (${subject}):`, altText)
})
