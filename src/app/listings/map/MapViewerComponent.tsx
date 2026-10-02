"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Link from 'next/link';

interface ListingProps {
  listings: {
    id: string;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    image: string;
    rating: number;
  }[];
}

export default function MapViewerComponent({ listings }: ListingProps) {
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]);

  useEffect(() => {
    if (listings.length > 0) {
      setCenter([listings[0].latitude, listings[0].longitude]);
    }
  }, [listings]);

  return (
    <div>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude, listing.longitude]}
          >
            <Popup>
              <Link href={`/listings/${listing.id}`} passHref>
                <div>
                  <img
                    src={listing.image}
                    alt={listing.title}
                    style={{ width: '150px', height: '100px', objectFit: 'cover' }}
                  />
                  <h3>{listing.title}</h3>
                  <p>Prix : {listing.price / 100}€/nuit</p>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= listing.rating ? '★' : '☆'}
                      </span>
                    ))}
                    <span> ({listing.rating}/5)</span>
                  </div>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};