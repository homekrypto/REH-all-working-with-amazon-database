// Quick test of meta description generation
const metaDescriptionGenerator = require('./src/lib/meta-description-generator.ts');

// Test cases
const testCases = [
  {
    title: "Luxury Ocean Penthouse",
    location: "Miami Beach, Florida", 
    type: "sale",
    description: "Beautiful 3-bedroom, 2-bathroom penthouse with ocean views. Features modern kitchen and large balcony.",
    price: 850000
  },
  {
    title: "Modern Downtown Loft",
    location: "Manhattan, New York",
    type: "rent",
    description: "Spacious 2-bedroom loft with city views, updated kitchen, and gym access.",
    price: 4500
  },
  {
    title: "Family Home with Pool", 
    location: "Austin, Texas",
    type: "sale",
    description: "Charming 4-bedroom, 3-bathroom family home with swimming pool, garage, and large backyard.",
    price: 425000
  }
];

console.log("🧪 Testing Meta Description Generation");
console.log("======================================");

testCases.forEach((test, index) => {
  try {
    const meta = metaDescriptionGenerator.generateMetaDescription(test);
    const validation = metaDescriptionGenerator.validateMetaDescription(meta);
    
    console.log(`\n${index + 1}. ${test.title}`);
    console.log(`   Meta: ${meta}`);
    console.log(`   Length: ${meta.length} chars`);
    console.log(`   Valid: ${validation.valid ? '✅' : '❌'}`);
    if (validation.warnings.length > 0) {
      console.log(`   Warnings: ${validation.warnings.join(', ')}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
});
