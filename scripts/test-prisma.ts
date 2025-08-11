import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testPrisma() {
  try {
    console.log('Testing Prisma connection...')
    
    // Try to list tables by querying the schema
    const result = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
    `
    
    console.log('Available tables:', result)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPrisma()
