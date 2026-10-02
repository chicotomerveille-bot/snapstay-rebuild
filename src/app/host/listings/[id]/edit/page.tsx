'use client';

import { useState, useEffect } from 'react';
import { UploadImages } from '@/components/UploadImages';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<{
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
  } | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    // Fetch the existing listing
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setCity(data.city);
        setAddress(data.address || '');
        setPrice(data.price);
        setPropertyType(data.propertyType);
        setRooms(data.rooms);
        setBathrooms(data.bathrooms);
        setGuests(data.guests);
        // Set previews to existing images
        setPreviews(data.images || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch listing:', err);
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
      const files = Array.from(e.target.files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      // Combine existing previews with new ones
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement listing update
    console.log('Updating listing:', {
      id,
      title,
      description,
      city,
      address,
      price,
      propertyType,
      rooms,
      bathrooms,
      guests,
      newImageCount: selectedFiles?.length || 0,
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
    alert('Annonce mise à jour avec succès !');
    router.push(`/host/listings`);
  };

  if (loading || !listing) {
    return <p>Chargement de l'annonce...</p>;
  }

  return (
    <div>
      <h1>Modifier l'annonce</h1>
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
          <label htmlFor="images">Images supplémentaires :</label>
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
            <strong>Images existantes :</strong>
            {previews.slice(0, listing.images?.length || 0).map((preview, index) => (
              <img key={index} src={preview} alt={`Existing ${index}`} style={{ maxWidth: '100px', margin: '5px' }} />
            ))}
            {selectedFiles && previews.length > (listing.images?.length || 0) && (
              <div>
                <strong>Nouvelles images :</strong>
                {previews.slice(listing.images?.length || 0).map((preview, index) => (
                  <img key={index + (listing.images?.length || 0)} src={preview} alt={`New ${index}`} style={{ maxWidth: '100px', margin: '5px' }} />
                ))}
              </div>
            )}
          </div>
        </div>
        <button type="submit">Mettre à jour l'annonce</button>
      </form>
      <div>
        <Link href={`/listings/${id}`}>Voir l'annonce</Link>
        <span> | </span>
        <Link href="/host/listings">Mes annonces</Link>
      </div>
    </div>
  );
}