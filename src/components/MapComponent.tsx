'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

export const MapComponent = ({ center, zoom = 13, markers = [] }: MapComponentProps) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          {marker.popup && <Popup>{marker.popup}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};