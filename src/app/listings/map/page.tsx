"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MapViewer = dynamic(() => import('./MapViewerComponent'), { ssr: false });

interface ApiListing {
  id: string;
  title: string;
  price: number;
  city: string;
  latitude: number;
  longitude: number;
  images: string[];
  averageRating: number;
}

export default function ListingsMap() {
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all listings
    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch listings:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement des annonce...</p>;
  }

  // Transform API listings to match MapViewerComponent expected format
  const mapListings = listings.map((l) => ({
    id: l.id,
    title: l.title,
    price: l.price,
    latitude: l.latitude,
    longitude: l.longitude,
    image: l.images?.[0] || '',
    rating: l.averageRating || 0,
  }));

  return (
    <div>
      <h1>Carte des annonce</h1>
      <div>
        <Link href="/listings">Retour à la liste</Link>
      </div>
      <MapViewer listings={mapListings} />
    </div>
  );
}