import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const packages = await db.package.findMany({
      where: { active: true },
      orderBy: { price: 'asc' }
    });

    // Parse features JSON for each package
    const packagesWithParsedFeatures = packages.map(pkg => ({
      ...pkg,
      features: JSON.parse(pkg.features)
    }));

    return NextResponse.json({
      success: true,
      packages: packagesWithParsedFeatures
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
