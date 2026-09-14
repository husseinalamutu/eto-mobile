import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { AppScreen, MainTab, Language } from './src/types';
import { translations } from './src/i18n/translations';
import { initDatabase, getPendingCount } from './src/db';
import { TOKENS, FONTS, METRICS, HIT_SLOP_64 } from './src/theme/tokens';
import { LanguageSelectorScreen } from './src/screens/LanguageSelectorScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { OpportunityScreen } from './src/screens/OpportunityScreen';
import { SyncScreen } from './src/screens/SyncScreen';
import { DecoyScreen } from './src/screens/DecoyScreen';
import { DesignSpecScreen } from './src/screens/DesignSpecScreen';
import { LoginScreen } from './src/screens/LoginScreen';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('language');
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('secure');
  const [activeTab, setActiveTab] = useState<MainTab>('ledger');
  const [language, setLanguage] = useState<Language>('en');
  const [isDbReady, setIsDbReady] = useState<boolean>(false);
  const [pendingBadgeCount, setPendingBadgeCount] = useState<number>(0);

  const t = translations[language];

  // Stealth Panic Trigger (3 rapid taps within 800ms)
  const panicTapCount = useRef(0);
  const panicTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePanicTap = useCallback(() => {
    panicTapCount.current += 1;
    if (panicTimer.current) clearTimeout(panicTimer.current);

    if (panicTapCount.current >= 3) {
      panicTapCount.current = 0;
      setScreen('decoy');
      return;
    }
    panicTimer.current = setTimeout(() => {
      panicTapCount.current = 0;
    }, 800);
  }, []);

  // Language Cycler (Supports English, Hausa, Yoruba, Igbo, and French)
  const toggleLanguage = () => {
    setLanguage((prev) => {
      if (prev === 'en') return 'ha';
      if (prev === 'ha') return 'yo';
      if (prev === 'yo') return 'ig';
      if (prev === 'ig') return 'fr';
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

  // Forensic Checkpoint Security & Hardware Hardening
  useEffect(() => {
    // 1. Enforce Android FLAG_SECURE: Prevents OS from taking screenshots or saving window snapshots in Android Recents
    ScreenCapture.preventScreenCaptureAsync().catch((err) => {
      console.warn('Screen capture prevention error:', err);
    });

    // 2. AppState Auto-Lock: If app is backgrounded or screen locks, silently swap to Decoy
    const appStateSub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        setScreen((curr) => (curr === 'secure' ? 'decoy' : curr));
      }
    });

    return () => {
      appStateSub.remove();
    };
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

  const handleLanguageSelect = (selected: Language) => {
    setLanguage(selected);
    setScreen('secure');
  };

  const handleOpenSpec = () => {
    setPreviousScreen(screen === 'spec' ? 'secure' : screen);
    setScreen(screen === 'spec' ? previousScreen : 'spec');
  };

  const handleDecoyRestore = () => {
    setScreen('secure');
  };

  const handleUnlock = () => {
    refreshPendingCount();
    setScreen('secure');
  };

  const handleTriggerDuress = () => {
    setScreen('decoy');
  };

  const handleLock = () => {
    setScreen('locked');
  };

  if (!isDbReady) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={TOKENS.background} />
        <ActivityIndicator size="large" color={TOKENS.primary} />
        <Text style={styles.loadingText}>INITIALIZING ENCRYPTED LEDGER...</Text>
      </SafeAreaView>
    );
  }

  // 1. SPECIFICATION SCREEN
  if (screen === 'spec') {
    return <DesignSpecScreen onBack={() => setScreen(previousScreen || 'secure')} />;
  }

  // 2. DECOY SCREEN (Borno Grain & Weather Bulletin)
  if (screen === 'decoy') {
    return (
      <DecoyScreen
        onRestore={handleDecoyRestore}
        onLock={handleLock}
      />
    );
  }

  // 3. TACTICAL LOCK SCREEN (PIN Pad)
  if (screen === 'locked') {
    return (
      <LoginScreen
        onUnlock={handleUnlock}
        onTriggerDuress={handleTriggerDuress}
        language={language}
        onToggleLanguage={toggleLanguage}
      />
    );
  }

  // 4. LANGUAGE SELECTOR SCREEN (Initial Boot / Change Language)
  if (screen === 'language') {
    return (
      <View style={styles.flexOne}>
        {/* Floating discrete SPEC toggle */}
        <View style={styles.specFloatWrapper}>
          <TouchableOpacity
            style={styles.specFloatBtn}
            onPress={handleOpenSpec}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP_64}
          >
            <Text style={styles.specFloatText}>SPEC</Text>
          </TouchableOpacity>
        </View>

        <LanguageSelectorScreen
          currentLanguage={language}
          onSelect={handleLanguageSelect}
          onOpenSpec={handleOpenSpec}
        />
      </View>
    );
  }

  // 5. SECURE CIVIC APPLICATION (Ledger, Opportunities, Sync, Navigation)
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={TOKENS.background} />

      {/* Screen Body */}
      <View style={styles.body}>
        {activeTab === 'ledger' && (
          <ReportScreen
            language={language}
            onPanicTap={handlePanicTap}
            onOpenSpec={handleOpenSpec}
            onLock={handleLock}
            onReportSubmitted={() => {
              refreshPendingCount();
            }}
          />
        )}

        {activeTab === 'opportunities' && (
          <View style={styles.tabContentWrapper}>
            {/* Header with Panic Tap Trigger */}
            <TouchableOpacity
              onPress={handlePanicTap}
              activeOpacity={0.9}
              style={styles.panicTriggerBar}
            >
              <View style={styles.clockRow}>
                <Text style={styles.clockText}>09:41</Text>
                <View style={styles.secureBadge}>
                  <Text style={styles.secureBadgeText}>SECURE</Text>
                </View>
              </View>

              <View style={styles.statusActionRow}>
                <TouchableOpacity
                  style={styles.langPill}
                  onPress={toggleLanguage}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.langPillText}>
                    {language.toUpperCase()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleOpenSpec}
                  style={styles.specMiniBtn}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.specMiniBtnText}>SPEC</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLock}
                  style={styles.lockMiniBtn}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.lockMiniBtnText}>🔒</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <OpportunityScreen language={language} />
          </View>
        )}

        {activeTab === 'sync' && (
          <View style={styles.tabContentWrapper}>
            {/* Header with Panic Tap Trigger */}
            <TouchableOpacity
              onPress={handlePanicTap}
              activeOpacity={0.9}
              style={styles.panicTriggerBar}
            >
              <View style={styles.clockRow}>
                <Text style={styles.clockText}>09:41</Text>
                <View style={styles.secureBadge}>
                  <Text style={styles.secureBadgeText}>SECURE</Text>
                </View>
              </View>

              <View style={styles.statusActionRow}>
                <TouchableOpacity
                  style={styles.langPill}
                  onPress={toggleLanguage}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.langPillText}>
                    {language.toUpperCase()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleOpenSpec}
                  style={styles.specMiniBtn}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.specMiniBtnText}>SPEC</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLock}
                  style={styles.lockMiniBtn}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.lockMiniBtnText}>🔒</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <SyncScreen
              language={language}
              onSyncComplete={refreshPendingCount}
            />
          </View>
        )}
      </View>

      {/* High-Contrast Tactical Field Terminal Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ledger' && styles.tabButtonActive]}
          onPress={() => setActiveTab('ledger')}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_64}
        >
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'ledger' && styles.tabIconActive,
            ]}
          >
            ▤
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'ledger' && styles.tabLabelActive,
            ]}
            numberOfLines={1}
          >
            {t.tabReport.toUpperCase()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'opportunities' && styles.tabButtonActive]}
          onPress={() => setActiveTab('opportunities')}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_64}
        >
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'opportunities' && styles.tabIconActive,
            ]}
          >
            ◎
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'opportunities' && styles.tabLabelActive,
            ]}
            numberOfLines={1}
          >
            {t.tabOpportunities.toUpperCase()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'sync' && styles.tabButtonActive]}
          onPress={() => {
            refreshPendingCount();
            setActiveTab('sync');
          }}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_64}
        >
          <View style={styles.tabIconWrapper}>
            <Text
              style={[
                styles.tabIcon,
                activeTab === 'sync' && styles.tabIconActive,
              ]}
            >
              ⬆
            </Text>
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
            numberOfLines={1}
          >
            {t.tabSync.toUpperCase()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={handleLock}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_64}
        >
          <Text style={styles.tabIcon}>🔒</Text>
          <Text style={styles.tabLabel} numberOfLines={1}>
            {t.quickLock.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
    backgroundColor: TOKENS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: TOKENS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: TOKENS.mutedForeground,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONTS.mono,
    marginTop: 14,
    letterSpacing: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: TOKENS.background,
  },
  body: {
    flex: 1,
  },
  tabContentWrapper: {
    flex: 1,
  },
  specFloatWrapper: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 99,
  },
  specFloatBtn: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 1,
    borderColor: TOKENS.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
    minHeight: 28,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specFloatText: {
    fontSize: 9,
    fontFamily: FONTS.mono,
    fontWeight: '700',
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
  },
  panicTriggerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: TOKENS.card,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
    minHeight: 40,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clockText: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: '700',
    color: TOKENS.foreground,
  },
  secureBadge: {
    backgroundColor: '#0B2313',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: TOKENS.riskLow,
  },
  secureBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '800',
    color: TOKENS.riskLow,
    letterSpacing: 0.5,
  },
  statusActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    backgroundColor: TOKENS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  langPillText: {
    fontSize: 10,
    fontFamily: FONTS.mono,
    fontWeight: '800',
    color: TOKENS.primary,
  },
  specMiniBtn: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 1,
    borderColor: TOKENS.border,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 2,
  },
  specMiniBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: TOKENS.mutedForeground,
  },
  lockMiniBtn: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 1,
    borderColor: TOKENS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  lockMiniBtnText: {
    fontSize: 11,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: TOKENS.card,
    borderTopWidth: 1,
    borderTopColor: TOKENS.border,
    minHeight: 52,
    paddingBottom: 4,
    paddingTop: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: METRICS.minTouchTarget,
    paddingHorizontal: 2,
  },
  tabButtonActive: {
    borderTopWidth: 2,
    borderTopColor: TOKENS.primary,
    marginTop: -4,
    paddingTop: 2,
  },
  tabIconWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 16,
    fontFamily: FONTS.mono,
    color: TOKENS.mutedForeground,
    fontWeight: '700',
  },
  tabIconActive: {
    color: TOKENS.primary,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: TOKENS.riskCritical,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 14,
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    fontFamily: FONTS.mono,
  },
  tabLabel: {
    fontSize: 9,
    color: TOKENS.mutedForeground,
    fontWeight: '700',
    fontFamily: FONTS.mono,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  tabLabelActive: {
    color: TOKENS.primary,
    fontWeight: '800',
  },
});
