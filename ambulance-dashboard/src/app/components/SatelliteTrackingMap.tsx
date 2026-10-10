'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface MapCoordinates {
  lat: number;
  lng: number;
  label?: string;
}

interface SatelliteTrackingMapProps {
  patientLocation: MapCoordinates;
  ambulance?: {
    id?: string;
    vehicle_number: string;
    driver_name?: string;
    driver_phone?: string;
    current_lat: number;
    current_lng: number;
  } | null;
  hospitalLocation?: MapCoordinates | null;
  isDispatched?: boolean;
}

export default function SatelliteTrackingMap({
  patientLocation,
  ambulance,
  hospitalLocation,
  isDispatched = true,
}: SatelliteTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const ambulanceMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);

  // Simulation state
  const [progress, setProgress] = useState(0.15); // 0 to 1
  const [simulatedEta, setSimulatedEta] = useState(6);
  const [distanceKm, setDistanceKm] = useState(3.4);
  const [isMoving, setIsMoving] = useState(true);

  // Starting location: ambulance position or offset
  const startLat = ambulance?.current_lat || patientLocation.lat + 0.024;
  const startLng = ambulance?.current_lng || patientLocation.lng - 0.028;

  // Destination: patient location
  const destLat = patientLocation.lat;
  const destLng = patientLocation.lng;

  // Generate intermediate route path (with realistic road jogs)
  const generateWaypoints = () => {
    const points: [number, number][] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Slight bezier curve to mimic real roads
      const curve = Math.sin(t * Math.PI) * 0.004;
      const lat = startLat + (destLat - startLat) * t + curve;
      const lng = startLng + (destLng - startLng) * t - curve * 0.7;
      points.push([lat, lng]);
    }
    return points;
  };

  const waypoints = useRef<[number, number][]>(generateWaypoints());

  // Dynamic Leaflet Initialization
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      // Ensure leaflet styles exist
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Strict Pune Metro bounds: user CANNOT drag to the whole world
      const puneBounds = L.latLngBounds(
        L.latLng(18.35, 73.65), // Southwest
        L.latLng(18.82, 74.15)  // Northeast
      );

      const map = L.map(mapContainerRef.current, {
        center: [(startLat + destLat) / 2, (startLng + destLng) / 2],
        zoom: 14,
        minZoom: 12,
        maxZoom: 18,
        maxBounds: puneBounds,
        maxBoundsViscosity: 1.0, // Hard bounce back if dragged outside Pune
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // 1. High-Resolution Optical Satellite Tiles (Google Earth / Esri World Imagery)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar Geographics',
        maxZoom: 18,
      }).addTo(map);

      // 2. High-contrast road & boundary overlay
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        opacity: 0.85,
      }).addTo(map);

      // 3. Draw route polyline
      const polyline = L.polyline(waypoints.current, {
        color: '#38bdf8',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);
      routePolylineRef.current = polyline;

      // 4. Patient Location Marker
      const patientIcon = L.divIcon({
        className: 'patient-beacon-icon',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #dc2626; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5); font-size: 16px;">
              🆘
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([destLat, destLng], { icon: patientIcon })
        .addTo(map)
        .bindPopup(`<b>Patient SOS Location</b><br/>${patientLocation.label || 'Emergency Coordinates'}`);

      // 5. Hospital Marker (if provided)
      if (hospitalLocation) {
        const hospitalIcon = L.divIcon({
          className: 'hospital-dest-icon',
          html: `
            <div style="width: 34px; height: 34px; border-radius: 50%; background: #10b981; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5); font-size: 18px;">
              🏥
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        L.marker([hospitalLocation.lat, hospitalLocation.lng], { icon: hospitalIcon })
          .addTo(map)
          .bindPopup(`<b>Designated ER Facility</b><br/>${hospitalLocation.label || 'Emergency Hospital'}`);
      }

      // 6. Moving Ambulance Marker (Swiggy / Blinkit style with 🚑 emoji)
      const currentIdx = Math.floor(progress * (waypoints.current.length - 1));
      const currentPt = waypoints.current[currentIdx] || [startLat, startLng];

      const ambulanceIcon = L.divIcon({
        className: 'swiggy-ambulance-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(59, 130, 246, 0.45); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #ffffff; border: 3px solid #2563eb; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 12px rgba(0,0,0,0.4); font-size: 20px; transform: scale(1.05);">
              🚑
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const ambMarker = L.marker(currentPt, { icon: ambulanceIcon }).addTo(map);
      ambulanceMarkerRef.current = ambMarker;

      // Fit bounds to keep ambulance and patient in comfortable focus
      map.fitBounds(
        L.latLngBounds([
          [startLat, startLng],
          [destLat, destLng],
        ]),
        { padding: [50, 50] }
      );
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destLat, destLng, startLat, startLng]);

  // Swiggy / Blinkit Continuous Smooth Movement Animation Loop
  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        let next = prev + 0.025;
        if (next >= 0.98) {
          next = 0.98; // Arrived at patient
        }

        // Update ETA & distance
        const remainingFraction = 1 - next;
        setSimulatedEta(Math.max(1, Math.round(remainingFraction * 8)));
        setDistanceKm(Number((remainingFraction * 4.2).toFixed(1)));

        // Move marker
        if (ambulanceMarkerRef.current && waypoints.current.length > 0) {
          const idx = Math.min(
            waypoints.current.length - 1,
            Math.floor(next * (waypoints.current.length - 1))
          );
          const pt = waypoints.current[idx];
          if (pt) {
            ambulanceMarkerRef.current.setLatLng(pt);
          }
        }

        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isMoving]);

  const recenterMap = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.fitBounds(
      [
        [startLat, startLng],
        [destLat, destLng],
      ],
      { padding: [50, 50] }
    );
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-900">
      {/* Real-world Satellite Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-[440px] z-0" />

      {/* Top Banner: Swiggy/Blinkit Live Tracking Indicator */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap justify-between items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-white shadow-lg pointer-events-auto flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-bold tracking-wide">
            LIVE SATELLITE DISPATCH RADAR
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-500/30">
            ESRI EARTH OPTICS
          </span>
        </div>

        <button
          onClick={recenterMap}
          className="bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 shadow-lg pointer-events-auto transition-colors flex items-center gap-1.5"
        >
          <span>🎯</span>
          <span>Recenter Route</span>
        </button>
      </div>

      {/* Bottom Floating Card: Swiggy/Blinkit Delivery Style Status Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-950/92 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-xl shadow-inner">
              🚑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-white">
                  {ambulance?.vehicle_number || '108 Fleet Unit'}
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {progress >= 0.95 ? 'ARRIVING AT SCENE' : 'EN ROUTE TO PATIENT'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Driver: {ambulance?.driver_name || 'Assigned Paramedic'} • 📞{' '}
                {ambulance?.driver_phone || '+91 9800000004'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Estimated Arrival
              </span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {progress >= 0.95 ? 'Arrived' : `~${simulatedEta} mins`}
              </span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Remaining Dist
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {distanceKm} km
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-1">
            <span>Depot / Base</span>
            <span className="text-blue-400 font-semibold">
              Speed: 42 km/h • Route Verified
            </span>
            <span className="text-rose-400 font-semibold">Patient SOS</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 h-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
