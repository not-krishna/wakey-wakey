import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

/**
 * Custom Koa Ear Destination Marker Icon
 */
const koaDestinationIcon = L.divIcon({
  className: 'koa-custom-pin',
  html: `
    <div style="
      position: relative;
      width: 40px;
      height: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));
    ">
      <div style="
        width: 38px;
        height: 38px;
        background-color: #2E7D32;
        border: 3px solid #FFFFFF;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 14px;
          height: 14px;
          background-color: #FFFFFF;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    </div>
  `,
  iconSize: [40, 48],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48]
});

/**
 * Custom User Location Green Dot Icon with Pulsing Ring
 */
const userLocationIcon = L.divIcon({
  className: 'user-live-dot',
  html: `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 36px; height: 36px; background-color: rgba(46, 125, 50, 0.35); border-radius: 50%; animation: pulseRing 2s infinite;"></div>
      <div style="width: 16px; height: 16px; background-color: #2E7D32; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Helper component to center map on bounds or position changes
function MapRecenter({ center, zoom, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, bounds, map]);
  return null;
}

// Helper component to handle click events on the map
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export default function MapView({
  destination,
  currentLocation,
  onMapClick,
  zoom = 14,
  interactive = true,
  className = ''
}) {
  // Default to central location if none provided (e.g. 51.505, -0.09)
  const defaultCenter = [
    destination?.lat || currentLocation?.lat || 51.505,
    destination?.lng || currentLocation?.lng || -0.09
  ];

  let bounds = null;
  if (destination?.lat && currentLocation?.lat) {
    bounds = L.latLngBounds(
      [currentLocation.lat, currentLocation.lng],
      [destination.lat, destination.lng]
    );
  }

  return (
    <div className={`map-view-wrapper ${className}`} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        zoomControl={false}
        attributionControl={true}
        style={{ width: '100%', height: '100%' }}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        scrollWheelZoom={interactive}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapRecenter center={destination ? [destination.lat, destination.lng] : currentLocation ? [currentLocation.lat, currentLocation.lng] : null} bounds={bounds} />
        {interactive && <MapClickHandler onMapClick={onMapClick} />}

        {/* User Current Location Dot */}
        {currentLocation?.lat && currentLocation?.lng && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={userLocationIcon} />
        )}

        {/* Destination Koa Ear Pin */}
        {destination?.lat && destination?.lng && (
          <Marker position={[destination.lat, destination.lng]} icon={koaDestinationIcon} />
        )}

        {/* Dashed Route Line */}
        {destination?.lat && currentLocation?.lat && (
          <Polyline
            positions={[
              [currentLocation.lat, currentLocation.lng],
              [destination.lat, destination.lng]
            ]}
            pathOptions={{
              color: '#66BB6A',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.85
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
