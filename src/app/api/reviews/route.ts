import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reviews - Get reviews for a listing
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get('listingId');

  if (!listingId) {
    return NextResponse.json({ error: 'listingId is required' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { listingId },
      include: { author: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, rating, comment, userId } = body;

    // Validate input
    if (!listingId || !rating || rating < 1 || rating > 5 || !userId) {
      return NextResponse.json(
        { error: 'Invalid input: listingId, rating (1-5), and userId are required' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this listing
    const existingReview = await prisma.review.findFirst({
      where: { listingId, authorId: userId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this listing' },
        { status: 409 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        listing: { connect: { id: listingId } },
        author: { connect: { id: userId } },
      },
    });

    // Update listing's average rating
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        // We'll recalculate the average from all reviews
        // For simplicity, we'll do it in a transaction or separately
        // In a real app, you might want to store a sum and count
      },
    });

    // Recalculate average rating
    const reviews = await prisma.review.findMany({
      where: { listingId },
      select: { rating: true },
    });
    const averageRating =
      reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;

    await prisma.listing.update({
      where: { id: listingId },
      data: { averageRating },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}