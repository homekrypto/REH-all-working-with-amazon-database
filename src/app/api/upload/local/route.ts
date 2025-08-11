import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const listingId = formData.get('listingId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 })
    }

    // Create unique filename
    const fileId = uuidv4()
    const fileExtension = file.name.split('.').pop()
    const filename = `${fileId}.${fileExtension}`

    // Create directory for listing if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'listings', listingId)
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/listings/${listingId}/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      originalName: file.name,
      size: file.size
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
