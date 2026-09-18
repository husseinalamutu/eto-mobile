import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { ThemeTokens, FONTS, METRICS, HIT_SLOP_64 } from '../theme/tokens';
import { useTheme } from '../theme/ThemeContext';

interface OnboardingScreenProps {
  onComplete: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

interface SlideData {
  badge: string;
  icon: string;
  title: string;
  subtitle: string;
  cards: {
    heading: string;
    text: string;
    highlight?: boolean;
    danger?: boolean;
  }[];
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  language,
  onToggleLanguage,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const t = translations[language];

  const slides: SlideData[] = useMemo(() => [
    {
      badge: 'NATIONWIDE CIVIC LEDGER',
      icon: '🛡️',
      title: 'Welcome to ÈTÒ',
      subtitle: 'Early-Warning & Conflict Prevention Across Nigeria',
      cards: [
        {
          heading: 'What is a "Ledger"?',
          text: 'A ledger is an encrypted, tamper-evident record book stored directly in your phone’s memory. It does NOT require internet or cellular connection to operate.',
          highlight: true,
        },
        {
          heading: 'Why ÈTÒ?',
          text: 'Built for community leaders, monitors, and citizens across Nigeria to document escalating tensions, farmer-herder flashpoints, extortion, and security threats before violence erupts.',
        },
        {
          heading: '100% Offline & Zero-PII',
          text: 'No phone numbers, IMEI, or GPS tracks are ever saved. Reports receive a cryptographic hash for total frontline safety.',
        },
      ],
    },
    {
      badge: 'FIELD REPORTING GUIDE',
      icon: '📋',
      title: 'Where to Log Security Complaints',
      subtitle: 'Document Threats & Extortion in Real-Time',
      cards: [
        {
          heading: 'The "+ LOG INCIDENT" Button',
          text: 'Located right at the top of the National Incident Ledger tab. Tap it anytime to open the incident documentation modal.',
          highlight: true,
        },
        {
          heading: 'Nigeria-Wide Scope',
          text: 'Select your state, LGA, and Ward across all geopolitical zones: North Central, North East, North West, South East, South South, and South West.',
        },
        {
          heading: 'Categorized Intelligence',
          text: 'Log armed confrontation indicators, checkpoint extortion, infrastructure breakdown (water boreholes/bridges), or diverted relief supplies.',
        },
      ],
    },
    {
      badge: 'CHECKPOINT CAMOUFLAGE',
      icon: '🌾',
      title: 'Why You See "Maize & Grain Prices"',
      subtitle: 'The Life-Saving Stealth Decoy Screen Explained',
      cards: [
        {
          heading: 'Hostile Roadblock Defense',
          text: 'If stopped by armed actors or corrupt officials demanding your phone, ÈTÒ instantly camouflages itself as a routine Borno Agricultural Grain Bulletin.',
          danger: true,
        },
        {
          heading: 'How It Triggers',
          text: '• Tap status bar clock 3× rapidly\n• Enter Duress PIN 9999 at lock screen\n• Enter Panic Wipe PIN 0000 (wipes database & opens decoy)',
        },
        {
          heading: 'Covert Exit (No Obvious Traps)',
          text: 'To avoid blowing cover at checkpoints, there are no obvious "exit" buttons for armed actors to see. To exit during evaluation, tap the 🌾 emblem at the top-right, tap the footer link, or hold the bottom-left corner for 2 seconds. The app then requests PIN 1234.',
          highlight: true,
        },
      ],
    },
    {
      badge: 'COMMUNITY & UPLINK',
      icon: '🤝',
      title: 'Opportunities & Offline Sync',
      subtitle: 'Peacebuilding Grants & Safe Data Transmission',
      cards: [
        {
          heading: 'Peace Opportunities Tab',
          text: 'Access verified grants, legal aid, agricultural micro-loans, and youth vocational programs designed to tackle root causes of violence.',
        },
        {
          heading: 'Sync Engine Tab',
          text: 'Reports stay queued in local SQLite storage. When you reach a safe location with data or Wi-Fi, tap "Sync Now" to transmit pending records.',
          highlight: true,
        },
        {
          heading: 'Sneaker-Net Backup',
          text: 'In complete internet blackouts, export encrypted payloads directly to memory cards for manual courier transport.',
        },
      ],
    },
    {
      badge: 'QUICK REFERENCE',
      icon: '🔑',
      title: 'Terminal Access Codes',
      subtitle: 'Keep These Default Codes Handy for Evaluation',
      cards: [
        {
          heading: 'Normal Access PIN: 1234',
          text: 'Unlocks the full National Incident Ledger, Peace Opportunities, and Sync Engine.',
          highlight: true,
        },
        {
          heading: 'Duress Checkpoint PIN: 9999',
          text: 'Silently opens the harmless Maize & Grain Prices screen with zero trace of sensitive civic records.',
        },
        {
          heading: 'Emergency Wipe PIN: 0000',
          text: 'Purges all local SQLite records instantly and opens the Grain Decoy screen.',
          danger: true,
        },
      ],
    },
  ], []);

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} translucent={false} />

      {/* Top Header Row */}
      <View style={styles.topBar}>
        <View style={styles.stepIndicatorPill}>
          <Text style={styles.stepIndicatorText}>
            STEP {currentSlide + 1} OF {slides.length}
          </Text>
        </View>

        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={onToggleLanguage}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP_64}
          >
            <Text style={styles.langPillText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={onComplete}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP_64}
          >
            <Text style={styles.skipBtnText}>SKIP</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Slide Header */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>{slide.icon}</Text>
          </View>
          <Text style={styles.badgeText}>{slide.badge}</Text>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
        </View>

        {/* Content Cards */}
        <View style={styles.cardsContainer}>
          {slide.cards.map((card, idx) => (
            <View
              key={idx}
              style={[
                styles.infoCard,
                card.highlight && styles.infoCardHighlight,
                card.danger && styles.infoCardDanger,
              ]}
            >
              <Text
                style={[
                  styles.cardHeading,
                  card.highlight && styles.cardHeadingHighlight,
                  card.danger && styles.cardHeadingDanger,
                ]}
              >
                {card.heading}
              </Text>
              <Text style={styles.cardText}>{card.text}</Text>
            </View>
          ))}
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {slides.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setCurrentSlide(idx)}
              style={[
                styles.dot,
                currentSlide === idx && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Controls */}
      <View style={styles.bottomBar}>
        {currentSlide > 0 ? (
          <TouchableOpacity
            style={styles.prevButton}
            onPress={handlePrev}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP_64}
          >
            <Text style={styles.prevButtonText}>← BACK</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.prevPlaceholder} />
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLast ? 'PROCEED TO ENCLAVE UNLOCK (PIN: 1234) →' : 'NEXT →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: ThemeTokens, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
    },
    stepIndicatorPill: {
      backgroundColor: theme.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: theme.border,
    },
    stepIndicatorText: {
      fontFamily: FONTS.mono,
      fontSize: 10,
      fontWeight: '800',
      color: theme.primary,
      letterSpacing: 1,
    },
    topActionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    langPill: {
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 3,
    },
    langPillText: {
      fontFamily: FONTS.mono,
      fontSize: 10,
      fontWeight: '800',
      color: theme.primary,
    },
    skipBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    skipBtnText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '700',
      color: theme.mutedForeground,
      letterSpacing: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingBottom: 24,
    },
    heroSection: {
      alignItems: 'center',
      marginBottom: 16,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    iconText: {
      fontSize: 26,
    },
    badgeText: {
      fontFamily: FONTS.mono,
      fontSize: 9,
      fontWeight: '800',
      color: theme.primary,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    slideTitle: {
      fontFamily: FONTS.condensed,
      fontSize: 22,
      fontWeight: '800',
      color: theme.foreground,
      textAlign: 'center',
      marginBottom: 4,
    },
    slideSubtitle: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      color: theme.mutedForeground,
      textAlign: 'center',
      lineHeight: 16,
      paddingHorizontal: 12,
    },
    cardsContainer: {
      gap: 10,
      marginBottom: 20,
    },
    infoCard: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 3,
      padding: 12,
    },
    infoCardHighlight: {
      borderColor: theme.primary,
      backgroundColor: isDark ? '#23201A' : '#FFFBEB',
    },
    infoCardDanger: {
      borderColor: theme.statusDanger,
      backgroundColor: isDark ? '#261618' : '#FEF2F2',
    },
    cardHeading: {
      fontFamily: FONTS.condensed,
      fontSize: 14,
      fontWeight: '700',
      color: theme.foreground,
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    cardHeadingHighlight: {
      color: theme.primary,
    },
    cardHeadingDanger: {
      color: theme.statusDanger,
    },
    cardText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      color: theme.mutedForeground,
      lineHeight: 16,
    },
    paginationRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginVertical: 12,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.border,
    },
    dotActive: {
      width: 24,
      backgroundColor: theme.primary,
    },
    bottomBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: 10,
    },
    prevPlaceholder: {
      width: 70,
    },
    prevButton: {
      minHeight: METRICS.minTouchTarget,
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.secondary,
    },
    prevButtonText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '700',
      color: theme.mutedForeground,
      letterSpacing: 1,
    },
    nextButton: {
      flex: 1,
      minHeight: METRICS.minTouchTarget,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      paddingHorizontal: 12,
    },
    nextButtonText: {
      fontFamily: FONTS.condensed,
      fontSize: 13,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 1,
      textAlign: 'center',
    },
  });
