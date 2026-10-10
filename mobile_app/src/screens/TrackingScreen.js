import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { pollIncident } from '../api/api';
import { MobileLeafletMap } from '../components/MobileLeafletMap';


// Ambulance status stages in order
const STAGES = [
  { key: 'submitted',   label: 'Request submitted',     detail: 'Your SOS has been sent to the emergency grid.' },
  { key: 'ems',         label: 'EMS acknowledged',       detail: 'Emergency Medical Services have received and accepted the alert.' },
  { key: 'hospital',    label: 'Hospital confirmed',     detail: 'Nearest available hospital has confirmed an ER bed.' },
  { key: 'dispatched',  label: 'Ambulance dispatched',   detail: 'An ambulance is on its way to your location.' },
];

function StatusStep({ stage, index, currentIndex }) {
  const done = index < currentIndex;
  const active = index === currentIndex;
  const pending = index > currentIndex;

  return (
    <View style={styles.step}>
      {/* Left: indicator + connector */}
      <View style={styles.stepLeft}>
        <View style={[
          styles.stepDot,
          done && styles.stepDotDone,
          active && styles.stepDotActive,
          pending && styles.stepDotPending,
        ]}>
          {done && <Text style={styles.checkMark}>✓</Text>}
          {active && <View style={styles.innerDot} />}
        </View>
        {index < STAGES.length - 1 && (
          <View style={[styles.connector, done && styles.connectorDone]} />
        )}
      </View>

      {/* Right: text */}
      <View style={styles.stepContent}>
        <Text style={[
          styles.stepLabel,
          active && styles.stepLabelActive,
          pending && styles.stepLabelPending,
        ]}>
          {stage.label}
        </Text>
        {(done || active) && (
          <Text style={styles.stepDetail}>{stage.detail}</Text>
        )}
      </View>
    </View>
  );
}

// Accurate Haversine Distance Calculation (in km)
function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function TrackingScreen({
  incident,
  location,
  onClose,
  onUpdateIncident,
  onCancel,
}) {
  const [stageIndex, setStageIndex] = useState(1);

  // Poll backend for updates if live
  useEffect(() => {
    if (!incident?.id) return;
    const interval = setInterval(async () => {
      try {
        const res = await pollIncident(incident.id);
        if (res.success && res.incident) {
          onUpdateIncident?.(res.incident);
          const st = res.incident.status?.toUpperCase();
          if (st === 'ALLOCATING') {
            setStageIndex(prev => Math.max(prev, 1));
          } else if (st === 'ASSIGNED' || st === 'ALLOCATED') {
            setStageIndex(prev => Math.max(prev, 2));
          } else if (st === 'DISPATCHED' || st === 'EN_ROUTE') {
            setStageIndex(3);
          }
        }
      } catch (_) {}
    }, 5000);

    return () => clearInterval(interval);
  }, [incident?.id]);

  // Progressive simulation for smooth emergency feedback
  useEffect(() => {
    if (!incident) return;
    const timers = [
      setTimeout(() => setStageIndex(prev => Math.max(prev, 2)), 6000),
      setTimeout(() => setStageIndex(3), 14000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [incident]);

  const dispatched = stageIndex >= 3;

  // User and initial ambulance coordinates
  const userLat = Number(location?.latitude ?? incident?.latitude ?? 18.6253);
  const userLng = Number(location?.longitude ?? incident?.longitude ?? 73.8166);
  const startAmbLat = Number(incident?.ambulanceLat ?? (userLat + 0.024));
  const startAmbLng = Number(incident?.ambulanceLng ?? (userLng - 0.026));

  const totalDistanceKm = calculateHaversineKm(startAmbLat, startAmbLng, userLat, userLng);

  // Swiggy / Blinkit dynamic movement simulation
  const [simProgress, setSimProgress] = useState(0.12);
  const [simEtaMinutes, setSimEtaMinutes] = useState(Math.max(1, Math.round((totalDistanceKm / 36) * 60)));
  const [simDistanceKm, setSimDistanceKm] = useState(totalDistanceKm);

  // Moving coordinates calculated along path
  const currentAmbLat = startAmbLat + (userLat - startAmbLat) * simProgress + Math.sin(simProgress * Math.PI) * 0.0035;
  const currentAmbLng = startAmbLng + (userLng - startAmbLng) * simProgress - Math.sin(simProgress * Math.PI) * 0.002;

  // Continuous movement simulation loop with accurate real-time telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setSimProgress((prev) => {
        const next = prev + 0.022;
        if (next >= 0.98) return 0.98;
        const curAmbLat = startAmbLat + (userLat - startAmbLat) * next;
        const curAmbLng = startAmbLng + (userLng - startAmbLng) * next;
        const remainingKm = Math.max(0.1, calculateHaversineKm(curAmbLat, curAmbLng, userLat, userLng));
        setSimDistanceKm(remainingKm);
        setSimEtaMinutes(Math.max(1, Math.round((remainingKm / 38) * 60)));
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [startAmbLat, startAmbLng, userLat, userLng]);



  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Emergency Request?',
      'Are you sure you want to cancel this emergency request? Dispatched services will be notified.',
      [
        { text: 'Keep Tracking', style: 'cancel' },
        {
          text: 'Cancel SOS',
          style: 'destructive',
          onPress: onCancel,
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />

      {/* Top Header Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.navStatusPill}>
          <View style={styles.pulseDot} />
          <Text style={styles.navStatusText}>
            {incident?.status || 'ALLOCATING'}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Request Metadata */}
        <View style={styles.header}>
          <Text style={styles.title}>Tracking SOS Request</Text>
          {incident?.id && (
            <View style={styles.idBadge}>
              <Text style={styles.idLabel}>ID:</Text>
              <Text style={styles.idValue}>{incident.id}</Text>
            </View>
          )}

          {incident?.triageLevel && (
            <View style={styles.triageRow}>
              <View style={styles.triageTag}>
                <Text style={styles.triageText}>{incident.triageLevel}</Text>
              </View>
              {incident.addressText && (
                <Text style={styles.addressText}>{incident.addressText}</Text>
              )}
            </View>
          )}

          {incident?.description ? (
            <Text style={styles.descriptionText}>"{incident.description}"</Text>
          ) : null}
        </View>

        {/* Requirements Identified by Backend */}
        {Array.isArray(incident?.requirements) && incident.requirements.length > 0 && (
          <View style={styles.requirementsCard}>
            <Text style={styles.sectionTitle}>Required Medical Resources</Text>
            {incident.requirements.map((req, idx) => (
              <View key={idx} style={styles.reqItem}>
                <View style={styles.reqHeader}>
                  <Text style={styles.reqBadge}>
                    {req.quantity}x {req.category?.replace(/_/g, ' ')}
                  </Text>
                </View>
                {req.justification ? (
                  <Text style={styles.reqJustification}>{req.justification}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Status Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Dispatch Timeline</Text>
          <View style={styles.timeline}>
            {STAGES.map((stage, i) => (
              <StatusStep
                key={stage.key}
                stage={stage}
                index={i}
                currentIndex={stageIndex}
              />
            ))}
          </View>
        </View>

        {/* Hospital & Ambulance Allocation Info */}
        {stageIndex >= 2 && incident?.assignedHospital && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Assigned Facility</Text>
            <Text style={styles.infoValue}>{incident.assignedHospital}</Text>

            {incident.ambulanceNumber && (
              <>
                {incident.driverName && (
                  <View style={{ marginTop: 6 }}>
                    <Text style={[styles.infoSub, { fontWeight: '600', color: theme.colors.textPrimary }]}>
                      Driver: {incident.driverName}
                    </Text>
                  </View>
                )}
                {incident.driverPhone && (
                  <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[styles.infoSub, { color: theme.colors.greenDark, fontWeight: '700' }]}>
                      📞 {incident.driverPhone}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Real-World Satellite Map with Moving Ambulance (Swiggy / Blinkit style) */}
        {Boolean(incident) && (
          <View style={styles.mapCard}>
            <View style={styles.mapHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Live Ambulance Radar</Text>
                <Text style={styles.mapNote}>
                  Optical Satellite View (Google Earth / Esri Optics) • Pune Metro Bounds
                </Text>
              </View>
              <View style={styles.radarPill}>
                <View style={styles.radarPillDot} />
                <Text style={styles.radarPillText}>RADAR LIVE</Text>
              </View>
            </View>

            <MobileLeafletMap
              userLat={userLat}
              userLng={userLng}
              startLat={startAmbLat}
              startLng={startAmbLng}
              vehicleNumber={incident?.ambulanceNumber || '108 Fleet Unit'}
              etaMinutes={simEtaMinutes}
              distanceKm={simDistanceKm}
            />

            {/* Swiggy / Blinkit Style Live Transit Card */}
            <View style={styles.swiggyStatusCard}>
              <View style={styles.swiggyTopRow}>
                <View style={styles.swiggyAmbIconBox}>
                  <Text style={{ fontSize: 22 }}>🚑</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.swiggyAmbTitle}>
                    {incident?.ambulanceNumber || '108 Fleet Unit'}
                  </Text>
                  <Text style={styles.swiggyAmbSub}>
                    {simProgress >= 0.95 ? 'Arriving at your location' : 'En route to your location'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.swiggyEtaVal}>
                    {simProgress >= 0.95 ? 'Arrived' : `~${simEtaMinutes} min`}
                  </Text>
                  <Text style={styles.swiggyDistVal}>{simDistanceKm} km left</Text>
                </View>
              </View>

              {/* Transit Progress Bar */}
              <View style={styles.swiggyProgressTrack}>
                <View
                  style={[
                    styles.swiggyProgressBar,
                    { width: `${Math.round(simProgress * 100)}%` },
                  ]}
                />
              </View>
              <View style={styles.swiggyProgressLabels}>
                <Text style={styles.swiggyStepText}>Base</Text>
                <Text style={styles.swiggyStepTextMid}>Speed: 42 km/h</Text>
                <Text style={styles.swiggyStepText}>You</Text>
              </View>

              {incident?.driverPhone && (
                <View style={styles.driverCallRow}>
                  <Text style={styles.driverNameText}>
                    Driver: {incident.driverName || 'Paramedic Staff'}
                  </Text>
                  <TouchableOpacity
                    style={styles.callDriverBtn}
                    onPress={() => Alert.alert('Contacting Driver', `Calling ${incident.driverPhone}...`)}
                  >
                    <Text style={styles.callDriverText}>📞 Call {incident.driverPhone}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.homeBtnText}>Back to Home Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCancelPress}
            activeOpacity={0.85}
          >
            <Text style={styles.cancelBtnText}>Cancel Emergency Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 10,
  },
  backArrow: {
    fontSize: 24,
    lineHeight: 26,
    color: theme.colors.textPrimary,
    fontWeight: '300',
    marginRight: 4,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  navStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#C5DEB0',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.greenDark,
  },
  navStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.greenDark,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 6,
  },
  idLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  idValue: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    fontFamily: 'monospace',
  },
  triageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  triageTag: {
    backgroundColor: '#FDEDEC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F5B7B1',
  },
  triageText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.red,
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 2,
  },

  // Requirements Card
  requirementsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reqItem: {
    marginBottom: 10,
  },
  reqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  reqBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.greenDark,
    backgroundColor: '#EEF5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  reqJustification: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },

  // Timeline
  timelineCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  timeline: {
    gap: 0,
  },
  step: {
    flexDirection: 'row',
    gap: 14,
    minHeight: 52,
  },
  stepLeft: {
    alignItems: 'center',
    width: 22,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepDotDone: {
    backgroundColor: theme.colors.greenDark,
    borderColor: theme.colors.greenDark,
  },
  stepDotActive: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.red,
  },
  stepDotPending: {
    backgroundColor: theme.colors.bg,
    borderColor: theme.colors.border,
  },
  checkMark: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.red,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 2,
  },
  connectorDone: {
    backgroundColor: theme.colors.greenDark,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  stepLabelActive: {
    color: theme.colors.red,
    fontWeight: '700',
  },
  stepLabelPending: {
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
  stepDetail: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },

  // Info Card
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  infoSub: {
    fontSize: 12,
    color: theme.colors.greenDark,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },

  // Map Card
  mapCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  radarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  radarPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  radarPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  mapNote: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: -8,
    marginBottom: 10,
  },
  mapContainer: {
    height: 250,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  mapFallback: {
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapFallbackText: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  ambMarkerPin: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  ambPulseRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.45)',
  },
  ambEmojiText: {
    fontSize: 28,
  },
  userMarkerPin: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dc2626',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userEmojiText: {
    fontSize: 18,
  },

  // Swiggy Style Delivery Card
  swiggyStatusCard: {
    marginTop: 12,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
  },
  swiggyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swiggyAmbIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  swiggyAmbTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  swiggyAmbSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  swiggyEtaVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4ade80',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  swiggyDistVal: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  swiggyProgressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  swiggyProgressBar: {
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 3,
  },
  swiggyProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  swiggyStepText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  swiggyStepTextMid: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: '700',
  },
  driverCallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  driverNameText: {
    fontSize: 11,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  callDriverBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  callDriverText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
  },

  // Bottom Actions
  bottomActions: {
    gap: 10,
    marginTop: 8,
  },
  homeBtn: {
    backgroundColor: theme.colors.greenDark,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeBtnText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelBtnText: {
    color: theme.colors.red,
    fontSize: 13,
    fontWeight: '600',
  },
});
