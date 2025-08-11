import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateImageSitemap } from '@/lib/image-processing'

export async function GET() {
  try {
    // Fetch all active listings with their images
    const listings = await db.listing.findMany({
      where: { status: 'active' },
      include: {
        images: {
          select: {
            url_large: true,
            altText: true
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    // Prepare image data for sitemap
    const imageData: any[] = []
    
    for (const listing of listings) {
      const propertyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/properties/${listing.id}`
      
      for (const image of listing.images) {
        imageData.push({
          url_large: image.url_large,
          altText: image.altText,
          propertyUrl
        })
      }
    }

    // Generate XML sitemap
    const xmlSitemap = generateImageSitemap(imageData)

    return new NextResponse(xmlSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })

  } catch (error) {
    console.error('Error generating image sitemap:', error)
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 })
  }
}
