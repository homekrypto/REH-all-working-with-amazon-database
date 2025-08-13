// Image proxy endpoint to serve S3 images through our server
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  
  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 })
  }

  // Validate that it's our S3 bucket
  if (!imageUrl.includes('real-estate-hub-michalbabula-2025.s3.eu-north-1.amazonaws.com')) {
    return NextResponse.json({ error: 'Invalid image source' }, { status: 400 })
  }

  try {
    // Fetch the image from S3 using server-side credentials with optimizations
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'RealEstate-App/1.0',
      },
      // Add caching for better performance
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      return new NextResponse('Image not found', { status: 404 })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
