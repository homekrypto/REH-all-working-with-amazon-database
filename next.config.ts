import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  // Performance optimizations for faster builds
  experimental: {
    optimizePackageImports: ['@radix-ui', 'lucide-react', '@tanstack/react-query'],
  },
  // External packages for server components (moved from experimental)
  serverExternalPackages: ['prisma', '@prisma/client'],
  // Don't use standalone output for Amplify - it expects standard Next.js
  // output: 'standalone',
  // Configure external image domains for Next.js Image component
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'real-estate-hub-michalbabula-2025.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Enable image proxy for S3 images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Image optimization
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable Next.js hot reloading for better development experience
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Re-enable webpack hot module replacement for better DX
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  eslint: {
    // Temporarily ignore ESLint during builds for deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
