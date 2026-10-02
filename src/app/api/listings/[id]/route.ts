import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/listings/[id] - Get a single listing by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
        host: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Transform to include average rating and image URLs
    const transformedListing = {
      ...listing,
      averageRating: listing.averageRating,
      reviewCount: listing.reviews.length,
      images: listing.images.map((img) => img.url),
      reviews: listing.reviews.map((review) => ({
        ...review,
        author: review.author,
      })),
    };

    return NextResponse.json(transformedListing);
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, city, address, latitude, longitude, price, propertyType, rooms, bathrooms, guests, hostId, images } = body;

    // Verify the listing exists and the host matches
    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (hostId && existingListing.hostId !== hostId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the listing
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description,
        city,
        address,
        latitude,
        longitude,
        price,
        propertyType,
        rooms,
        bathrooms,
        guests,
        images: images
          ? {
              deleteMany: {},
              create: images.map((url: string) => ({ url })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ ...updatedListing, images: updatedListing.images.map((img) => img.url) });
  } catch (error) {
    console.error('Failed to update listing:', error);
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get('hostId');

    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (hostId && existingListing.hostId !== hostId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete listing:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}