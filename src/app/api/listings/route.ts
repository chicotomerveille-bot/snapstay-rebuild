import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/listings - Get all listings with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const propertyType = searchParams.get('propertyType');
  const guests = searchParams.get('guests');
  const sortBy = searchParams.get('sortBy') || 'latest';
  const limit = searchParams.get('limit');

  try {
    const where: Record<string, unknown> = {};

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price = { ...(where.price as object), gte: parseInt(minPrice) };
      if (maxPrice) where.price = { ...(where.price as object), lte: parseInt(maxPrice) };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (guests) {
      where.guests = { gte: parseInt(guests) };
    }

    let orderBy: Record<string, unknown> = { createdAt: 'desc' };

    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'latest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      include: {
        images: true,
        reviews: { select: { rating: true } },
      },
      take: limit ? parseInt(limit) : undefined,
    });

    // Transform to include average rating and image URLs
    const transformedListings = listings.map((listing) => ({
      ...listing,
      averageRating: listing.averageRating,
      reviewCount: listing.reviews.length,
      images: listing.images.map((img: { url: string }) => img.url),
    }));

    return NextResponse.json(transformedListings);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, city, address, latitude, longitude, price, propertyType, rooms, bathrooms, guests, hostId, images } = body;

    if (!title || !city || !price || !hostId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, city, price, hostId' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        city,
        address,
        latitude: latitude || 0,
        longitude: longitude || 0,
        price,
        propertyType: propertyType || 'apartment',
        rooms: rooms || 1,
        bathrooms: bathrooms || 1,
        guests: guests || 1,
        host: { connect: { id: hostId } },
        images: {
          create: (images || []).map((url: string) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ ...listing, images: listing.images.map((img: { url: string }) => img.url) }, { status: 201 });
  } catch (error) {
    console.error('Failed to create listing:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}