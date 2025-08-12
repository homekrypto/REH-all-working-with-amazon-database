'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Camera, 
  X, 
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface UploadedImage {
  id: string
  file: File
  preview: string
  uploadProgress: number
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error'
  tempKey?: string
  subject?: string
  error?: string
}

interface ImageUploaderProps {
  onImagesChange: (imageKeys: string[], imageSubjects: string[]) => void
  maxImages?: number
  disabled?: boolean
}

const COMMON_SUBJECTS = [
  'Living Room',
  'Kitchen', 
  'Master Bedroom',
  'Bathroom',
  'Dining Room',
  'Balcony',
  'Garden',
  'Pool',
  'Garage',
  'Office',
  'Basement',
  'Attic',
  'Exterior'
]

export default function ImageUploader({ 
  onImagesChange, 
  maxImages = 10,
  disabled = false 
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateId = () => Math.random().toString(36).substring(2, 15)

  // Upload a single image to S3
  const uploadImage = async (image: UploadedImage): Promise<string> => {
    try {
      // Request presigned URL
      const response = await fetch('/api/upload/request-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: image.file.name,
          filetype: image.file.type
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get upload URL')
      }

      const { uploadUrl, key } = await response.json()

      // Upload file to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: image.file,
        headers: {
          'Content-Type': image.file.type
        }
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      return key
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  // Handle file selection
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    if (disabled) return

    const fileArray = Array.from(files)
    const totalImages = images.length + fileArray.length

    if (totalImages > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
    const invalidFiles = fileArray.filter(file => !allowedTypes.includes(file.type.toLowerCase()))
    
    if (invalidFiles.length > 0) {
      toast.error('Only JPEG, PNG, WebP, and HEIC images are allowed')
      return
    }

    // Create image objects
    const newImages: UploadedImage[] = fileArray.map(file => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      uploadProgress: 0,
      uploadStatus: 'pending'
    }))

    setImages(prev => [...prev, ...newImages])

    // Start uploading each image
    for (const image of newImages) {
      try {
        // Update status to uploading
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, uploadStatus: 'uploading' as const }
            : img
        ))

        // Simulate progress for UX
        const progressInterval = setInterval(() => {
          setImages(prev => prev.map(img => 
            img.id === image.id && img.uploadProgress < 90
              ? { ...img, uploadProgress: img.uploadProgress + 10 }
              : img
          ))
        }, 200)

        // Upload the image
        const tempKey = await uploadImage(image)
        
        clearInterval(progressInterval)

        // Update with success
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { 
                ...img, 
                uploadStatus: 'completed' as const, 
                uploadProgress: 100,
                tempKey 
              }
            : img
        ))

        toast.success(`${image.file.name} uploaded successfully`)

      } catch (error) {
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { 
                ...img, 
                uploadStatus: 'error' as const,
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : img
        ))

        toast.error(`Failed to upload ${image.file.name}`)
      }
    }
  }, [images.length, maxImages, disabled])

  // Update parent component when images change
  const updateParent = useCallback(() => {
    const completedImages = images.filter(img => img.uploadStatus === 'completed')
    const imageKeys = completedImages.map(img => img.tempKey!).filter(Boolean)
    const imageSubjects = completedImages.map(img => img.subject || '')
    
    console.log('🔍 ImageUploader updateParent:', {
      totalImages: images.length,
      completedImages: completedImages.length,
      imageKeys: imageKeys,
      imageSubjects: imageSubjects
    })
    
    onImagesChange(imageKeys, imageSubjects)
  }, [images, onImagesChange])

  // Call updateParent whenever images change
  useEffect(() => {
    updateParent()
  }, [updateParent])

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  // File input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  // Remove image
  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      return updated
    })
    // Clean up preview URL
    const image = images.find(img => img.id === id)
    if (image) {
      URL.revokeObjectURL(image.preview)
    }
  }

  // Update image subject
  const updateImageSubject = (id: string, subject: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, subject } : img
    ))
  }

  // Retry failed upload
  const retryUpload = async (id: string) => {
    const image = images.find(img => img.id === id)
    if (!image) return

    try {
      setImages(prev => prev.map(img => 
        img.id === id 
          ? { ...img, uploadStatus: 'uploading', uploadProgress: 0, error: undefined }
          : img
      ))

      const tempKey = await uploadImage(image)

      setImages(prev => prev.map(img => 
        img.id === id 
          ? { 
              ...img, 
              uploadStatus: 'completed' as const, 
              uploadProgress: 100,
              tempKey 
            }
          : img
      ))

      toast.success(`${image.file.name} uploaded successfully`)
    } catch (error) {
      setImages(prev => prev.map(img => 
        img.id === id 
          ? { 
              ...img, 
              uploadStatus: 'error' as const,
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : img
      ))
      toast.error(`Failed to upload ${image.file.name}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className={`relative ${dragActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
              className="hidden"
              onChange={handleInputChange}
              disabled={disabled}
            />
            
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Property Images</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports JPEG, PNG, WebP, and HEIC • Max {maxImages} images
            </p>
            
            <Button variant="outline" disabled={disabled}>
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Images ({images.length}/{maxImages})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image Preview */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain bg-gray-50 rounded-lg"
                      />
                      
                      {/* Status Overlay - Only show for uploading/error states */}
                      {(image.uploadStatus === 'uploading' || image.uploadStatus === 'error') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          {image.uploadStatus === 'uploading' && (
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          )}
                          {image.uploadStatus === 'error' && (
                            <AlertCircle className="h-6 w-6 text-red-400" />
                          )}
                        </div>
                      )}
                      
                      {/* Success indicator - small check mark in corner */}
                      {image.uploadStatus === 'completed' && (
                        <div className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium truncate">{image.file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(image.file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            image.uploadStatus === 'completed' ? 'default' :
                            image.uploadStatus === 'uploading' ? 'secondary' :
                            image.uploadStatus === 'error' ? 'destructive' : 'outline'
                          }>
                            {image.uploadStatus}
                          </Badge>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Upload Progress */}
                      {image.uploadStatus === 'uploading' && (
                        <Progress value={image.uploadProgress} className="w-full" />
                      )}

                      {/* Error Message & Retry */}
                      {image.uploadStatus === 'error' && (
                        <div className="space-y-2">
                          <p className="text-sm text-red-600">{image.error}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => retryUpload(image.id)}
                          >
                            Retry Upload
                          </Button>
                        </div>
                      )}

                      {/* Subject Selection */}
                      {image.uploadStatus === 'completed' && (
                        <div className="space-y-2">
                          <Label className="text-sm">What does this image show?</Label>
                          <select
                            value={image.subject || ''}
                            onChange={(e) => updateImageSubject(image.id, e.target.value)}
                            className="w-full text-sm border rounded px-2 py-1"
                          >
                            <option value="">Select room/area (optional)</option>
                            {COMMON_SUBJECTS.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SEO Tips */}
      {images.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">SEO Optimization</h4>
                <p className="text-sm text-blue-700">
                  Adding room/area descriptions helps your listings rank higher in search results. 
                  Each image will be automatically optimized with SEO-friendly names and descriptions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
