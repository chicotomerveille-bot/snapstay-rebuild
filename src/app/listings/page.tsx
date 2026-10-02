"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';

interface Listing {
  id: string;
  title: string;
  description: string | null;
  city: string;
  address: string | null;
  price: number;
  propertyType: string;
  rooms: number;
  bathrooms: number;
  guests: number;
  images: string[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'latest' | 'price-low' | 'price-high' | 'rating'>('latest');
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // Fetch listings with sorting and filters
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.city) params.append('city', filters.city as string);
        if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
        if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
        if (filters.propertyType) params.append('propertyType', filters.propertyType as string);
        if (filters.guests) params.append('guests', String(filters.guests));
        params.append('sortBy', sortBy);

        const response = await fetch(`/api/listings?${params}`);
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [sortBy, filters]);

  if (loading) {
    return <p>Chargement des annonces...</p>;
  }

  return (
    <div>
      <h1>Annonces</h1>
      <div>
        <SearchBar
          onSearch={(searchFilters) => {
            setFilters({
              city: searchFilters.city,
              minPrice: searchFilters.minPrice,
              maxPrice: searchFilters.maxPrice,
              propertyType: searchFilters.propertyType,
              guests: searchFilters.guests,
            });
            setSortBy(searchFilters.sortBy);
          }}
        />
      </div>

      <div>
        <label htmlFor="viewMode">Afficher par :</label>
        <select
          id="viewMode"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as 'list' | 'map')}
        >
          <option value="list">Liste</option>
          <option value="map">Carte</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortBy">Trier par :</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'latest' | 'price-low' | 'price-high' | 'rating')}
        >
          <option value="latest">Les plus récentes</option>
          <option value="price-low">Prix croissant</option>
          <option value="price-high">Prix décroissant</option>
          <option value="rating">Note décroissante</option>
        </select>
      </div>

      {viewMode === 'list' ? (
        <div>
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listings/${listing.id}`} passHref>
              <div style={{ border: '1px solid #ddd', margin: '16px 0', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <img
                    src={listing.images?.[0] || ''}
                    alt={listing.title}
                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                  />
                  <div>
                    <h2>{listing.title}</h2>
                    <p>{listing.description}</p>
                    <p>
                      <strong>Prix :</strong> {listing.price / 100}€/nuit
                    </p>
                    <p>
                      <strong>Localisation :</strong> {listing.city}, {listing.address}
                    </p>
                    <div>
                      <strong>Notes :</strong>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= listing.averageRating ? '★' : '☆'}
                        </span>
                      ))}
                      <span> ({listing.averageRating}/5)</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div>
          {/* In map view, we could show a map, but we have a separate page for map view */}
          <p>
            Utilisez la <a href="/listings/map">vue carte</a> pour voir les annonces sur une carte.
          </p>
        </div>
      )}
    </div>
  );
}