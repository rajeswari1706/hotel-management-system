import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { Navigation, MapPin } from 'lucide-react';

/**
 * Calculates distance between two coordinates in kilometers using the Haversine formula
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

const MapView = ({ latitude, longitude, hotelTitle }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [userCoords, setUserCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [locating, setLocating] = useState(false);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const isValidCoords = !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

  useEffect(() => {
    if (!mapContainerRef.current || !isValidCoords) return;

    // Fix default Leaflet icon paths in React Vite
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Initialize map if not yet initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 13);
    }

    // Set or update marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${hotelTitle || 'Hotel Location'}</b><br/>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
        .openPopup();
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        userMarkerRef.current = null;
      }
    };
  }, [lat, lng, hotelTitle, isValidCoords]);

  // Use HTML5 Geolocation API to locate user and measure distance to hotel
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation API is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserCoords({ lat: uLat, lng: uLng });

        const distKm = calculateDistanceKm(uLat, uLng, lat, lng);
        setDistance(distKm);
        setLocating(false);

        // Add user marker and adjust bounds
        if (mapInstanceRef.current) {
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([uLat, uLng]);
          } else {
            const userIcon = L.divIcon({
              className: 'user-geo-marker',
              html: `<div style="background-color: #00b74a; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7],
            });
            userMarkerRef.current = L.marker([uLat, uLng], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup('<b>Your Current Location</b>')
              .openPopup();
          }

          // Fit bounds to show both user and hotel
          const bounds = L.latLngBounds([
            [uLat, uLng],
            [lat, lng],
          ]);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      },
      (err) => {
        setLocating(false);
        setGeoError(`Unable to obtain location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  if (!isValidCoords) {
    return (
      <div style={{ padding: '20px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', color: '#777' }}>
        Coordinates unavailable or invalid ({latitude}, {longitude})
      </div>
    );
  }

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '260px', borderRadius: '6px', zIndex: 1 }}
      />

      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Navigation size={14} color="#1266f1" />
          <span>{locating ? 'Calculating distance...' : 'Measure Distance from My Location (Geolocation API)'}</span>
        </button>

        {distance !== null && (
          <div className="geo-location-panel">
            <div>✓ Successfully calculated with Geolocation API:</div>
            <div className="distance-calc">
              Distance to Hotel: {distance} km ({ (distance * 0.621371).toFixed(1) } miles)
            </div>
          </div>
        )}

        {geoError && (
          <div style={{ fontSize: '12px', color: '#f93154' }}>
            {geoError}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
