import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/properties - Fetch all properties (public endpoint)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const propertyType = searchParams.get('propertyType')

    // Build where clause
    const where: any = {}
    
    if (minPrice && maxPrice) {
      where.price = {
        gte: parseInt(minPrice),
        lte: parseInt(maxPrice)
      }
    } else if (minPrice) {
      where.price = { gte: parseInt(minPrice) }
    } else if (maxPrice) {
      where.price = { lte: parseInt(maxPrice) }
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (propertyType) {
      where.type = propertyType
    }

    // Fetch properties with related data
    const properties = await db.listing.findMany({
      where,
      include: {
        images: {
          select: {
            id: true,
            url: true,
            altText: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            agencyName: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Transform the data to match expected frontend format
    const formattedProperties = properties.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      currency: property.currency,
      location: property.location,
      type: property.type,
      status: property.status,
      slug: property.slug,
      metaDescription: property.metaDescription,
      // Use first image or placeholder
      image: property.images[0]?.url || '/placeholder-property.svg',
      images: property.images,
      agent: property.agent,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      publishedAt: property.publishedAt
    }))

    // Get total count for pagination
    const totalCount = await db.listing.count({ where })

    return NextResponse.json({
      properties: formattedProperties,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
