import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { FONTS, METRICS, HIT_SLOP_64, ThemeTokens } from './src/theme/tokens';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { LanguageSelectorScreen } from './src/screens/LanguageSelectorScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { OpportunityScreen } from './src/screens/OpportunityScreen';
import { SyncScreen } from './src/screens/SyncScreen';
import { DecoyScreen } from './src/screens/DecoyScreen';
import { DesignSpecScreen } from './src/screens/DesignSpecScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

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
    setScreen('onboarding');
  };

  const handleOpenSpec = () => {
    setPreviousScreen(screen === 'spec' ? 'secure' : screen);
    setScreen(screen === 'spec' ? previousScreen : 'spec');
  };

  const handleOpenGuide = () => {
    setPreviousScreen(screen === 'onboarding' ? 'secure' : screen);
    setScreen(screen === 'onboarding' ? (previousScreen || 'secure') : 'onboarding');
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
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>INITIALIZING ENCRYPTED LEDGER...</Text>
      </SafeAreaView>
    );
  }

  // 1. SPECIFICATION SCREEN
  if (screen === 'spec') {
    return <DesignSpecScreen onBack={() => setScreen(previousScreen || 'secure')} />;
  }

  // 1.5. ONBOARDING & FIELD MANUAL SCREEN
  if (screen === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={() => setScreen('secure')}
        language={language}
        onToggleLanguage={toggleLanguage}
      />
    );
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
        onOpenGuide={handleOpenGuide}
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
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Screen Body */}
      <View style={styles.body}>
        {activeTab === 'ledger' && (
          <ReportScreen
            language={language}
            onPanicTap={handlePanicTap}
            onOpenSpec={handleOpenSpec}
            onOpenGuide={handleOpenGuide}
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
                  onPress={handleOpenGuide}
                  style={styles.guideMiniBtn}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.guideMiniBtnText}>📖 GUIDE</Text>
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
                  onPress={handleOpenGuide}
                  style={styles.guideMiniBtn}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.guideMiniBtnText}>📖 GUIDE</Text>
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

const createStyles = (theme: ThemeTokens, isDark: boolean) =>
  StyleSheet.create({
    flexOne: {
      flex: 1,
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme.mutedForeground,
      fontSize: 11,
      fontWeight: '700',
      fontFamily: FONTS.mono,
      marginTop: 14,
      letterSpacing: 1,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
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
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.border,
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
      color: theme.mutedForeground,
      letterSpacing: 1,
    },
    panicTriggerBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 6,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
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
      color: theme.foreground,
    },
    secureBadge: {
      backgroundColor: isDark ? '#0B2313' : '#E8F5E9',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: theme.riskLow,
    },
    secureBadgeText: {
      fontFamily: FONTS.mono,
      fontSize: 9,
      fontWeight: '800',
      color: theme.riskLow,
      letterSpacing: 0.5,
    },
    statusActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    langPill: {
      backgroundColor: theme.secondary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: theme.border,
    },
    langPillText: {
      fontSize: 10,
      fontFamily: FONTS.mono,
      fontWeight: '800',
      color: theme.primary,
    },
    guideMiniBtn: {
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 2,
    },
    guideMiniBtnText: {
      fontFamily: FONTS.mono,
      fontSize: 9,
      fontWeight: '700',
      color: theme.primary,
    },
    specMiniBtn: {
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 2,
    },
    specMiniBtnText: {
      fontFamily: FONTS.mono,
      fontSize: 9,
      fontWeight: '700',
      color: theme.mutedForeground,
    },
    lockMiniBtn: {
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 2,
    },
    lockMiniBtnText: {
      fontSize: 11,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.border,
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
      borderTopColor: theme.primary,
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
      color: theme.mutedForeground,
      fontWeight: '700',
    },
    tabIconActive: {
      color: theme.primary,
    },
    tabBadge: {
      position: 'absolute',
      top: -4,
      right: -10,
      backgroundColor: theme.riskCritical,
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
      color: theme.mutedForeground,
      fontWeight: '700',
      fontFamily: FONTS.mono,
      letterSpacing: 0.5,
      marginTop: 2,
    },
    tabLabelActive: {
      color: theme.primary,
      fontWeight: '800',
    },
  });
