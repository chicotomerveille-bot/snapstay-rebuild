'use client';

import { useState } from 'react';

interface PriceCalendarProps {
  pricePerNight: number; // in cents
  onDatesSelected: (checkIn: string, checkOut: string, totalPrice: number) => void;
}

export const PriceCalendar = ({ pricePerNight, onDatesSelected }: PriceCalendarProps) => {
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckIn(e.target.value);
    calculateTotalPrice();
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckOut(e.target.value);
    calculateTotalPrice();
  };

  const calculateTotalPrice = () => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      if (daysDiff > 0) {
        const total = (daysDiff * pricePerNight) / 100; // convert to euros
        setTotalPrice(total);
        onDatesSelected(checkIn, checkOut, total);
      } else {
        setTotalPrice(0);
        onDatesSelected('', '', 0);
      }
    } else {
      setTotalPrice(0);
      onDatesSelected('', '', 0);
    }
  };

  return (
    <div>
      <h2>Calendrier des prix</h2>
      <div>
        <label htmlFor="checkIn">Date d'arrivée :</label>
        <input
          id="checkIn"
          type="date"
          value={checkIn}
          onChange={handleCheckInChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <label htmlFor="checkOut">Date de départ :</label>
        <input
          id="checkOut"
          type="date"
          value={checkOut}
          onChange={handleCheckOutChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      {totalPrice > 0 && (
        <p>
          Prix total pour {new Date(checkOut).getTime() - new Date(checkIn).getTime() > 0 ? 
            Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)) : 0} nuits : 
          <strong>{totalPrice.toFixed(2)}€</strong>
        </p>
      )}
    </div>
  );
};