import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { AppSecurityMode, MainTab } from './src/types';
import { initDatabase, getPendingCount } from './src/db';
import { LoginScreen } from './src/screens/LoginScreen';
import { DecoyScreen } from './src/screens/DecoyScreen';
import { OpportunityScreen } from './src/screens/OpportunityScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { SyncScreen } from './src/screens/SyncScreen';

export default function App() {
  const [securityMode, setSecurityMode] = useState<AppSecurityMode>('LOCKED');
  const [activeTab, setActiveTab] = useState<MainTab>('opportunities');
  const [isDbReady, setIsDbReady] = useState<boolean>(false);
  const [pendingBadgeCount, setPendingBadgeCount] = useState<number>(0);

  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getPendingCount();
      setPendingBadgeCount(count);
    } catch (err) {
      console.error('Failed to load pending badge count:', err);
    }
  }, []);

  // Initialize SQLite database on boot
  useEffect(() => {
    async function setupStorage() {
      try {
        await initDatabase();
        await refreshPendingCount();
        setIsDbReady(true);
      } catch (err) {
        console.error('Database initialization error:', err);
        setIsDbReady(true); // Allow UI to proceed even if offline sandbox
      }
    }
    setupStorage();
  }, [refreshPendingCount]);

  // Handler: Real PIN (1234) authenticated
  const handleUnlock = () => {
    refreshPendingCount();
    setSecurityMode('AUTHENTICATED');
  };

  // Handler: Duress PIN (9999) triggered at checkpoint
  const handleTriggerDuress = () => {
    // Instantly route to harmless decoy screen
    setSecurityMode('DECOY');
  };

  // Handler: Lock back to PIN screen
  const handleLock = () => {
    setActiveTab('opportunities');
    setSecurityMode('LOCKED');
  };

  if (!isDbReady) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Initializing Encrypted Ledger...</Text>
      </SafeAreaView>
    );
  }

  // 1. Decoy Screen (Disguised Grain & Weather bulletin)
  if (securityMode === 'DECOY') {
    return <DecoyScreen onLock={handleLock} />;
  }

  // 2. Lock Screen (Tactile PIN Pad)
  if (securityMode === 'LOCKED') {
    return (
      <LoginScreen
        onUnlock={handleUnlock}
        onTriggerDuress={handleTriggerDuress}
      />
    );
  }

  // 3. Authenticated Eto Civic Application
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Main Top App Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>ETO • CIVIC LEDGER</Text>
          <Text style={styles.appSubtitle}>Information You Can Trust • OSF Africa</Text>
        </View>

        {/* Tactical Emergency Lock Button */}
        <TouchableOpacity
          style={styles.quickLockButton}
          onPress={handleLock}
          activeOpacity={0.8}
        >
          <Text style={styles.quickLockText}>🔒 LOCK</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Body */}
      <View style={styles.body}>
        {activeTab === 'opportunities' && <OpportunityScreen />}
        {activeTab === 'report' && (
          <ReportScreen
            onReportSubmitted={() => {
              refreshPendingCount();
              setActiveTab('sync');
            }}
          />
        )}
        {activeTab === 'sync' && (
          <SyncScreen onSyncComplete={refreshPendingCount} />
        )}
      </View>

      {/* Custom Bottom Tab Bar (Zero heavy navigation library overhead) */}
      <View style={styles.tabBar}>
        {/* Tab: Opportunities */}
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'opportunities' && styles.tabButtonActive]}
          onPress={() => setActiveTab('opportunities')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>📋</Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'opportunities' && styles.tabLabelActive,
            ]}
          >
            Opportunities
          </Text>
        </TouchableOpacity>

        {/* Tab: Intake Form */}
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'report' && styles.tabButtonActive]}
          onPress={() => setActiveTab('report')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>✍️</Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'report' && styles.tabLabelActive,
            ]}
          >
            File Incident
          </Text>
        </TouchableOpacity>

        {/* Tab: Manual Sync */}
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'sync' && styles.tabButtonActive]}
          onPress={() => {
            refreshPendingCount();
            setActiveTab('sync');
          }}
          activeOpacity={0.7}
        >
          <View style={styles.tabIconWrapper}>
            <Text style={styles.tabIcon}>⚡</Text>
            {pendingBadgeCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{pendingBadgeCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'sync' && styles.tabLabelActive,
            ]}
          >
            Sync Engine
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  quickLockButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  quickLockText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F87171',
  },
  body: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 8,
    paddingBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabButtonActive: {
    backgroundColor: 'transparent',
  },
  tabIconWrapper: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
});
