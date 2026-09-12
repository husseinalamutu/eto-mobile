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
import { AppSecurityMode, MainTab, Language } from './src/types';
import { translations } from './src/i18n/translations';
import { initDatabase, getPendingCount } from './src/db';
import { LoginScreen } from './src/screens/LoginScreen';
import { DecoyScreen } from './src/screens/DecoyScreen';
import { OpportunityScreen } from './src/screens/OpportunityScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { SyncScreen } from './src/screens/SyncScreen';

export default function App() {
  const [securityMode, setSecurityMode] = useState<AppSecurityMode>('LOCKED');
  const [activeTab, setActiveTab] = useState<MainTab>('opportunities');
  const [language, setLanguage] = useState<Language>('en');
  const [isDbReady, setIsDbReady] = useState<boolean>(false);
  const [pendingBadgeCount, setPendingBadgeCount] = useState<number>(0);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage((prev) => {
      if (prev === 'en') return 'ha';
      if (prev === 'ha') return 'yo';
      if (prev === 'yo') return 'ig';
      return 'en';
    });
  };

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
        setIsDbReady(true);
      }
    }
    setupStorage();
  }, [refreshPendingCount]);

  // Real Access PIN (1234)
  const handleUnlock = () => {
    refreshPendingCount();
    setSecurityMode('AUTHENTICATED');
  };

  // Checkpoint Duress PIN (9999) or Panic Wipe (0000)
  const handleTriggerDuress = () => {
    setSecurityMode('DECOY');
  };

  // Instant Tactical Lock
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

  // 1. Decoy Screen (AgriWeather & Grain Market Bulletin)
  if (securityMode === 'DECOY') {
    return <DecoyScreen onLock={handleLock} />;
  }

  // 2. Locked Mode (PIN Screen)
  if (securityMode === 'LOCKED') {
    return (
      <LoginScreen
        onUnlock={handleUnlock}
        onTriggerDuress={handleTriggerDuress}
        language={language}
        onToggleLanguage={toggleLanguage}
      />
    );
  }

  // 3. Authenticated Main Eto Civic Application
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Main Header */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.appTitle}>{t.appName}</Text>
          <Text style={styles.appSubtitle}>{t.appSubtitle}</Text>
        </View>

        {/* Language Switcher Pill */}
        <TouchableOpacity
          style={styles.langPill}
          onPress={toggleLanguage}
          activeOpacity={0.7}
        >
          <Text style={styles.langPillText}>
            {language === 'en'
              ? '🇬🇧 EN'
              : language === 'ha'
              ? '🇳🇬 HA'
              : language === 'yo'
              ? '🇳🇬 YO'
              : '🇳🇬 IG'}
          </Text>
        </TouchableOpacity>

        {/* Tactical Emergency Lock */}
        <TouchableOpacity
          style={styles.quickLockButton}
          onPress={handleLock}
          activeOpacity={0.8}
        >
          <Text style={styles.quickLockText}>{t.quickLock}</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Body */}
      <View style={styles.body}>
        {activeTab === 'opportunities' && (
          <OpportunityScreen language={language} />
        )}
        {activeTab === 'report' && (
          <ReportScreen
            language={language}
            onReportSubmitted={() => {
              refreshPendingCount();
              setActiveTab('sync');
            }}
          />
        )}
        {activeTab === 'sync' && (
          <SyncScreen
            language={language}
            onSyncComplete={refreshPendingCount}
          />
        )}
      </View>

      {/* Low-Overhead Native Tab Bar */}
      <View style={styles.tabBar}>
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
            {t.tabOpportunities}
          </Text>
        </TouchableOpacity>

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
            {t.tabReport}
          </Text>
        </TouchableOpacity>

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
            {t.tabSync}
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
  loadingText: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginTop: 12 },
  mainContainer: { flex: 1, backgroundColor: '#0F172A' },
  topBar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 8,
  },
  appTitle: { fontSize: 15, fontWeight: '900', color: '#38BDF8', letterSpacing: 0.5 },
  appSubtitle: { fontSize: 10, color: '#94A3B8', marginTop: 1, fontWeight: '600' },
  langPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  langPillText: { fontSize: 11, fontWeight: '800', color: '#38BDF8' },
  quickLockButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  quickLockText: { fontSize: 11, fontWeight: '800', color: '#F87171' },
  body: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 6,
    paddingBottom: 8,
  },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  tabButtonActive: { backgroundColor: 'transparent' },
  tabIconWrapper: { position: 'relative' },
  tabIcon: { fontSize: 19 },
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
  tabBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  tabLabel: { fontSize: 10, color: '#64748B', fontWeight: '600', marginTop: 2 },
  tabLabelActive: { color: '#38BDF8', fontWeight: '800' },
});
