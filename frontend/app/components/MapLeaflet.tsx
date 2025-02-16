// app/components/MapLeaflet.tsx
'use client';

import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import React from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps {
  position: LatLngExpression;
  radius: number;
  onPositionChange: (pos: LatLngExpression) => void;
}

export default function MapLeaflet({ position, radius, onPositionChange }: MapProps) {
  // Hilfskomponente, um auf Map-Klick zu reagieren
  function LocationMarker() {
    useMapEvents({
      click(e) {
        onPositionChange(e.latlng);
      },
    });
    return (
      <>
        <Marker position={position} />
        <Circle center={position} radius={radius} />
      </>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ width: '100%', height: '300px', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
}
