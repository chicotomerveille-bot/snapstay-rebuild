"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MapViewer = dynamic(() => import('./MapViewerComponent'), { ssr: false });

export default function ListingsMap() {
  const [listings, setListings] = useState([]);
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
    return <p>Chargement des annonces...</p>;
  }

  return (
    <div>
      <h1>Carte des annonces</h1>
      <div>
        <Link href="/listings">Retour à la liste</Link>
      </div>
      <MapViewer listings={listings} />
    </div>
  );
}