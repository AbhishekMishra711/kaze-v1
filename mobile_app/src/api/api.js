import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Known host IPs for local Wi-Fi and Mobile Hotspot
const KNOWN_CANDIDATES = [
  'http://10.10.0.229:4000',
  'http://192.168.137.1:4000',
  'http://localhost:4000',
];

export const BACKEND_STORAGE_KEY = '@kaze_backend_url';

// Auto-detect host IP from Expo bundler scriptURL if running on native device
function detectInitialHost() {
  if (Platform.OS === 'web') {
    return 'http://localhost:4000';
  }
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/https?:\/\/([^/:]+)/);
      if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
        return `http://${match[1]}:4000`;
      }
    }
  } catch (_) {}
  // Default to primary WiFi IP
  return 'http://10.10.0.229:4000';
}

export const API_BASE_URL = detectInitialHost();
let currentBaseUrl = API_BASE_URL;

// Load persisted URL on startup
AsyncStorage.getItem(BACKEND_STORAGE_KEY)
  .then((saved) => {
    if (saved && saved.trim()) {
      currentBaseUrl = saved.trim().replace(/\/+$/, '');
    }
  })
  .catch(() => {});

export const setApiBaseUrl = async (url) => {
  if (url) {
    currentBaseUrl = url.trim().replace(/\/+$/, '');
    try {
      await AsyncStorage.setItem(BACKEND_STORAGE_KEY, currentBaseUrl);
    } catch (_) {}
  }
};

export const getApiBaseUrl = () => currentBaseUrl;
export const getCandidateUrls = () => [currentBaseUrl, ...KNOWN_CANDIDATES.filter(u => u !== currentBaseUrl)];

/**
 * POST /api/v1/incidents/sos
 */
export async function submitSOS({ description, latitude, longitude }) {
  const body = {
    description: description || '',
    latitude: typeof latitude === 'number' ? latitude : 18.6253,
    longitude: typeof longitude === 'number' ? longitude : 73.8166,
  };

  const candidateUrls = getCandidateUrls();
  let lastError = null;

  for (const baseUrl of candidateUrls) {
    const url = `${baseUrl}/api/v1/incidents/sos`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.incident) {
          // If this candidate succeeded and differed from current, update active
          if (baseUrl !== currentBaseUrl) {
            setApiBaseUrl(baseUrl);
          }
          return {
            success: true,
            live: true,
            incident: parseIncident(json.incident),
          };
        }
      }
    } catch (err) {
      lastError = err;
      console.log(`[SOS API] Attempt to ${baseUrl} failed:`, err.message);
    }
  }

  // If all live candidates failed, inform and fallback gracefully
  console.warn('[SOS API] All live endpoints failed. Error:', lastError?.message);
  const demo = demoIncident(description, latitude, longitude);
  return {
    success: true,
    live: false,
    incident: parseIncident(demo),
  };
}

/**
 * GET /api/v1/incidents/:id
 * Fetches latest status of an incident for live tracking.
 */
export async function pollIncident(id) {
  if (!id) return { success: false };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${getApiBaseUrl()}/api/v1/incidents/${id}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const raw = json.incident ?? json.data ?? json;
      return { success: true, incident: parseIncident(raw) };
    }
  } catch (_) {
    // If backend isn't running or network dropped
  }
  return { success: false };
}

// ─── Response Parser ─────────────────────────────────────────────────────────

export function parseIncident(raw) {
  if (!raw) return null;

  return {
    id: raw.id ?? raw._id ?? 'c3cf8206-ea5c-48b9-bc51-715f15659d1c',
    callerId: raw.caller_id ?? raw.callerId ?? null,
    idempotencyKey: raw.idempotency_key ?? raw.idempotencyKey ?? null,
    latitude: typeof raw.latitude === 'number' ? raw.latitude : (Number(raw.latitude) || 18.6253),
    longitude: typeof raw.longitude === 'number' ? raw.longitude : (Number(raw.longitude) || 73.8166),
    addressText: raw.address_text ?? raw.addressText ?? 'Pune Metro Area',
    description: raw.description_raw ?? raw.description ?? '',
    audioUrl: raw.audio_url ?? null,
    triageLevel: raw.triage_level ?? raw.triageLevel ?? 'EMERGENT',
    status: raw.status ?? 'ALLOCATING',
    unservedReason: raw.unserved_reason ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updated_at ?? raw.updatedAt ?? new Date().toISOString(),
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],

    // Assigned resources (when backend or mock assigns hospital/ambulance)
    assignedHospital: raw.activeReservation?.hospital_name ?? raw.assignedHospital ?? raw.hospitalName ?? null,
    ambulanceNumber: raw.activeReservation?.vehicle_number ?? raw.ambulanceNumber ?? raw.vehicleNumber ?? null,
    driverName: raw.activeReservation?.driver_name ?? raw.driverName ?? null,
    driverPhone: raw.activeReservation?.driver_phone ?? raw.driverPhone ?? null,
    ambulanceEtaMinutes: raw.ambulanceEtaMinutes ?? raw.eta ?? 6,
    ambulanceLat: typeof raw.ambulanceLat === 'number' ? raw.ambulanceLat : (raw.activeReservation?.ambulance_lat != null ? Number(raw.activeReservation.ambulance_lat) : null),
    ambulanceLng: typeof raw.ambulanceLng === 'number' ? raw.ambulanceLng : (raw.activeReservation?.ambulance_lng != null ? Number(raw.activeReservation.ambulance_lng) : null),

    raw,
  };
}

// ─── Offline Demo Incident (Matches exact backend schema) ───────────────────

function demoIncident(description, lat, lng) {
  return {
    id: 'c3cf8206-ea5c-48b9-bc51-715f15659d1c',
    caller_id: null,
    idempotency_key: `sos-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    latitude: typeof lat === 'number' ? lat : 18.6253,
    longitude: typeof lng === 'number' ? lng : 73.8166,
    address_text: 'Pune Metro Area',
    description_raw: description || 'sudden pain in chest and heavy sweating near Akurdi station',
    audio_url: null,
    triage_level: 'EMERGENT',
    status: 'ALLOCATING',
    unserved_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    requirements: [
      {
        category: 'OXYGEN_BED',
        quantity: 1,
        justification: 'Acute chest pain with diaphoresis, possible ACS',
      },
      {
        category: 'ICU_BED',
        quantity: 1,
        justification: 'Cardiac monitoring and intervention capability needed',
      },
    ],
  };
}
