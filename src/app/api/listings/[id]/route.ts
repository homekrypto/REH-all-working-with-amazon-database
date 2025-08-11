import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    // Try to find listing by slug first, then by ID
    let listing = await db.listing.findUnique({
      where: { slug: id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        agent: { select: { id: true, name: true, email: true, image: true, phone: true, agencyName: true, role: true } },
        _count: { select: { favorites: true, leads: true } }
      }
    })

    // If not found by slug, try by ID (for backward compatibility)
    if (!listing) {
      listing = await db.listing.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          agent: { select: { id: true, name: true, email: true, image: true, phone: true, agencyName: true, role: true } },
          _count: { select: { favorites: true, leads: true } }
        }
      })
    }

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // If found by ID but has a slug, suggest the slug URL for SEO
    if (listing.slug && id !== listing.slug && id === listing.id) {
      return NextResponse.json({ 
        listing,
        suggestedUrl: `/properties/${listing.slug}` // Frontend can handle redirect
      })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = session.user as any
  const { id } = await context.params

  try {
    // Check if listing exists and user has permission
    const existingListing = await db.listing.findUnique({
      where: { id },
      select: { agentId: true }
    })

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check ownership or admin role
    const isOwner = existingListing.agentId === user.id
    const isAdmin = user.role === 'admin'
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden - not listing owner' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, price, currency, location, type, status, images } = body

    // Update listing
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = Number(price)
    if (currency !== undefined) updateData.currency = currency
    if (location !== undefined) updateData.location = location
    if (type !== undefined) updateData.type = type
    if (status !== undefined) updateData.status = status

    const updatedListing = await db.listing.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        agent: { select: { id: true, name: true, email: true, image: true } }
      }
    })

    // Handle images update if provided (Legacy support - TODO: Migrate to new image system)
    if (images && Array.isArray(images)) {
      // Delete existing images
      await db.listingImage.deleteMany({ where: { listingId: id } })
      
      // Add new images with minimal required fields for backward compatibility
      if (images.length > 0) {
        await db.listingImage.createMany({
          data: images.map((url: string, idx: number) => ({
            listingId: id,
            altText: `Property image ${idx + 1}`, // Default alt text
            originalName: `image-${idx + 1}.jpg`, // Default filename
            storageKey: url, // Use URL as storage key for legacy
            url_large: url, // Use same URL for all sizes for legacy
            url_medium: url,
            url_small: url,
            url_thumbnail: url,
            url: url, // Main URL field
            sortOrder: idx
          }))
        })
      }

      // Fetch updated listing with new images
      const finalListing = await db.listing.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          agent: { select: { id: true, name: true, email: true, image: true } }
        }
      })

      return NextResponse.json({ listing: finalListing })
    }

    return NextResponse.json({ listing: updatedListing })
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = session.user as any
  const { id } = await context.params

  try {
    // Check if listing exists and user has permission
    const existingListing = await db.listing.findUnique({
      where: { id },
      select: { agentId: true, title: true }
    })

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check ownership or admin role
    const isOwner = existingListing.agentId === user.id
    const isAdmin = user.role === 'admin'
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden - not listing owner' }, { status: 403 })
    }

    // Delete listing (cascade will handle related records)
    await db.listing.delete({ where: { id } })

    return NextResponse.json({ 
      message: 'Listing deleted successfully',
      deletedListing: { id, title: existingListing.title }
    })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
