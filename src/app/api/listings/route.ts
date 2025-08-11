import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { processImage } from '@/lib/image-processing'

export async function GET() {
  const listings = await db.listing.findMany({
    include: { 
      images: true,
      agent: {
        select: {
          name: true,
          email: true,
          agencyName: true,
          role: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json({ listings })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const userId = (session.user as any).id

  // Get user profile to check role and package limits
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { package: true }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Check if user can create listings
  if (user.role === 'USER') {
    return NextResponse.json({ 
      error: 'Free users cannot create listings. Please upgrade to an Agent or Expert plan.' 
    }, { status: 403 })
  }

  // Get current listing count for this user
  const currentListingCount = await db.listing.count({
    where: { agentId: userId }
  })

  // Check package limits
  const getPackageLimit = (role: string, packageName?: string | null) => {
    if (role === 'AGENT') {
      const limits = {
        'basic': 5,
        'standard': 10,
        'professional': 20
      }
      const packageType = packageName?.toLowerCase() || 'basic'
      return limits[packageType as keyof typeof limits] || 5
    }
    if (role === 'EXPERT') {
      return 50
    }
    return 0
  }

  const maxListings = getPackageLimit(user.role, user.package?.name)
  
  if (currentListingCount >= maxListings) {
    return NextResponse.json({ 
      error: `You have reached your listing limit of ${maxListings}. Please upgrade your plan or remove existing listings.`,
      currentCount: currentListingCount,
      maxListings
    }, { status: 403 })
  }

  const body = await req.json()
  const { 
    title, 
    description, 
    price, 
    currency = 'USD', 
    location, 
    type, 
    status,
    imageKeys = [],  // Array of temporary S3 keys from upload
    imageSubjects = [] // Optional array of image subjects (kitchen, bedroom, etc.)
  } = body || {}

  // Validate required fields
  if (!title || !price || !location || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // First, create the listing without images
    const created = await db.listing.create({
      data: {
        agentId: userId,
        title,
        description,
        price: Number(price),
        currency,
        location,
        type,
        status: status || 'active',
      }
    })

    // Process images if any were uploaded
    const processedImages: any[] = []
    if (imageKeys.length > 0) {
      for (let i = 0; i < imageKeys.length; i++) {
        const tempKey = imageKeys[i]
        const imageSubject = imageSubjects[i] || undefined
        
        try {
          // Extract original filename from the temp key
          const originalFilename = tempKey.split('/').pop() || 'unknown.jpg'
          
          // Process the image
          const processedImage = await processImage({
            listingId: created.id,
            propertyTitle: title,
            location,
            imageSubject,
            originalFilename,
            tempKey
          })

          // Create the database record with SEO-optimized data
          const imageRecord = await db.listingImage.create({
            data: {
              listingId: created.id,
              altText: processedImage.altText,
              originalName: processedImage.originalName,
              imageSubject: imageSubject || null,
              storageKey: processedImage.storageKey,
              url_large: processedImage.urls.large,
              url_medium: processedImage.urls.medium,
              url_small: processedImage.urls.small,
              url_thumbnail: processedImage.urls.thumbnail,
              url: processedImage.urls.large, // Backward compatibility
              sortOrder: i
            }
          })

          processedImages.push(imageRecord)
        } catch (imageError) {
          console.error(`Failed to process image ${i}:`, imageError)
          // Continue with other images, don't fail the entire listing
        }
      }
    }

    // Fetch the complete listing with processed images
    const finalListing = await db.listing.findUnique({
      where: { id: created.id },
      include: { 
        images: { orderBy: { sortOrder: 'asc' } },
        agent: {
          select: {
            name: true,
            email: true,
            agencyName: true,
            role: true,
          }
        }
      },
    })

    return NextResponse.json({ 
      listing: finalListing,
      message: 'Listing created successfully',
      imagesProcessed: processedImages.length,
      usage: {
        current: currentListingCount + 1,
        max: maxListings,
        remaining: maxListings - currentListingCount - 1
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json({ 
      error: 'Failed to create listing. Please try again.' 
    }, { status: 500 })
  }
}

