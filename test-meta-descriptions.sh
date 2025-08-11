#!/bin/bash

echo "🧪 Testing Meta Description Generation"
echo "======================================"
echo ""

# Test the meta description utility with Node.js
echo "📝 Testing meta description generation examples:"
node -e "
const { generateMetaDescription, validateMetaDescription, META_DESCRIPTION_EXAMPLES } = require('./dist/src/lib/meta-description-generator.js');

console.log('🏖️ LUXURY EXAMPLE:');
const luxury = META_DESCRIPTION_EXAMPLES.luxury;
console.log('   Generated:', luxury);
console.log('   Length:', luxury.length, 'chars');
console.log('   Valid:', validateMetaDescription(luxury).valid);
console.log('');

console.log('🏙️ RENTAL EXAMPLE:');
const rental = META_DESCRIPTION_EXAMPLES.rental;
console.log('   Generated:', rental);
console.log('   Length:', rental.length, 'chars');
console.log('   Valid:', validateMetaDescription(rental).valid);
console.log('');

console.log('🏡 FAMILY EXAMPLE:');
const family = META_DESCRIPTION_EXAMPLES.family;
console.log('   Generated:', family);
console.log('   Length:', family.length, 'chars');
console.log('   Valid:', validateMetaDescription(family).valid);
console.log('');

console.log('🧪 CUSTOM TEST:');
const custom = generateMetaDescription({
  title: 'Modern Beachfront Condo',
  location: 'Santa Monica, California',
  type: 'sale',
  description: 'Stunning 2-bedroom, 2-bathroom condo with ocean views, modern kitchen, and pool access.',
  price: 1200000,
  currency: 'USD'
});
console.log('   Generated:', custom);
console.log('   Length:', custom.length, 'chars');
console.log('   Valid:', validateMetaDescription(custom).valid);
" 2>/dev/null || echo "❌ Need to build TypeScript first..."

echo ""
echo "🚀 Testing with real property creation:"
echo "======================================"

# Create a test property to verify meta description generation
curl -X POST http://localhost:5544/api/listings \
  -H "Content-Type: application/json" \
  -H "Cookie: $(curl -s -c - -b - -X POST http://localhost:5544/api/auth/signin | grep -o 'next-auth.session-token=[^;]*')" \
  -d '{
    "title": "SEO Test Penthouse", 
    "description": "Beautiful 3-bedroom, 2-bathroom penthouse with stunning ocean views. Features modern kitchen, large balcony, and pool access.",
    "price": 950000,
    "currency": "USD",
    "location": "Miami Beach, Florida",
    "type": "sale"
  }' | jq '.listing | {title: .title, metaDescription: .metaDescription, metaLength: (.metaDescription | length)}'

echo ""
echo "✅ Meta Description System Test Complete!"
