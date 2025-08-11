import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const packages = [
  {
    id: 'pkg_agent_basic',
    name: 'Agent Basic',
    description: 'Perfect for new agents getting started',
    price: 3000, // $30.00
    interval: 'month',
    listingsMax: 5,
    features: JSON.stringify({
      support: 'email',
      analytics: false,
      marketing: false,
    }),
    stripePriceId: 'price_agent_basic_monthly', // Will be updated with real Stripe Price ID
    active: true,
  },
  {
    id: 'pkg_agent_standard',
    name: 'Agent Standard',
    description: 'For growing real estate professionals',
    price: 5000, // $50.00
    interval: 'month',
    listingsMax: 10,
    features: JSON.stringify({
      support: 'email',
      analytics: false,
      marketing: false,
    }),
    stripePriceId: 'price_agent_standard_monthly',
    active: true,
  },
  {
    id: 'pkg_agent_professional',
    name: 'Agent Professional',
    description: 'Advanced features for established agents',
    price: 10000, // $100.00
    interval: 'month',
    listingsMax: 20,
    features: JSON.stringify({
      support: 'priority_email',
      analytics: false,
      marketing: false,
    }),
    stripePriceId: 'price_agent_professional_monthly',
    active: true,
  },
  // Yearly Agent Packages (10% discount)
  {
    id: 'pkg_agent_basic_yearly',
    name: 'Agent Basic (Yearly)',
    description: 'Perfect for new agents getting started - Save 10% yearly',
    price: 32400, // $324.00 (10% discount from $360)
    interval: 'year',
    listingsMax: 5,
    features: JSON.stringify({
      support: 'email',
      analytics: false,
      marketing: false,
      discount: '10%',
    }),
    stripePriceId: 'price_agent_basic_yearly',
    active: true,
  },
  {
    id: 'pkg_agent_standard_yearly',
    name: 'Agent Standard (Yearly)',
    description: 'For growing real estate professionals - Save 10% yearly',
    price: 54000, // $540.00 (10% discount from $600)
    interval: 'year',
    listingsMax: 10,
    features: JSON.stringify({
      support: 'email',
      analytics: false,
      marketing: false,
      discount: '10%',
    }),
    stripePriceId: 'price_agent_standard_yearly',
    active: true,
  },
  {
    id: 'pkg_agent_professional_yearly',
    name: 'Agent Professional (Yearly)',
    description: 'Advanced features for established agents - Save 10% yearly',
    price: 108000, // $1080.00 (10% discount from $1200)
    interval: 'year',
    listingsMax: 20,
    features: JSON.stringify({
      support: 'priority_email',
      analytics: false,
      marketing: false,
      discount: '10%',
    }),
    stripePriceId: 'price_agent_professional_yearly',
    active: true,
  },
  {
    id: 'pkg_expert_monthly',
    name: 'Real Estate Expert',
    description: 'Complete marketing suite with AI tools',
    price: 20000, // $200.00
    interval: 'month',
    listingsMax: 50,
    features: JSON.stringify({
      support: 'priority',
      analytics: true,
      marketing: true,
      ai_blog: true,
      social_media: true,
      lead_capture: true,
      booking_calendar: true,
    }),
    stripePriceId: 'price_expert_monthly',
    active: true,
  },
  {
    id: 'pkg_expert_yearly',
    name: 'Real Estate Expert (Yearly)',
    description: 'Complete marketing suite with 20% yearly discount',
    price: 192000, // $1920.00 (20% discount)
    interval: 'year',
    listingsMax: 50,
    features: JSON.stringify({
      support: 'priority',
      analytics: true,
      marketing: true,
      ai_blog: true,
      social_media: true,
      lead_capture: true,
      booking_calendar: true,
      discount: '20%',
    }),
    stripePriceId: 'price_expert_yearly',
    active: true,
  },
];

async function seedPackages() {
  console.log('Seeding packages...');
  
  for (const packageData of packages) {
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageData.id }
    });
    
    if (!existingPackage) {
      await prisma.package.create({
        data: packageData
      });
      console.log(`✅ Created package: ${packageData.name}`);
    } else {
      console.log(`⏭️  Package already exists: ${packageData.name}`);
    }
  }
  
  console.log('Package seeding completed!');
}

async function main() {
  try {
    await seedPackages();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
