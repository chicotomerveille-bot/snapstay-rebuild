import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  price: number; // in cents
  image: string;
  rating: number;
}

interface SimilarListingsProps {
  listings: Listing[];
}

export const SimilarListings = ({ listings }: SimilarListingsProps) => {
  if (listings.length === 0) {
    return <p>Aucune annonce similaire trouvée.</p>;
  }

  return (
    <div>
      <h2>Annonces similaires</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '16px' }}>
        {listings.map((listing) => (
          <Link key={listing.id} href={`/listings/${listing.id}`} passHref>
            <div style={{ width: '200px', border: '1px solid #ddd', padding: '8px' }}>
              <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
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
        ))}
      </div>
    </div>
  );
};