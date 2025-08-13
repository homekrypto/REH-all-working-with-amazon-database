import { Metadata } from 'next';
import { ReactNode } from 'react';

async function getPropertyForMetadata(id: string) {
  try {
    // Use correct base URL for local development
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:${process.env.PORT || 3002}`
      : (process.env.NEXTAUTH_URL || 'https://main.d1ec4l2vmh6hbe.amplifyapp.com');
    
    const response = await fetch(`${baseUrl}/api/listings/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) {
      console.error(`Failed to fetch property ${id}: ${response.status} ${response.statusText}`);
      return null; // Return null instead of throwing to prevent build failures
    }
    const data = await response.json();
    return data.listing;
  } catch (error) {
    console.error('Error fetching property for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const property = await getPropertyForMetadata(resolvedParams.id);
  if (!property) {
    return {
      title: 'Property Not Found | RealEstateHub',
      description: 'The requested property could not be found.'
    };
  }
  function extractCityState(location: string): { city: string; state: string } {
    const parts = location.split(',').map(part => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return {
        city: parts[parts.length - 2],
        state: parts[parts.length - 1]
      };
    }
    return { city: parts[0] || '', state: '' };
  }
  const { city, state } = extractCityState(property.location);
  const optimizedTitle = state 
    ? `${property.title} in ${city}, ${state} | RealEstateHub`
    : `${property.title} in ${city} | RealEstateHub`;
  const description = property.metaDescription || 
    `View photos and details for ${property.title} in ${city}${state ? `, ${state}` : ''}. ${property.type} property. Contact an agent today!`;
  const firstImageUrl = property.images && property.images.length > 0 
    ? property.images[0].url_large || property.images[0].url
    : null;
  return {
    title: optimizedTitle,
    description,
    openGraph: {
      title: optimizedTitle,
      description,
      type: 'website',
      images: firstImageUrl ? [
        {
          url: firstImageUrl,
          width: 1200,
          height: 630,
          alt: property.images[0]?.altText || `Image of ${property.title}`
        }
      ] : [],
      locale: 'en_US',
      siteName: 'RealEstateHub'
    },
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description,
      images: firstImageUrl ? [firstImageUrl] : []
    },
    alternates: {
      canonical: `/properties/${property.slug || property.id}`
    }
  };
}

export default function PropertyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
