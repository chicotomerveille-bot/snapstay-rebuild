'use client';

import { useState } from 'react';
import { UploadImages } from '@/components/UploadImages';
import Link from 'next/link';

export default function NewListingPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(0);
  const [propertyType, setPropertyType] = useState('');
  const [rooms, setRooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [guests, setGuests] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
      const files = Array.from(e.target.files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement listing creation
    console.log('Creating listing:', {
      title,
      description,
      city,
      address,
      price,
      propertyType,
      rooms,
      bathrooms,
      guests,
      imageCount: selectedFiles?.length || 0,
    });
    // Reset form
    setTitle('');
    setDescription('');
    setCity('');
    setAddress('');
    setPrice(0);
    setPropertyType('');
    setRooms(0);
    setBathrooms(0);
    setGuests(0);
    setSelectedFiles(null);
    setPreviews([]);
    alert('Annonce créée avec succès !');
  };

  return (
    <div>
      <h1>Créer une nouvelle annonce</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titre :</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="city">Ville :</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Adresse :</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price">Prix par nuit (en cents) :</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="propertyType">Type de propriété :</label>
          <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Sélectionnez un type</option>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
          </select>
        </div>
        <div>
          <label htmlFor="rooms">Nombre de pièces :</label>
          <input
            id="rooms"
            type="number"
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value) || 0)}
            min="1"
          />
        </div>
        <div>
          <label htmlFor="bathrooms">Nombre de salles de bain :</label>
          <input
            id="bathrooms"
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="guests">Nombre d'invités :</label>
          <input
            id="guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
            min="1"
          />
        </div>
        <div>
          <label htmlFor="images">Images :</label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {selectedFiles && (
            <p>
              {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} sélectionnée{selectedFiles.length > 1 ? 's' : ''}
            </p>
          )}
          <div>
            {previews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index}`} style={{ maxWidth: '150px', margin: '5px' }} />
            ))}
          </div>
        </div>
        <button type="submit">Créer l'annonce</button>
      </form>
      <div>
        <Link href="/host/listings">Mes annonces</Link>
      </div>
    </div>
  );
}