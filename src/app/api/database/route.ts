import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');

    if (!table) {
      // Return list of all tables with counts
      const results = {
        users: await db.user.count(),
        listings: await db.listing.count(),
        packages: await db.package.count(),
        leads: await db.lead.count(),
        messages: await db.message.count(),
        conversations: await db.conversation.count(),
        favorites: await db.favorite.count()
      };
      return NextResponse.json({ tables: results });
    }

    // Return data for specific table
    let data;
    switch (table.toLowerCase()) {
      case 'users':
        data = await db.user.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            subscriptionStatus: true,
            createdAt: true,
            phone: true,
            agencyName: true
          }
        });
        break;
      case 'listings':
        data = await db.listing.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        });
        break;
      case 'packages':
        data = await db.package.findMany({
          orderBy: { createdAt: 'desc' }
        });
        break;
      case 'leads':
        data = await db.lead.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, email: true } },
            agent: { select: { name: true, email: true } },
            listing: { select: { title: true } }
          }
        });
        break;
      case 'messages':
        data = await db.message.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: { select: { name: true, email: true } }
          }
        });
        break;
      case 'conversations':
        data = await db.conversation.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            participants: {
              include: {
                user: { select: { name: true, email: true } }
              }
            }
          }
        });
        break;
      case 'favorites':
        data = await db.favorite.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, email: true } },
            listing: { select: { title: true } }
          }
        });
        break;
      default:
        return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    console.error('Database API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
