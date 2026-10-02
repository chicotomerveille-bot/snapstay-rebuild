import { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
}

export const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmit(rating, comment);
      setRating(0);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="rating">Note :</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Votre avis..."
        />
      </div>
      <button type="submit">Soumettre</button>
    </form>
  );
};