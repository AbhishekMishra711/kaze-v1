import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * MobileLeafletMap
 * Optical satellite imagery map powered by Leaflet & Esri World Imagery.
 * Displays real-world Google Earth-style satellite photography bounded to Pune,
 * with moving 🚑 ambulance marker and 🆘 user SOS beacon.
 */
export function MobileLeafletMap({
  userLat = 18.6253,
  userLng = 73.8166,
  startLat = 18.6480,
  startLng = 73.7920,
  vehicleNumber = '108 Fleet Unit',
  etaMinutes = 5,
  distanceKm = 3.2,
}) {
  const safeUserLat = Number(userLat) || 18.6253;
  const safeUserLng = Number(userLng) || 73.8166;
  const safeStartLat = Number(startLat) || 18.6480;
  const safeStartLng = Number(startLng) || 73.7920;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #map {
      width: 100%;
      height: 100%;
    }
    @keyframes radarPulse {
      0% { transform: scale(0.9); opacity: 0.9; }
      70% { transform: scale(2.2); opacity: 0.1; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes patientGlow {
      0% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.6); opacity: 0.2; }
      100% { transform: scale(1); opacity: 0.8; }
    }
    .amb-radar-beacon {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.45);
      border: 1px solid rgba(56, 189, 248, 0.8);
      animation: radarPulse 1.4s ease-out infinite;
      top: -7px;
      left: -7px;
      pointer-events: none;
    }
    .amb-bubble {
      width: 38px;
      height: 38px;
      background: #ffffff;
      border: 3px solid #2563eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }
    .patient-beacon {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.4);
      animation: patientGlow 1.8s ease-in-out infinite;
      top: -5px;
      left: -5px;
      pointer-events: none;
    }
    .patient-bubble {
      width: 34px;
      height: 34px;
      background: #dc2626;
      border: 2.5px solid #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #fff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }
    .hud-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    .hud-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
  </style>
</head>
<body>
  <div class="hud-badge">
    <div class="hud-dot"></div>
    <span>ESRI OPTICAL SATELLITE RADAR</span>
  </div>
  <div id="map"></div>

  <script>
    var startLat = ${safeStartLat};
    var startLng = ${safeStartLng};
    var userLat = ${safeUserLat};
    var userLng = ${safeUserLng};

    // Strict Pune Metro boundary box (No whole world zoom out)
    var puneBounds = L.latLngBounds(
      L.latLng(18.35, 73.65),
      L.latLng(18.82, 74.15)
    );

    var map = L.map('map', {
      center: [(startLat + userLat)/2, (startLng + userLng)/2],
      zoom: 14,
      minZoom: 12,
      maxZoom: 18,
      maxBounds: puneBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: false
    });

    // 1. High-Resolution Photographic Optical Satellite Tiles (Esri World Imagery)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: 'Esri Satellite Optics'
    }).addTo(map);

    // 2. High-contrast roads & labels overlay
    L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      opacity: 0.85
    }).addTo(map);

    // 3. User SOS Marker (Red Beacon)
    var userIcon = L.divIcon({
      className: 'patient-marker',
      html: '<div style="position:relative;"><div class="patient-beacon"></div><div class="patient-bubble">🆘</div></div>',
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
      .bindPopup("<b>Your Emergency Location</b><br/>Lat: " + userLat.toFixed(4) + ", Lng: " + userLng.toFixed(4));

    // 4. Generate realistic road waypoints from ambulance origin to user
    var waypoints = [];
    var steps = 30;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var curve = Math.sin(t * Math.PI) * 0.0035;
      var pLat = startLat + (userLat - startLat) * t + curve;
      var pLng = startLng + (userLng - startLng) * t - curve * 0.6;
      waypoints.push([pLat, pLng]);
    }

    // 5. Draw glowing transit polyline
    L.polyline(waypoints, {
      color: '#38bdf8',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(map);

    // 6. Moving Ambulance Marker with 🚑 Emoji
    var ambIcon = L.divIcon({
      className: 'amb-marker',
      html: '<div style="position:relative;"><div class="amb-radar-beacon"></div><div class="amb-bubble">🚑</div></div>',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });
    var ambMarker = L.marker(waypoints[0], { icon: ambIcon }).addTo(map)
      .bindPopup("<b>Ambulance ${vehicleNumber}</b><br/>En Route (~${etaMinutes} mins)");

    // Fit map bounds comfortably to show both ambulance and user
    map.fitBounds([
      [startLat, startLng],
      [userLat, userLng]
    ], { padding: [50, 50] });

    // Continuous Swiggy-style ambulance movement loop
    var progress = 0.12;
    setInterval(function() {
      progress += 0.022;
      if (progress >= 0.98) {
        progress = 0.98;
      }
      var idx = Math.min(waypoints.length - 1, Math.floor(progress * (waypoints.length - 1)));
      var currentCoord = waypoints[idx];
      if (currentCoord) {
        ambMarker.setLatLng(currentCoord);
      }
    }, 1200);
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
  },
});
