'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { generatePropertyStructuredData } from '@/lib/image-processing'

interface PropertyImageProps {
  image: {
    id: string
    altText: string
    url_large: string
    url_medium: string
    url_small: string
    url_thumbnail: string
    imageSubject?: string
  }
  priority?: boolean
  className?: string
}

interface PropertyGalleryProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    currency: string
    location: string
    images: Array<{
      id: string
      altText: string
      url_large: string
      url_medium: string
      url_small: string
      url_thumbnail: string
      imageSubject?: string
      sortOrder: number
    }>
  }
}

// SEO-optimized image component
export function PropertyImage({ image, priority = false, className = "" }: PropertyImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={image.url_large}
        alt={image.altText}
        width={1920}
        height={1080}
        priority={priority}
        className="w-full h-full object-contain bg-gray-100 transition-transform hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyBYW18cZkG3a3Zy4Wbcmm1qz4o0p8bvk5SMdKmnKcmlYJ6/q5KTFMSU13R/9k="
      />
      
      {image.imageSubject && (
        <Badge 
          variant="secondary" 
          className="absolute bottom-2 left-2 bg-black/70 text-white"
        >
          {image.imageSubject}
        </Badge>
      )}
    </div>
  )
}

// Main property gallery component
export function PropertyGallery({ property }: PropertyGalleryProps) {
  const sortedImages = [...property.images].sort((a, b) => a.sortOrder - b.sortOrder)
  const heroImage = sortedImages[0]
  const galleryImages = sortedImages.slice(1)

  // Generate structured data for SEO
  const structuredData = generatePropertyStructuredData({
    title: property.title,
    description: property.description,
    price: property.price,
    currency: property.currency,
    images: property.images.map(img => ({
      url_large: img.url_large,
      altText: img.altText
    })),
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/properties/${property.id}`
  })

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="space-y-6">
        {/* Hero Image */}
        {heroImage && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <PropertyImage
                image={heroImage}
                priority={true}
                className="h-[400px] md:h-[500px] lg:h-[600px]"
              />
            </CardContent>
          </Card>
        )}

        {/* Image Gallery Grid */}
        {galleryImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Property Gallery</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <Card key={image.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <PropertyImage
                      image={image}
                      priority={index < 4} // Prioritize first few images
                      className="h-48 cursor-pointer hover:shadow-lg transition-shadow"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SEO Benefits Notice (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-2">🚀 SEO Optimizations Active</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ Responsive images with WebP format</li>
                <li>✅ Descriptive alt text for each image</li>
                <li>✅ Structured data (JSON-LD) for rich results</li>
                <li>✅ SEO-friendly image filenames</li>
                <li>✅ Proper image sizing and compression</li>
                <li>✅ Image sitemap generation</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

// Hook for property detail pages
export function usePropertySEO(property: PropertyGalleryProps['property']) {
  // Generate meta tags for the page
  const metaTags = {
    title: `${property.title} - For Sale in ${property.location}`,
    description: property.description,
    image: property.images[0]?.url_large,
    imageAlt: property.images[0]?.altText,
  }

  return metaTags
}
