'use client';

import { useState } from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

interface ReviewSystemProps {
  listingId: string;
  reviews: Review[];
  averageRating: number;
}

export const ReviewSystem = ({ listingId, reviews, averageRating }: ReviewSystemProps) => {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement review submission
    console.log('Submitting review:', { listingId, rating: newRating, comment: newComment });
    setNewRating(0);
    setNewComment('');
  };

  return (
    <div>
      <h2>Avis</h2>
      <div>
        <Note moyenneNote={averageRating} />
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Note :</label>
          <select
            id="rating"
            value={newRating}
            onChange={(e) => setNewRating(parseInt(e.target.value))}
          >
            <option value="0">Sélectionnez une note</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div>
          <label htmlFor="comment">Commentaire :</label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Votre avis..."
          />
        </div>
        <button type="submit">Soumettre</button>
      </form>
      <div>
        <h3>Commentaires</h3>
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <p>
              <strong>{review.rating}/5</strong> - {new Date(review.createdAt).toLocaleDateString()}
            </p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Note = ({ moyenneNote }: { moyenneNote: number }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((note) => (
        <span key={note}>
          {note <= moyenneNote ? '★' : '☆'}
        </span>
      ))}
      <span> ({moyenneNote}/5)</span>
    </div>
  );
};