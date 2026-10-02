import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the review to get the listingId for recalculating average
    const review = await prisma.review.findUnique({
      where: { id },
      select: { listingId: true, rating: true },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    // Recalculate average rating for the listing
    const reviews = await prisma.review.findMany({
      where: { listingId: review.listingId },
      select: { rating: true },
    });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, rev: { rating: number }) => sum + rev.rating, 0) / reviews.length
        : 0;

    await prisma.listing.update({
      where: { id: review.listingId },
      data: { averageRating },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}