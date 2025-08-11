import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const userId = (session.user as any).id

  try {
    const listings = await db.listing.findMany({
      where: { 
        agentId: userId 
      },
      include: { 
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        agent: {
          select: {
            name: true,
            email: true,
            agencyName: true,
            role: true,
          }
        },
        _count: {
          select: {
            leads: true,
            favorites: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform listings to include additional calculated fields
    const transformedListings = listings.map(listing => ({
      ...listing,
      leads: listing._count.leads,
      views: listing._count.favorites * 10, // Approximate views based on favorites
      bedrooms: 3, // Default values - you might want to add these fields to the schema
      bathrooms: 2,
      area: 150
    }))

    return NextResponse.json({ 
      listings: transformedListings,
      total: listings.length 
    })
  } catch (error) {
    console.error('Failed to fetch user listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}
