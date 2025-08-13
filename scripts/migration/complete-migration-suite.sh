#!/bin/bash

# =============================================================================
# REAL ESTATE PLATFORM - COMPLETE MIGRATION SCRIPT SUITE
# =============================================================================
# This script orchestrates the complete migration from current to redesigned architecture
# Run this from project root directory
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="real-estate-platform-v2"
BACKUP_DIR="./migration-backup-$(date +%Y%m%d-%H%M%S)"
NEW_PROJECT_DIR="../${PROJECT_NAME}"

echo -e "${BLUE}🏗️  Real Estate Platform - Complete Migration Suite${NC}"
echo -e "${BLUE}=================================================${NC}"

# =============================================================================
# Phase 1: Environment Setup & Backup
# =============================================================================

phase_1_setup() {
    echo -e "\n${YELLOW}📋 Phase 1: Environment Setup & Backup${NC}"
    
    # Create backup directory
    echo "Creating backup directory..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup current codebase
    echo "Backing up current codebase..."
    cp -r . "$BACKUP_DIR/" 2>/dev/null || {
        echo -e "${RED}Warning: Some files couldn't be backed up${NC}"
    }
    
    # Backup database schema
    echo "Backing up database schema..."
    if command -v pg_dump &> /dev/null && [ -n "$DATABASE_URL" ]; then
        pg_dump "$DATABASE_URL" --schema-only > "$BACKUP_DIR/schema-backup.sql"
        echo -e "${GREEN}✅ Database schema backed up${NC}"
    else
        echo -e "${YELLOW}⚠️  Database backup skipped (pg_dump not available or DATABASE_URL not set)${NC}"
    fi
    
    # Export environment variables
    echo "Backing up environment configuration..."
    if [ -f ".env" ]; then
        cp .env "$BACKUP_DIR/.env.backup"
        echo -e "${GREEN}✅ Environment variables backed up${NC}"
    fi
    
    echo -e "${GREEN}✅ Phase 1 Complete: Backup created in $BACKUP_DIR${NC}"
}

# =============================================================================
# Phase 2: New Project Structure Creation
# =============================================================================

phase_2_project_structure() {
    echo -e "\n${YELLOW}🏗️  Phase 2: Creating New Project Structure${NC}"
    
    # Create new project directory
    mkdir -p "$NEW_PROJECT_DIR"
    cd "$NEW_PROJECT_DIR"
    
    # Initialize new Next.js project with TypeScript
    echo "Initializing new Next.js project..."
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
    
    # Create enhanced directory structure
    echo "Creating enhanced directory structure..."
    
    # Main directories
    mkdir -p src/{components,hooks,lib,types,store,services}
    
    # Component architecture (Atomic Design)
    mkdir -p src/components/{ui/{atoms,molecules,organisms},features,layout,providers}
    
    # Feature-based organization
    mkdir -p src/components/features/{auth,properties,agent,expert,payments,messaging}
    
    # Hooks organization
    mkdir -p src/hooks/{auth,data,ui,business}
    
    # Services organization
    mkdir -p src/services/{api,auth,property,payment,analytics}
    
    # Utilities and configuration
    mkdir -p src/lib/{api,utils,config,constants}
    
    # Type definitions
    mkdir -p src/types/{api,database,ui,business}
    
    # Database and scripts
    mkdir -p {prisma,scripts/{migration,deployment,testing}}
    
    # Public assets organization
    mkdir -p public/{images/{properties,users,ui},icons,documents}
    
    # Testing structure
    mkdir -p {__tests__,cypress/{integration,fixtures,support}}
    
    echo -e "${GREEN}✅ Enhanced project structure created${NC}"
}

# =============================================================================
# Phase 3: Dependencies Installation
# =============================================================================

phase_3_dependencies() {
    echo -e "\n${YELLOW}📦 Phase 3: Installing Modern Dependencies${NC}"
    
    # Remove default dependencies we'll replace
    npm uninstall @types/node @types/react @types/react-dom
    
    # Core Next.js and React
    echo "Installing core dependencies..."
    npm install next@latest react@latest react-dom@latest
    npm install -D typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest
    
    # UI and Styling
    echo "Installing UI dependencies..."
    npm install tailwindcss@latest @tailwindcss/typography @tailwindcss/forms
    npm install lucide-react class-variance-authority clsx tailwind-merge
    npm install framer-motion @radix-ui/react-slot
    
    # Authentication (Modern)
    echo "Installing authentication dependencies..."
    npm install @clerk/nextjs  # Modern auth alternative
    # npm install next-auth@beta  # If staying with NextAuth
    
    # Database and ORM
    echo "Installing database dependencies..."
    npm install prisma @prisma/client
    npm install drizzle-orm drizzle-kit  # Performance-focused alternative
    
    # State Management
    echo "Installing state management..."
    npm install zustand @tanstack/react-query
    
    # Forms and Validation
    echo "Installing form dependencies..."
    npm install react-hook-form @hookform/resolvers zod
    
    # HTTP Client
    echo "Installing HTTP client..."
    npm install axios
    
    # Image Processing
    echo "Installing image processing..."
    npm install sharp
    # npm install @cloudinary/react @cloudinary/url-gen  # If using Cloudinary
    
    # Real-time Communication (Modern)
    echo "Installing real-time dependencies..."
    npm install pusher-js pusher  # Modern alternative to Socket.IO
    # npm install @supabase/supabase-js  # If using Supabase
    
    # Email Service (Modern)
    echo "Installing email service..."
    npm install resend react-email  # Modern email solution
    
    # Payments
    echo "Installing payment dependencies..."
    npm install stripe @stripe/stripe-js
    
    # Utilities
    echo "Installing utility dependencies..."
    npm install date-fns slugify uuid
    npm install -D @types/uuid
    
    # Testing
    echo "Installing testing dependencies..."
    npm install -D jest @testing-library/react @testing-library/jest-dom
    npm install -D cypress @cypress/react
    
    # Development tools
    echo "Installing development dependencies..."
    npm install -D eslint-config-next @typescript-eslint/eslint-plugin
    npm install -D prettier eslint-config-prettier
    npm install -D husky lint-staged
    
    # Monitoring and Analytics
    echo "Installing monitoring dependencies..."
    npm install @sentry/nextjs
    # npm install @vercel/analytics  # If deploying to Vercel
    
    echo -e "${GREEN}✅ Modern dependencies installed${NC}"
}

# =============================================================================
# Phase 4: Configuration Files
# =============================================================================

phase_4_configuration() {
    echo -e "\n${YELLOW}⚙️  Phase 4: Setting Up Configuration Files${NC}"
    
    # Next.js configuration with performance optimizations
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['s3.amazonaws.com', 'real-estate-hub-michalbabula-2025.s3.eu-north-1.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/auth/signup',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
EOF

    # TypeScript configuration with strict settings
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/services/*": ["./src/services/*"],
      "@/store/*": ["./src/store/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

    # Enhanced Tailwind configuration
    cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
EOF

    # ESLint configuration
    cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
EOF

    # Prettier configuration
    cat > .prettierrc << 'EOF'
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
EOF

    echo -e "${GREEN}✅ Configuration files created${NC}"
}

# =============================================================================
# Phase 5: Core Library Setup
# =============================================================================

phase_5_core_libraries() {
    echo -e "\n${YELLOW}🔧 Phase 5: Setting Up Core Libraries${NC}"
    
    # Create directory structure for libraries
    mkdir -p src/lib/{auth,database,email,storage,payment,validation}
    
    # Database configuration
    cat > src/lib/database/index.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
EOF

    # Authentication configuration (Clerk example)
    cat > src/lib/auth/config.ts << 'EOF'
export const authConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
  signInUrl: '/auth/login',
  signUpUrl: '/auth/signup',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/complete-registration',
}
EOF

    # Email service configuration (Resend)
    cat > src/lib/email/config.ts << 'EOF'
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const emailConfig = {
  from: process.env.EMAIL_FROM || 'onboarding@yourdomain.com',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@yourdomain.com',
}
EOF

    # Storage configuration (AWS S3)
    cat > src/lib/storage/config.ts << 'EOF'
import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const storageConfig = {
  bucket: process.env.AWS_S3_BUCKET!,
  region: process.env.AWS_REGION || 'eu-north-1',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
}
EOF

    # Payment configuration (Stripe)
    cat > src/lib/payment/config.ts << 'EOF'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

export const paymentConfig = {
  currency: 'USD',
  successUrl: process.env.NEXT_PUBLIC_URL + '/upgrade-success',
  cancelUrl: process.env.NEXT_PUBLIC_URL + '/pricing',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
}
EOF

    # Validation schemas
    cat > src/lib/validation/schemas.ts << 'EOF'
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  agencyName: z.string().optional(),
  bio: z.string().optional(),
})

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be positive'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  type: z.enum(['SALE', 'RENT']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  squareFeet: z.number().positive().optional(),
})

export const leadSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional(),
  preferredContact: z.enum(['EMAIL', 'PHONE', 'BOTH']).default('EMAIL'),
})
EOF

    echo -e "${GREEN}✅ Core libraries setup complete${NC}"
}

# =============================================================================
# Phase 6: Data Migration
# =============================================================================

phase_6_data_migration() {
    echo -e "\n${YELLOW}📊 Phase 6: Data Migration Planning${NC}"
    
    # Create migration scripts directory
    mkdir -p scripts/migration
    
    # Database migration script
    cat > scripts/migration/migrate-data.sql << 'EOF'
-- Real Estate Platform Data Migration Script
-- Run this after setting up the new database schema

-- Create temporary tables for data transformation
CREATE TEMPORARY TABLE temp_user_mapping (
    old_id TEXT,
    new_id TEXT,
    email TEXT,
    migrated_at TIMESTAMP DEFAULT NOW()
);

-- Migrate Users with enhanced fields
INSERT INTO "User" (
    id, email, name, image, role, phone, agencyName, bio,
    packageId, subscriptionStatus, stripeCustomerId,
    createdAt, updatedAt
)
SELECT 
    id, email, name, image, role, phone, agencyName, bio,
    packageId, 
    CASE 
        WHEN subscriptionStatus = 'ACTIVE' THEN 'ACTIVE'::SubscriptionStatus
        WHEN subscriptionStatus = 'EXPIRED' THEN 'EXPIRED'::SubscriptionStatus
        ELSE 'FREE'::SubscriptionStatus
    END,
    stripeCustomerId, createdAt, updatedAt
FROM old_users;

-- Migrate Listings with SEO enhancements
INSERT INTO "Listing" (
    id, agentId, title, slug, description, metaDescription,
    price, currency, location, type, status,
    publishedAt, createdAt, updatedAt
)
SELECT 
    id, agentId, title, 
    COALESCE(slug, LOWER(REPLACE(title, ' ', '-'))),
    description,
    COALESCE(metaDescription, LEFT(description, 160)),
    price, currency, location, type, status,
    publishedAt, createdAt, updatedAt
FROM old_listings;

-- Migrate Images with new structure
INSERT INTO "ListingImage" (
    id, listingId, altText, originalName, storageKey,
    url_large, url_medium, url_small, url_thumbnail, url,
    sortOrder, createdAt
)
SELECT 
    id, listingId, 
    COALESCE(altText, 'Property image'),
    originalName, storageKey,
    url, url, url, url, url,  -- Will be updated by image processing
    COALESCE(sortOrder, 0),
    createdAt
FROM old_listing_images;

-- Log migration results
INSERT INTO temp_user_mapping (old_id, new_id, email)
SELECT id, id, email FROM "User";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listing_agent_id ON "Listing"(agentId);
CREATE INDEX IF NOT EXISTS idx_listing_type ON "Listing"(type);
CREATE INDEX IF NOT EXISTS idx_listing_status ON "Listing"(status);
CREATE INDEX IF NOT EXISTS idx_listing_price ON "Listing"(price);
CREATE INDEX IF NOT EXISTS idx_listing_location ON "Listing"(location);
CREATE INDEX IF NOT EXISTS idx_listing_published ON "Listing"(publishedAt);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_listing_search ON "Listing" 
USING gin(to_tsvector('english', title || ' ' || description));
EOF

    # Node.js data migration script
    cat > scripts/migration/migrate-users.js << 'EOF'
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function migrateUsers() {
  console.log('Starting user migration...')
  
  try {
    // Get all users from old system
    const oldUsers = await prisma.user.findMany({
      include: {
        listings: true,
        leads: true,
      }
    })
    
    console.log(`Found ${oldUsers.length} users to migrate`)
    
    for (const user of oldUsers) {
      // Hash password if it exists and isn't already hashed
      let passwordHash = user.passwordHash
      if (passwordHash && !passwordHash.startsWith('$2a$')) {
        passwordHash = await bcrypt.hash(passwordHash, 12)
      }
      
      // Update user with new fields
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          // Add any new fields with default values
          emailVerified: user.emailVerified || null,
          subscriptionEnd: user.subscriptionEnd || null,
        }
      })
      
      console.log(`Migrated user: ${user.email}`)
    }
    
    console.log('User migration completed successfully')
  } catch (error) {
    console.error('Error during user migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateUsers()
EOF

    # Image migration script
    cat > scripts/migration/migrate-images.js << 'EOF'
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const sharp = require('sharp')
const { PrismaClient } = require('@prisma/client')

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const prisma = new PrismaClient()

async function migrateImages() {
  console.log('Starting image migration and optimization...')
  
  try {
    const images = await prisma.listingImage.findMany()
    
    for (const image of images) {
      console.log(`Processing image: ${image.id}`)
      
      try {
        // Download original image
        const getCommand = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: image.storageKey,
        })
        
        const response = await s3Client.send(getCommand)
        const imageBuffer = await response.Body.transformToByteArray()
        
        // Generate optimized versions
        const versions = {
          large: { width: 1200, quality: 85 },
          medium: { width: 800, quality: 80 },
          small: { width: 400, quality: 75 },
          thumbnail: { width: 200, quality: 70 },
        }
        
        const urls = {}
        
        for (const [size, config] of Object.entries(versions)) {
          const optimizedBuffer = await sharp(imageBuffer)
            .resize(config.width)
            .jpeg({ quality: config.quality })
            .toBuffer()
          
          const key = `optimized/${size}/${image.storageKey}`
          
          await s3Client.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: optimizedBuffer,
            ContentType: 'image/jpeg',
          }))
          
          urls[`url_${size}`] = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
        }
        
        // Update database with new URLs
        await prisma.listingImage.update({
          where: { id: image.id },
          data: urls,
        })
        
        console.log(`✅ Optimized image: ${image.id}`)
      } catch (error) {
        console.error(`❌ Failed to process image ${image.id}:`, error.message)
      }
    }
    
    console.log('Image migration completed')
  } catch (error) {
    console.error('Error during image migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateImages()
EOF

    echo -e "${GREEN}✅ Data migration scripts created${NC}"
}

# =============================================================================
# Phase 7: Component Migration
# =============================================================================

phase_7_component_migration() {
    echo -e "\n${YELLOW}🧩 Phase 7: Component Architecture Migration${NC}"
    
    # Create component migration script
    cat > scripts/migration/migrate-components.sh << 'EOF'
#!/bin/bash

# Component Migration Script
# Migrates existing components to new atomic design structure

echo "🧩 Starting component migration..."

# Create base component structure
mkdir -p src/components/ui/{atoms,molecules,organisms}
mkdir -p src/components/features/{auth,properties,agent,expert,payments,messaging}
mkdir -p src/components/layout

# Copy and restructure existing UI components
echo "Migrating UI components..."

# Atomic components (smallest building blocks)
cp ../../current/src/components/ui/button.tsx src/components/ui/atoms/
cp ../../current/src/components/ui/input.tsx src/components/ui/atoms/
cp ../../current/src/components/ui/label.tsx src/components/ui/atoms/
cp ../../current/src/components/ui/badge.tsx src/components/ui/atoms/

# Molecular components (combinations of atoms)
cp ../../current/src/components/ui/card.tsx src/components/ui/molecules/
cp ../../current/src/components/ui/dialog.tsx src/components/ui/molecules/
cp ../../current/src/components/ui/form.tsx src/components/ui/molecules/

# Organism components (complex UI sections)
if [ -f "../../current/src/components/global-navigation.tsx" ]; then
    cp ../../current/src/components/global-navigation.tsx src/components/layout/navigation.tsx
fi

# Feature-specific components
echo "Migrating feature components..."

# Authentication components
if [ -d "../../current/src/app/auth" ]; then
    mkdir -p src/components/features/auth
    find ../../current/src/app/auth -name "*.tsx" -exec cp {} src/components/features/auth/ \;
fi

# Property components
if [ -d "../../current/src/app/properties" ]; then
    mkdir -p src/components/features/properties
    find ../../current/src/app/properties -name "*.tsx" -exec cp {} src/components/features/properties/ \;
fi

echo "✅ Component migration completed"
echo "📝 Next steps:"
echo "  1. Review migrated components for atomic design compliance"
echo "  2. Update import paths in migrated components"
echo "  3. Implement new component patterns where needed"
EOF

    chmod +x scripts/migration/migrate-components.sh

    # Create component refactoring guide
    cat > scripts/migration/COMPONENT_REFACTORING_GUIDE.md << 'EOF'
# Component Refactoring Guide

## Atomic Design Principles

### Atoms (Basic Building Blocks)
- Button, Input, Label, Icon, Badge
- No business logic
- Highly reusable
- Single responsibility

### Molecules (Simple Combinations)
- SearchBar, PropertyCard, NavigationItem
- Combine atoms with simple logic
- Reusable across features

### Organisms (Complex UI Sections)
- Header, PropertyGrid, FilterPanel
- Combine molecules and atoms
- Feature-specific logic

## Migration Checklist

### For Each Component:
- [ ] Identify component type (atom/molecule/organism)
- [ ] Extract business logic to custom hooks
- [ ] Implement proper TypeScript types
- [ ] Add proper prop validation
- [ ] Update import/export statements
- [ ] Add documentation comments
- [ ] Create Storybook stories (if applicable)

### Example Refactoring:

**Before (Large Component):**
```tsx
export default function PropertyPage() {
  // 200+ lines of mixed UI and business logic
}
```

**After (Atomic Structure):**
```tsx
// organisms/PropertyDetail.tsx
export function PropertyDetail() {
  return (
    <PropertyContainer>
      <PropertyHeader property={property} />
      <PropertyImageGallery images={images} />
      <PropertySpecifications specs={specs} />
      <AgentContactCard agent={agent} />
    </PropertyContainer>
  )
}

// molecules/PropertyHeader.tsx
export function PropertyHeader({ property }) {
  return (
    <div>
      <PropertyTitle title={property.title} />
      <PropertyPrice price={property.price} />
      <PropertyBadge type={property.type} />
    </div>
  )
}
```

## New Patterns to Implement

### 1. Compound Components
```tsx
<PropertyCard>
  <PropertyCard.Image src={image} />
  <PropertyCard.Header>
    <PropertyCard.Title>{title}</PropertyCard.Title>
    <PropertyCard.Price>{price}</PropertyCard.Price>
  </PropertyCard.Header>
  <PropertyCard.Footer>
    <PropertyCard.Actions />
  </PropertyCard.Footer>
</PropertyCard>
```

### 2. Render Props Pattern
```tsx
<PropertyProvider>
  {({ property, loading, error }) => (
    <PropertyDetail property={property} />
  )}
</PropertyProvider>
```

### 3. Custom Hooks for Business Logic
```tsx
function useProperty(id: string) {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Business logic here
  
  return { property, loading, error, updateProperty }
}
```
EOF

    echo -e "${GREEN}✅ Component migration framework created${NC}"
}

# =============================================================================
# Main Execution Function
# =============================================================================

main() {
    echo -e "${BLUE}🚀 Starting Real Estate Platform Migration${NC}"
    echo -e "${BLUE}=========================================${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
        exit 1
    fi
    
    # Check for required environment variables
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${YELLOW}⚠️  Warning: DATABASE_URL not set. Database operations may fail.${NC}"
    fi
    
    # Run migration phases
    phase_1_setup
    phase_2_project_structure
    phase_3_dependencies
    phase_4_configuration
    phase_5_core_libraries
    phase_6_data_migration
    phase_7_component_migration
    
    echo -e "\n${GREEN}🎉 Migration Suite Complete!${NC}"
    echo -e "${GREEN}===============================\n${NC}"
    echo -e "${YELLOW}📋 Next Steps:${NC}"
    echo "1. Review the new project structure in: $NEW_PROJECT_DIR"
    echo "2. Update environment variables for the new project"
    echo "3. Run database migrations: npm run db:migrate"
    echo "4. Execute data migration scripts in scripts/migration/"
    echo "5. Update component imports and fix any breaking changes"
    echo "6. Test core functionality before full deployment"
    echo ""
    echo -e "${BLUE}📁 Backup Location: $BACKUP_DIR${NC}"
    echo -e "${BLUE}📁 New Project: $NEW_PROJECT_DIR${NC}"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Run the migration if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
