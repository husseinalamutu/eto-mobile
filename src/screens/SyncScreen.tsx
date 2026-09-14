import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Report, Language } from '../types';
import { translations } from '../i18n/translations';
import { TOKENS, FONTS, METRICS } from '../theme/tokens';
import {
  getPendingReports,
  getPendingCount,
  markReportsSynced,
  getAllReports,
  exportSneakerNetPayload,
} from '../db';

interface SyncScreenProps {
  language: Language;
  onSyncComplete?: () => void;
}

const SYNC_API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

export const SyncScreen: React.FC<SyncScreenProps> = ({ language, onSyncComplete }) => {
  const t = translations[language];

  const [pendingCount, setPendingCount] = useState<number>(0);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [networkInfo, setNetworkInfo] = useState<NetInfoState | null>(null);
  const [activeView, setActiveView] = useState<'pending' | 'synced'>('pending');

  // Sneaker-Net Export Modal
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
  const [exportedJson, setExportedJson] = useState<string>('');

  const refreshLedger = useCallback(async () => {
    try {
      const count = await getPendingCount();
      const pending = await getPendingReports();
      const all = await getAllReports();
      setPendingCount(count);
      setPendingReports(pending);
      setAllReports(all);
    } catch (err) {
      console.error('Failed to load ledger records:', err);
    }
  }, []);

  const checkNetwork = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      setNetworkInfo(state);
      return state;
    } catch (err) {
      console.error('Failed to fetch network state:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshLedger();
    checkNetwork();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkInfo(state);
    });

    return () => unsubscribe();
  }, [refreshLedger, checkNetwork]);

  const handleSyncNow = async () => {
    if (isSyncing) return;

    // Check connectivity
    const currentNet = await checkNetwork();
    const isConnected = Boolean(
      currentNet?.isConnected &&
        (currentNet.isInternetReachable === null || currentNet.isInternetReachable)
    );

    if (!isConnected) {
      Alert.alert(
        t.offlineSignal,
        'No connectivity detected. Stored securely offline in local SQLite ledger.',
        [{ text: 'OK' }]
      );
      return;
    }

    const pending = await getPendingReports();
    if (pending.length === 0) {
      Alert.alert(
        t.allSynced,
        'There are no pending reports awaiting transmission.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSyncing(true);

      const payload = {
        dispatched_at: new Date().toISOString(),
        device_enclave: 'eto-offline-agent-v1',
        reports_count: pending.length,
        batch: pending.map((r) => ({
          id: r.id,
          category: r.category,
          location: r.location,
          description: r.description,
          severity: r.severity,
          created_at: r.created_at,
        })),
      };

      const response = await fetch(SYNC_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 201) {
        const syncedIds = pending.map((r) => r.id);
        await markReportsSynced(syncedIds);
        await refreshLedger();

        if (onSyncComplete) {
          onSyncComplete();
        }

        Alert.alert(
          'Sync Success',
          `Securely dispatched ${pending.length} incident report(s) to central early-warning monitor.`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(`Gateway returned status ${response.status}`);
      }
    } catch (err: any) {
      console.error('Sync failed:', err);
      Alert.alert(
        'Transmission Interrupted',
        `Could not reach sync gateway (${err?.message || 'Timeout'}). Stored securely offline for retry.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportSneakerNet = async () => {
    try {
      const payloadString = await exportSneakerNetPayload();
      setExportedJson(payloadString);
      setExportModalVisible(true);
    } catch (err) {
      console.error('Export failed:', err);
      Alert.alert('Export Error', 'Could not compile physical backup payload.');
    }
  };

  const isOnline = Boolean(
    networkInfo?.isConnected &&
      (networkInfo.isInternetReachable === null || networkInfo.isInternetReachable)
  );

  const displayedReports =
    activeView === 'pending'
      ? pendingReports
      : allReports.filter((r) => r.synced === 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={TOKENS.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenHeading}>{t.syncHeading}</Text>
          <Text style={styles.screenSubheading}>{t.syncSubheading}</Text>
        </View>

        {/* Network Status Pill */}
        <View style={[styles.networkBanner, isOnline ? styles.netOnline : styles.netOffline]}>
          <View style={styles.netInfoLeft}>
            <View
              style={[
                styles.statusPillDot,
                { backgroundColor: isOnline ? TOKENS.riskLow : TOKENS.riskCritical },
              ]}
            />
            <Text style={styles.netInfoTitle}>
              {isOnline ? t.onlineSignal : t.offlineSignal}
            </Text>
          </View>
          <Text style={styles.netInfoType}>
            {networkInfo?.type ? networkInfo.type.toUpperCase() : 'SEARCHING'}
          </Text>
        </View>

        {/* Counter & Action Card */}
        <View style={styles.summaryCard}>
          <View style={styles.counterRow}>
            <View>
              <Text style={styles.counterLabel}>{t.pendingQueue}</Text>
              <Text style={styles.counterNumber}>{pendingCount}</Text>
            </View>
            <View style={styles.counterMeta}>
              <Text style={styles.metaLabel}>{t.totalRecorded}: {allReports.length}</Text>
              <Text style={styles.metaLabel}>
                {t.syncedLabel}: {allReports.filter((r) => r.synced === 1).length}
              </Text>
            </View>
          </View>

          {/* Sync Now Button */}
          <TouchableOpacity
            style={[
              styles.syncNowButton,
              isSyncing && styles.syncNowButtonDisabled,
              pendingCount === 0 && styles.syncNowButtonEmpty,
            ]}
            onPress={handleSyncNow}
            disabled={isSyncing}
            activeOpacity={0.8}
          >
            {isSyncing ? (
              <View style={styles.syncingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.syncNowButtonText}>{t.transmittingText}</Text>
              </View>
            ) : (
              <Text style={styles.syncNowButtonText}>
                {pendingCount > 0
                  ? `⚡ ${t.syncNow} (${pendingCount})`
                  : t.allSynced}
              </Text>
            )}
          </TouchableOpacity>

          {/* Physical Sneaker-Net Export Button */}
          <TouchableOpacity
            style={styles.exportBackupButton}
            onPress={handleExportSneakerNet}
            activeOpacity={0.7}
          >
            <Text style={styles.exportBackupButtonText}>{t.exportBackup}</Text>
          </TouchableOpacity>
        </View>

        {/* Toggle List View */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeView === 'pending' && styles.toggleBtnActive]}
            onPress={() => setActiveView('pending')}
          >
            <Text
              style={[
                styles.toggleBtnText,
                activeView === 'pending' && styles.toggleBtnTextActive,
              ]}
            >
              {t.tabPending} ({pendingReports.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, activeView === 'synced' && styles.toggleBtnActive]}
            onPress={() => setActiveView('synced')}
          >
            <Text
              style={[
                styles.toggleBtnText,
                activeView === 'synced' && styles.toggleBtnTextActive,
              ]}
            >
              {t.tabDispatched} ({allReports.filter((r) => r.synced === 1).length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Queue List */}
        <FlatList
          data={displayedReports}
          keyExtractor={(item) => item.id}
          refreshing={isSyncing}
          onRefresh={refreshLedger}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.queueCard}>
              <View style={styles.queueCardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
                <View
                  style={[
                    styles.syncBadge,
                    item.synced === 1 ? styles.syncedBadge : styles.unsyncedBadge,
                  ]}
                >
                  <Text
                    style={
                      item.synced === 1 ? styles.syncedBadgeText : styles.unsyncedBadgeText
                    }
                  >
                    {item.synced === 1 ? '✓ Synced' : '⏳ Pending'}
                  </Text>
                </View>
              </View>

              <Text style={styles.queueLocation}>📍 {item.location}</Text>
              <Text style={styles.queueDesc} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.queueCardFooter}>
                <Text style={styles.queueIdText}>ID: {item.id.slice(0, 8)}...</Text>
                <Text style={styles.queueDateText}>
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>
                {activeView === 'pending' ? 'No pending reports' : 'No synced reports yet'}
              </Text>
              <Text style={styles.emptyDesc}>
                {activeView === 'pending'
                  ? 'Your local queue is clear. Reports filed will appear here until manually synced.'
                  : 'Dispatched reports will be archived here.'}
              </Text>
            </View>
          }
        />
      </View>

      {/* Sneaker-Net Export Modal */}
      <Modal visible={exportModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📦 Physical Courier Backup</Text>
            <Text style={styles.modalSubtitle}>{t.exportNotice}</Text>
            <ScrollView style={styles.exportScroll}>
              <Text style={styles.exportCodeText}>{exportedJson}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setExportModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.background },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  header: { marginBottom: 10 },
  screenHeading: { fontSize: 18, fontWeight: '700', color: TOKENS.foreground, fontFamily: FONTS.mono },
  screenSubheading: { fontSize: 11, color: TOKENS.mutedForeground, marginTop: 2, fontFamily: FONTS.mono },
  networkBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
  },
  netOnline: { backgroundColor: '#0B2313', borderColor: TOKENS.riskLow },
  netOffline: { backgroundColor: '#281113', borderColor: TOKENS.riskCritical },
  netInfoLeft: { flexDirection: 'row', alignItems: 'center' },
  statusPillDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  netInfoTitle: { fontSize: 12, fontWeight: '700', color: TOKENS.foreground, fontFamily: FONTS.mono },
  netInfoType: { fontSize: 11, fontWeight: '700', color: TOKENS.mutedForeground, fontFamily: FONTS.mono },
  summaryCard: {
    backgroundColor: TOKENS.card,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: TOKENS.border,
    marginBottom: 12,
  },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  counterLabel: { fontSize: 10, fontWeight: '700', color: TOKENS.mutedForeground, letterSpacing: 0.8, fontFamily: FONTS.mono },
  counterNumber: { fontSize: 32, fontWeight: '900', color: TOKENS.primary, marginTop: 2, fontFamily: FONTS.mono },
  counterMeta: { alignItems: 'flex-end', gap: 3 },
  metaLabel: { fontSize: 11, color: TOKENS.mutedForeground, fontWeight: '600', fontFamily: FONTS.mono },
  syncNowButton: {
    backgroundColor: TOKENS.primary,
    minHeight: METRICS.minTouchTarget,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncNowButtonDisabled: { opacity: 0.6 },
  syncNowButtonEmpty: { backgroundColor: TOKENS.secondary, borderWidth: 1, borderColor: TOKENS.border },
  syncNowButtonText: { fontSize: 13, fontWeight: '800', color: TOKENS.primaryForeground, fontFamily: FONTS.mono, letterSpacing: 0.5 },
  syncingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exportBackupButton: {
    marginTop: 10,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: TOKENS.border,
  },
  exportBackupButtonText: { fontSize: 11, fontWeight: '700', color: TOKENS.primary, fontFamily: FONTS.mono },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: TOKENS.card,
    borderRadius: 6,
    padding: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  toggleBtn: { flex: 1, minHeight: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  toggleBtnActive: { backgroundColor: TOKENS.primary },
  toggleBtnText: { fontSize: 11, fontWeight: '700', color: TOKENS.mutedForeground, fontFamily: FONTS.mono },
  toggleBtnTextActive: { color: TOKENS.primaryForeground, fontWeight: '800' },
  listContent: { paddingBottom: 32 },
  queueCard: {
    backgroundColor: TOKENS.card,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  queueCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  categoryBadge: { backgroundColor: TOKENS.secondary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 3, borderWidth: 1, borderColor: TOKENS.border },
  categoryBadgeText: { fontSize: 10, fontWeight: '700', color: TOKENS.mutedForeground, fontFamily: FONTS.mono },
  syncBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3 },
  syncedBadge: { backgroundColor: '#0B2313', borderWidth: 1, borderColor: TOKENS.riskLow },
  syncedBadgeText: { color: TOKENS.riskLow, fontSize: 10, fontWeight: '800', fontFamily: FONTS.mono },
  unsyncedBadge: { backgroundColor: '#281E0B', borderWidth: 1, borderColor: TOKENS.primary },
  unsyncedBadgeText: { color: TOKENS.primary, fontSize: 10, fontWeight: '800', fontFamily: FONTS.mono },
  queueLocation: { fontSize: 12, fontWeight: '700', color: TOKENS.foreground, marginBottom: 3, fontFamily: FONTS.mono },
  queueDesc: { fontSize: 12, color: TOKENS.mutedForeground, lineHeight: 16, marginBottom: 6 },
  queueCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: TOKENS.border,
    paddingTop: 5,
  },
  queueIdText: { fontSize: 9, fontFamily: FONTS.mono, color: TOKENS.mutedForeground },
  queueDateText: { fontSize: 9, color: TOKENS.mutedForeground, fontFamily: FONTS.mono },
  emptyBox: { paddingVertical: 28, alignItems: 'center' },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: TOKENS.foreground, fontFamily: FONTS.mono },
  emptyDesc: { fontSize: 11, color: TOKENS.mutedForeground, textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: TOKENS.card,
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: TOKENS.primary,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: TOKENS.foreground, marginBottom: 4, fontFamily: FONTS.mono },
  modalSubtitle: { fontSize: 11, color: TOKENS.mutedForeground, marginBottom: 10, lineHeight: 15 },
  exportScroll: {
    backgroundColor: TOKENS.background,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    maxHeight: 280,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  exportCodeText: {
    color: TOKENS.primary,
    fontFamily: FONTS.mono,
    fontSize: 10,
  },
  modalCloseBtn: {
    backgroundColor: TOKENS.primary,
    minHeight: METRICS.minTouchTarget,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: { color: TOKENS.primaryForeground, fontWeight: '800', fontSize: 13, fontFamily: FONTS.mono },
});
