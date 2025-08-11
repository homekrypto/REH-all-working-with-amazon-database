/**
 * SEO Sitemap Generation for Real Estate Platform
 * Ensures all property URLs are discoverable by search engines
 */

import { db } from '@/lib/db'

interface SitemapUrl {
  url: string
  lastModified: string
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: number
}

/**
 * Generate sitemap URLs for all active property listings
 */
export async function generatePropertySitemapUrls(baseUrl: string): Promise<SitemapUrl[]> {
  try {
    const listings = await db.listing.findMany({
      where: {
        status: 'active'
      },
      select: {
        slug: true,
        id: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return listings.map(listing => ({
      url: `${baseUrl}/properties/${listing.slug || listing.id}`,
      lastModified: listing.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  } catch (error) {
    console.error('Error generating property sitemap URLs:', error)
    return []
  }
}

/**
 * Generate complete sitemap XML
 */
export async function generateSitemap(baseUrl: string): Promise<string> {
  const staticUrls: SitemapUrl[] = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ]

  const propertyUrls = await generatePropertySitemapUrls(baseUrl)
  const allUrls = [...staticUrls, ...propertyUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return xml
}
