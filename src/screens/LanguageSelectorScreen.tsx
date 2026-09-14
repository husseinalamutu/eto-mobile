import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Language } from '../types';
import { TOKENS, FONTS, METRICS } from '../theme/tokens';

interface Props {
  currentLanguage: Language;
  onSelect: (lang: Language) => void;
  onOpenSpec?: () => void;
}

interface LanguageOption {
  code: Language;
  flag: string;
  name: string;
  nativeScript?: string;
  subtext: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    flag: '🇬🇧',
    name: 'English',
    subtext: 'EN · CONTINUE →',
  },
  {
    code: 'ha',
    flag: '🇳🇬',
    name: 'Hausa',
    nativeScript: 'Harshen Hausa',
    subtext: 'HA · CI GABA →',
  },
  {
    code: 'yo',
    flag: '🇳🇬',
    name: 'Yorùbá',
    nativeScript: 'Èdè Yorùbá',
    subtext: 'YO · TÈSÍWAJÚ →',
  },
  {
    code: 'ig',
    flag: '🇳🇬',
    name: 'Igbo',
    nativeScript: 'Asụsụ Igbo',
    subtext: 'IG · GAGHAIRU →',
  },
  {
    code: 'fr',
    flag: '🇫🇷',
    name: 'Français',
    nativeScript: 'Sahel / Bassin du Tchad',
    subtext: 'FR · CONTINUER →',
  },
];

export const LanguageSelectorScreen: React.FC<Props> = ({
  currentLanguage,
  onSelect,
  onOpenSpec,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={TOKENS.background} />

      {/* Top Header with discrete SPEC button */}
      <View style={styles.topBar}>
        <Text style={styles.clockText}>09:41</Text>
        <View style={styles.topRightControls}>
          <Text style={styles.statusBarIcons}>▲▲▲ WiFi 🔋85%</Text>
          {onOpenSpec && (
            <TouchableOpacity
              onPress={onOpenSpec}
              style={styles.specButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.specButtonText}>SPEC</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* App Logo Mark — Framed Square ÈTÒ */}
        <View style={styles.logoSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>ÈTÒ</Text>
          </View>
          <Text style={styles.appName}>CIVIC MONITOR</Text>
          <Text style={styles.appSubtext}>FIELD OPERATIONS V2.4</Text>
        </View>

        {/* Structural hairline */}
        <View style={styles.divider} />

        {/* Language Section Title */}
        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>CHOOSE LANGUAGE</Text>
          <Text style={styles.sectionSubtitle}>Zaɓi Harshe · Yan Èdè Rẹ · Họrọ Asụsụ</Text>
        </View>

        {/* Language Cards (72dp minimum touch targets) */}
        <View style={styles.cardsContainer}>
          {LANGUAGES.map((item) => {
            const isSelected = currentLanguage === item.code;
            return (
              <TouchableOpacity
                key={item.code}
                onPress={() => onSelect(item.code)}
                style={[
                  styles.langCard,
                  isSelected ? styles.langCardSelected : styles.langCardDefault,
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.flagText}>{item.flag}</Text>
                <View style={styles.langTextContainer}>
                  <Text
                    style={[
                      styles.langName,
                      isSelected ? styles.langNameSelected : styles.langNameDefault,
                    ]}
                  >
                    {item.name} {item.nativeScript ? `· ${item.nativeScript}` : ''}
                  </Text>
                  <Text style={styles.langSubtext}>{item.subtext}</Text>
                </View>
                <Text
                  style={[
                    styles.chevronText,
                    isSelected ? styles.chevronSelected : styles.chevronDefault,
                  ]}
                >
                  ›
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Local Storage & Accessibility Notice */}
        <View style={styles.noticeBox}>
          <Text style={styles.noticeIcon}>ℹ</Text>
          <View style={styles.noticeTextContainer}>
            <Text style={styles.noticeText}>
              All data stored locally. Network connection not required for core functions.
            </Text>
            <Text style={styles.noticeSubtext}>
              Duk bayanan an ajiye a cikin na'ura. Babu buƙatar intanet.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: TOKENS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  clockText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: TOKENS.mutedForeground,
    letterSpacing: 1.2,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBarIcons: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: TOKENS.mutedForeground,
  },
  specButton: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 1,
    borderColor: TOKENS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  specButtonText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.primary,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  logoBadge: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TOKENS.primary,
    backgroundColor: TOKENS.secondary,
    marginBottom: 12,
  },
  logoText: {
    fontFamily: FONTS.condensed,
    fontSize: 26,
    fontWeight: '700',
    color: TOKENS.primary,
    letterSpacing: 2,
  },
  appName: {
    fontFamily: FONTS.condensed,
    fontSize: 14,
    fontWeight: '600',
    color: TOKENS.foreground,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  appSubtext: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    letterSpacing: 1.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: TOKENS.border,
    marginBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 16,
    fontWeight: '700',
    color: TOKENS.foreground,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontFamily: FONTS.condensed,
    fontSize: 12,
    color: TOKENS.mutedForeground,
    marginTop: 4,
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  langCard: {
    minHeight: METRICS.cardMinHeight,
    borderRadius: METRICS.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  langCardDefault: {
    backgroundColor: TOKENS.card,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  langCardSelected: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 2,
    borderColor: TOKENS.primary,
  },
  flagText: {
    fontSize: 28,
    marginRight: 16,
  },
  langTextContainer: {
    flex: 1,
  },
  langName: {
    fontFamily: FONTS.condensed,
    fontSize: 18,
    fontWeight: '700',
  },
  langNameDefault: {
    color: TOKENS.foreground,
  },
  langNameSelected: {
    color: TOKENS.primary,
  },
  langSubtext: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  chevronText: {
    fontSize: 24,
    fontWeight: '300',
    marginLeft: 8,
  },
  chevronDefault: {
    color: TOKENS.mutedForeground,
  },
  chevronSelected: {
    color: TOKENS.primary,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: TOKENS.muted,
    borderWidth: 1,
    borderColor: TOKENS.border,
    padding: 12,
    borderRadius: METRICS.borderRadius,
    gap: 10,
  },
  noticeIcon: {
    color: TOKENS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    lineHeight: 14,
  },
  noticeSubtext: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    lineHeight: 14,
    marginTop: 4,
  },
});
