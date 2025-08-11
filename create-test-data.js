const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Creating test data...');
    
    // Create test agent if doesn't exist
    let testAgent = await prisma.agent.findFirst({
      where: { email: 'testagent@example.com' }
    });
    
    if (!testAgent) {
      testAgent = await prisma.agent.create({
        data: {
          name: 'Test Agent',
          email: 'testagent@example.com',
          phone: '+1-555-0123',
          bio: 'Experienced real estate agent for testing purposes.',
          licenseNumber: 'TEST123',
          profileImage: 'https://via.placeholder.com/300x300',
        }
      });
      console.log('Created test agent:', testAgent.id);
    }
    
    // Create test listings with SEO-optimized data
    const testListings = [
      {
        title: 'Modern Downtown Apartment',
        description: 'Beautiful modern apartment in the heart of downtown with city views and premium amenities. Perfect for urban living.',
        price: 750000,
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1200,
        address: '123 Main Street',
        city: 'San Francisco',
        state: 'California',
        zipCode: '94105',
        country: 'United States',
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        agentId: testAgent.id,
      },
      {
        title: 'Luxury Beach House',
        description: 'Stunning beachfront property with panoramic ocean views, private beach access, and luxury finishes throughout.',
        price: 2500000,
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: 3500,
        address: '456 Ocean Drive',
        city: 'Miami',
        state: 'Florida',
        zipCode: '33139',
        country: 'United States',
        propertyType: 'HOUSE',
        listingType: 'SALE',
        agentId: testAgent.id,
      },
      {
        title: 'Charming Victorian Home',
        description: 'Beautifully restored Victorian home with original hardwood floors, ornate details, and modern updates.',
        price: 950000,
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 2100,
        address: '789 Heritage Lane',
        city: 'Portland',
        state: 'Oregon',
        zipCode: '97201',
        country: 'United States',
        propertyType: 'HOUSE',
        listingType: 'SALE',
        agentId: testAgent.id,
      }
    ];
    
    for (const listingData of testListings) {
      // Check if listing already exists
      const existingListing = await prisma.listing.findFirst({
        where: { 
          title: listingData.title,
          address: listingData.address 
        }
      });
      
      if (!existingListing) {
        const listing = await prisma.listing.create({
          data: listingData
        });
        console.log(`Created listing: ${listing.title} (ID: ${listing.id})`);
        console.log(`Generated slug: ${listing.slug}`);
        console.log(`Meta description: ${listing.metaDescription}`);
        
        // Add sample images
        await prisma.listingImage.createMany({
          data: [
            {
              listingId: listing.id,
              url: 'https://via.placeholder.com/800x600/0066cc/ffffff?text=Property+Image+1',
              altText: `${listing.title} - Main view`,
              isPrimary: true,
            },
            {
              listingId: listing.id,
              url: 'https://via.placeholder.com/800x600/009900/ffffff?text=Property+Image+2',
              altText: `${listing.title} - Interior view`,
              isPrimary: false,
            }
          ]
        });
      } else {
        console.log(`Listing already exists: ${listingData.title}`);
      }
    }
    
    // Get final counts
    const listingCount = await prisma.listing.count();
    const agentCount = await prisma.agent.count();
    
    console.log('\nTest data creation complete!');
    console.log(`Total listings: ${listingCount}`);
    console.log(`Total agents: ${agentCount}`);
    
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
