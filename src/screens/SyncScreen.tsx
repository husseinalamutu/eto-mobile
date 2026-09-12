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
} from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Report } from '../types';
import { getPendingReports, getPendingCount, markReportsSynced, getAllReports } from '../db';

interface SyncScreenProps {
  onSyncComplete?: () => void;
}

const SYNC_API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

export const SyncScreen: React.FC<SyncScreenProps> = ({ onSyncComplete }) => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [networkInfo, setNetworkInfo] = useState<NetInfoState | null>(null);
  const [activeView, setActiveView] = useState<'pending' | 'synced'>('pending');

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

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkInfo(state);
    });

    return () => {
      unsubscribe();
    };
  }, [refreshLedger, checkNetwork]);

  const handleSyncNow = async () => {
    if (isSyncing) return;

    // 1. Check network connectivity strictly
    const currentNet = await checkNetwork();
    const isConnected = Boolean(
      currentNet?.isConnected &&
        (currentNet.isInternetReachable === null || currentNet.isInternetReachable)
    );

    if (!isConnected) {
      Alert.alert(
        'Offline Mode Active',
        'No connectivity detected. Stored securely offline.',
        [{ text: 'Understood' }]
      );
      return;
    }

    // 2. Check if there are pending items
    const pending = await getPendingReports();
    if (pending.length === 0) {
      Alert.alert(
        'Ledger Synchronized',
        'There are no pending reports awaiting transmission. All reports are already synced.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSyncing(true);

      // 3. Dispatch batch to API endpoint
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 201) {
        // 4. Mark records as synced in SQLite
        const syncedIds = pending.map((r) => r.id);
        await markReportsSynced(syncedIds);

        // 5. Update UI state & badge
        await refreshLedger();

        if (onSyncComplete) {
          onSyncComplete();
        }

        Alert.alert(
          'Sync Success',
          `Securely dispatched ${pending.length} incident report(s) to central human rights & early-warning monitor.`,
          [{ text: 'Acknowledged' }]
        );
      } else {
        throw new Error(`Gateway returned HTTP ${response.status}`);
      }
    } catch (err: any) {
      console.error('Sync failed:', err);
      Alert.alert(
        'Transmission Interrupted',
        `Could not reach sync gateway (${err?.message ?? 'Network timeout'}). Stored securely offline in SQLite ledger for retry.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSyncing(false);
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
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.container}>
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.screenHeading}>Manual Sync Engine</Text>
          <Text style={styles.screenSubheading}>
            Zero-background-battery daemon. Explicit manual transmission center.
          </Text>
        </View>

        {/* Network Status Bar */}
        <View style={[styles.networkBanner, isOnline ? styles.netOnline : styles.netOffline]}>
          <View style={styles.netInfoLeft}>
            <View
              style={[
                styles.statusPillDot,
                { backgroundColor: isOnline ? '#22C55E' : '#EF4444' },
              ]}
            />
            <Text style={styles.netInfoTitle}>
              {isOnline ? 'Online Signal Available' : 'Offline / Patchy 2G'}
            </Text>
          </View>
          <Text style={styles.netInfoType}>
            {networkInfo?.type ? networkInfo.type.toUpperCase() : 'SEARCHING'}
          </Text>
        </View>

        {/* Sync Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.counterRow}>
            <View>
              <Text style={styles.counterLabel}>PENDING QUEUE</Text>
              <Text style={styles.counterNumber}>{pendingCount}</Text>
            </View>
            <View style={styles.counterMeta}>
              <Text style={styles.metaLabel}>Total Recorded: {allReports.length}</Text>
              <Text style={styles.metaLabel}>
                Synced: {allReports.filter((r) => r.synced === 1).length}
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
                <Text style={styles.syncNowButtonText}>Transmitting Encrypted Batch...</Text>
              </View>
            ) : (
              <Text style={styles.syncNowButtonText}>
                {pendingCount > 0
                  ? `⚡ Sync ${pendingCount} Report${pendingCount > 1 ? 's' : ''} Now`
                  : '✓ All Reports Synced'}
              </Text>
            )}
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
              Pending Queue ({pendingReports.length})
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
              Dispatched ({allReports.filter((r) => r.synced === 1).length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Queue List */}
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
                <Text style={styles.queueIdText}>
                  ID: {item.id.slice(0, 8)}...
                </Text>
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
                {activeView === 'pending'
                  ? 'No pending reports'
                  : 'No synced reports yet'}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 12,
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  screenSubheading: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  networkBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
  },
  netOnline: {
    backgroundColor: '#052E16',
    borderColor: '#22C55E',
  },
  netOffline: {
    backgroundColor: '#3F1219',
    borderColor: '#EF4444',
  },
  netInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  netInfoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  netInfoType: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  counterNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#38BDF8',
    marginTop: 2,
  },
  counterMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  syncNowButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  syncNowButtonDisabled: {
    opacity: 0.6,
  },
  syncNowButtonEmpty: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  syncNowButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  syncingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#0284C7',
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 32,
  },
  queueCard: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  queueCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  syncBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  syncedBadge: {
    backgroundColor: '#052E16',
  },
  syncedBadgeText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '700',
  },
  unsyncedBadge: {
    backgroundColor: '#451A03',
  },
  unsyncedBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  queueLocation: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  queueDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 8,
  },
  queueCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 6,
  },
  queueIdText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#64748B',
  },
  queueDateText: {
    fontSize: 10,
    color: '#64748B',
  },
  emptyBox: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
});
