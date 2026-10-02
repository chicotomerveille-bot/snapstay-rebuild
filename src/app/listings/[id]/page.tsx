import { notFound } from 'next/navigation';
import ListingDetailClient from './ListingDetailClient';

export const dynamic = 'force-dynamic';

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listingId = params.id;

  // Fetch the listing
  const res = await fetch(`http://localhost:3000/api/listings/${listingId}`);
  if (!res.ok) {
    notFound();
  }

  const listing = await res.json();

  return <ListingDetailClient listing={listing} />;
}