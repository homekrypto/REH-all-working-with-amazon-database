import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getPresignedUploadUrl } from '@/lib/image-processing'

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    
    // Check if user can upload images (must be Agent or Expert)
    if (user.role === 'USER') {
      return NextResponse.json({ 
        error: 'Only agents and experts can upload listing images' 
      }, { status: 403 })
    }

    const body = await req.json()
    const { filename, filetype } = body

    // Validate input
    if (!filename || !filetype) {
      return NextResponse.json({ 
        error: 'Missing required fields: filename and filetype' 
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif'
    ]
    
    if (!allowedTypes.includes(filetype.toLowerCase())) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, WebP, and HEIC images are allowed.' 
      }, { status: 400 })
    }

    // Generate presigned URL
    const { uploadUrl, key } = await getPresignedUploadUrl(filename, filetype)

    return NextResponse.json({
      uploadUrl,
      key,
      message: 'Upload URL generated successfully'
    })

  } catch (error) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json({ 
      error: 'Failed to generate upload URL' 
    }, { status: 500 })
  }
}
