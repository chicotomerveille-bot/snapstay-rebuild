'use client';

import { useEffect, useState } from 'react';
import { MapComponent } from '@/components/MapComponent';
import { ReviewSystem } from '@/components/ReviewSystem';
import { useRouter } from 'next/navigation';

interface Listing {
  id: string;
  title: string;
  description: string | null;
  city: string;
  address: string | null;
  latitude: number;
  longitude: number;
  price: number;
  propertyType: string;
  rooms: number;
  bathrooms: number;
  guests: number;
  images: string[];
  averageRating: number;
  host: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ListingDetailClientProps {
  listing: Listing;
}

export default function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    // Fetch reviews for this listing
    fetch(`/api/reviews?listingId=${listing.id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoadingReviews(false);
      })
      .catch((err) => {
        console.error('Failed to fetch reviews:', err);
        setLoadingReviews(false);
      });
  }, [listing.id]);

  return (
    <div>
      <div>
        <h1>{listing.title}</h1>
        <p>{listing.description}</p>
        <div>
          <strong>Prix :</strong> {listing.price / 100}€/nuit
        </div>
        <div>
          <strong>Localisation :</strong> {listing.city}, {listing.address}
        </div>
        <div>
          <strong>Caractéristiques :</strong>
          <span>{listing.rooms} pièces</span>
          <span>{listing.bathrooms} salles de bain</span>
          <span>{listing.guests} invités</span>
        </div>
        <div>
          <strong>Hôte :</strong>
          <img
            src={listing.host.image || '/default-avatar.png'}
            alt={listing.host.name || 'Hôte'}
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          <span>{listing.host.name}</span>
        </div>
      </div>

      <div>
        <h2>Carte</h2>
        <MapComponent
          center={[listing.latitude, listing.longitude]}
          zoom={15}
          markers={[
            {
              position: [listing.latitude, listing.longitude],
              popup: listing.title,
            }
          ]}
        />
      </div>

      <div>
        <h2>Avis</h2>
        {loadingReviews ? (
          <p>Chargement des avis...</p>
        ) : (
          <ReviewSystem
            listingId={listing.id}
            reviews={reviews}
            averageRating={listing.averageRating}
          />
        )}
      </div>

      <div>
        <button onClick={() => router.back()}>
          Retour à la liste
        </button>
      </div>
    </div>
  );
}