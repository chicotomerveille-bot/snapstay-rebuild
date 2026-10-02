import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the listing to find its city, property type, and price range
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: {
        city: true,
        propertyType: true,
        price: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const { city, propertyType, price } = listing;

    // Define similarity criteria: same city, same property type, price within 20%
    const priceMin = price * 0.8;
    const priceMax = price * 1.2;

    // Find similar listings
    const similarListings = await prisma.listing.findMany({
      where: {
        AND: [
          { city },
          { propertyType },
          { price: { gte: priceMin, lte: priceMax } },
          { id: { not: id } },
        ],
      },
      include: {
        images: true,
        _count: {
          select: { reviews: true },
        },
      },
      take: 6,
    });

    const processedListings = similarListings.map((listing: { id: string; title: string; price: number; images: { url: string }[]; averageRating: number }) => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      image: listing.images[0]?.url || '',
      rating: listing.averageRating,
    }));

    return NextResponse.json(processedListings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch similar listings' }, { status: 500 });
  }
}