"use client";

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (filters: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests: number;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    sortBy: 'latest' | 'price-low' | 'price-high' | 'rating';
  }) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [propertyType, setPropertyType] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'price-low' | 'price-high' | 'rating'>('latest');

  // Simulated city autocomplete data
  const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    if (value.length >= 2) {
      const filtered = cities.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (city: string) => {
    setCity(city);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    onSearch({
      city: city || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests,
      minPrice,
      maxPrice,
      propertyType: propertyType || undefined,
      sortBy,
    });
  };

  return (
    <div>
      <h2>Rechercher des annonces</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <label htmlFor="city">Ville :</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={handleCityChange}
            list="city-list"
          />
          <datalist id="city-list">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {showSuggestions && suggestions.length > 0 && (
            <div style={{ background: 'white', border: '1px solid #ccc', marginTop: '4px', maxHeight: '200px', overflowY: 'auto' }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  style={{ padding: '8px', cursor: 'pointer', background: index === 0 ? '#f0f0f0' : 'white' }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="checkIn">Date d'arrivée :</label>
          <input
            id="checkIn"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="checkOut">Date de départ :</label>
          <input
            id="checkOut"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="guests">Nombre d'invités :</label>
          <input
            id="guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>
        <div>
          <label htmlFor="minPrice">Prix min (€/nuit) :</label>
          <input
            id="minPrice"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="maxPrice">Prix max (€/nuit) :</label>
          <input
            id="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value) || 1000)}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="propertyType">Type de propriété :</label>
          <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
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
      </div>
      <button onClick={handleSearch} style={{ marginTop: '16px', padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Rechercher
      </button>
    </div>
  );
};