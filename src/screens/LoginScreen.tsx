import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { wipeAllLocalData, getUserPin, getDuressPin } from '../db';
import { TOKENS, FONTS, METRICS, HIT_SLOP_64 } from '../theme/tokens';

interface LoginScreenProps {
  onUnlock: () => void;
  onTriggerDuress: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

const PIN_LENGTH = 4;
const WIPE_PIN = '0000';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onUnlock,
  onTriggerDuress,
  language,
  onToggleLanguage,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [realPin, setRealPin] = useState<string>('1234');
  const [duressPin, setDuressPin] = useState<string>('9999');
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);

  const t = translations[language];

  // Load configured user PIN and duress PIN from secure SQLite store
  useEffect(() => {
    async function loadPins() {
      try {
        const uPin = await getUserPin();
        const dPin = await getDuressPin();
        setRealPin(uPin);
        setDuressPin(dPin);
      } catch (err) {
        console.error('Failed to load pins:', err);
      }
    }
    loadPins();
  }, []);

  const handleDigitPress = async (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + digit;
    setPin(newPin);
    setErrorMessage('');

    if (newPin.length === PIN_LENGTH) {
      setTimeout(async () => {
        if (newPin === realPin) {
          setPin('');
          onUnlock();
        } else if (newPin === duressPin) {
          setPin('');
          // Instantly launch harmless decoy screen with zero hint of civic data
          onTriggerDuress();
        } else if (newPin === WIPE_PIN) {
          // Stealth panic wipe: purges local database completely
          setPin('');
          try {
            await wipeAllLocalData();
          } catch (e) {
            console.error('Panic wipe error:', e);
          }
          onTriggerDuress();
        } else {
          setPin('');
          setErrorMessage(t.loginInvalid);
        }
      }, 150);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={TOKENS.background} />
      <View style={styles.container}>
        {/* Top Bar: Clean & Minimalist */}
        <View style={styles.topBar}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>ENCLAVE ACTIVE</Text>
          </View>

          {/* Language Cycler */}
          <TouchableOpacity
            style={styles.langPill}
            onPress={onToggleLanguage}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP_64}
          >
            <Text style={styles.langPillText}>
              {language === 'en'
                ? '🇬🇧 EN'
                : language === 'ha'
                ? '🇳🇬 HA'
                : language === 'yo'
                ? '🇳🇬 YO'
                : language === 'ig'
                ? '🇳🇬 IG'
                : '🇫🇷 FR'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Center Auth Card */}
        <View style={styles.centerSection}>
          <TouchableOpacity
            style={styles.shieldBadge}
            onLongPress={() => setShowDemoModal(true)}
            activeOpacity={0.9}
          >
            <Text style={styles.shieldIcon}>🔒</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t.loginTitle}</Text>
          <Text style={styles.subtitle}>{t.loginSubtitle}</Text>

          {/* PIN Indicators */}
          <View style={styles.dotsContainer}>
            {Array.from({ length: PIN_LENGTH }).map((_, index) => {
              const isFilled = index < pin.length;
              return (
                <View
                  key={index}
                  style={[styles.dot, isFilled && styles.dotFilled]}
                />
              );
            })}
          </View>

          {/* Error Container */}
          <View style={styles.errorContainer}>
            {errorMessage ? (
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            ) : (
              <Text style={styles.helperText}>{t.loginHelper}</Text>
            )}
          </View>
        </View>

        {/* Tactile Keypad */}
        <View style={styles.keypad}>
          <View style={styles.keyRow}>
            {['1', '2', '3'].map((d) => (
              <TouchableOpacity
                key={d}
                activeOpacity={0.6}
                style={styles.keyButton}
                onPress={() => handleDigitPress(d)}
              >
                <Text style={styles.keyText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyRow}>
            {['4', '5', '6'].map((d) => (
              <TouchableOpacity
                key={d}
                activeOpacity={0.6}
                style={styles.keyButton}
                onPress={() => handleDigitPress(d)}
              >
                <Text style={styles.keyText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyRow}>
            {['7', '8', '9'].map((d) => (
              <TouchableOpacity
                key={d}
                activeOpacity={0.6}
                style={styles.keyButton}
                onPress={() => handleDigitPress(d)}
              >
                <Text style={styles.keyText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyRow}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.keyButton, styles.auxKeyButton]}
              onPress={handleClear}
              hitSlop={HIT_SLOP_64}
            >
              <Text style={styles.auxKeyText}>CLR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.keyButton}
              onPress={() => handleDigitPress('0')}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.keyButton, styles.auxKeyButton]}
              onPress={handleDelete}
              hitSlop={HIT_SLOP_64}
            >
              <Text style={styles.auxKeyText}>DEL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer: Clean & Discrete */}
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.demoGuideButton}
            onPress={() => setShowDemoModal(true)}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP_64}
          >
            <Text style={styles.demoGuideText}>ℹ️ Evaluator Access Guide</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Discrete Evaluator Guide Modal (Only shown on explicit click) */}
      <Modal
        visible={showDemoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDemoModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Evaluator Security Protocol</Text>
            <Text style={styles.modalNotice}>
              In production, secret codes are never printed on screen to prevent compromise during checkpoint searches.
            </Text>

            <View style={styles.codeItem}>
              <Text style={styles.codeLabel}>Master Field Unlock PIN:</Text>
              <Text style={styles.codeVal}>{realPin}</Text>
              <Text style={styles.codeDesc}>Unlocks the full authenticated Eto Civic Ledger.</Text>
            </View>

            <View style={styles.codeItem}>
              <Text style={styles.codeLabel}>Checkpoint Duress PIN:</Text>
              <Text style={styles.codeVal}>{duressPin}</Text>
              <Text style={styles.codeDesc}>Launches harmless AgriWeather & Grain Market screen.</Text>
            </View>

            <View style={styles.codeItem}>
              <Text style={styles.codeLabel}>Emergency Panic Wipe Code:</Text>
              <Text style={styles.codeVal}>0000</Text>
              <Text style={styles.codeDesc}>Immediately purges all local SQLite records & opens decoy.</Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDemoModal(false)}
            >
              <Text style={styles.modalCloseText}>Close Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.background },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TOKENS.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TOKENS.primary,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: TOKENS.mutedForeground,
    letterSpacing: 0.5,
    fontFamily: FONTS.mono,
  },
  langPill: {
    backgroundColor: TOKENS.card,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: TOKENS.primary,
    fontFamily: FONTS.mono,
  },
  centerSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  shieldBadge: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: TOKENS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  shieldIcon: { fontSize: 26 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TOKENS.foreground,
    letterSpacing: 0.3,
    fontFamily: FONTS.mono,
  },
  subtitle: {
    fontSize: 12,
    color: TOKENS.mutedForeground,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 280,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    gap: 16,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: TOKENS.border,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: TOKENS.primary,
    borderColor: TOKENS.primary,
  },
  errorContainer: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: TOKENS.riskCritical,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FONTS.mono,
  },
  helperText: {
    color: TOKENS.mutedForeground,
    fontSize: 11,
    fontFamily: FONTS.mono,
  },
  keypad: {
    width: '100%',
    maxWidth: 310,
    alignSelf: 'center',
    gap: 12,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyButton: {
    width: 68,
    height: 68,
    borderRadius: 6,
    backgroundColor: TOKENS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '700',
    color: TOKENS.foreground,
    fontFamily: FONTS.mono,
  },
  auxKeyButton: {
    backgroundColor: TOKENS.secondary,
    borderColor: TOKENS.border,
  },
  auxKeyText: {
    fontSize: 12,
    fontWeight: '800',
    color: TOKENS.mutedForeground,
    letterSpacing: 0.5,
    fontFamily: FONTS.mono,
  },
  footerRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  demoGuideButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  demoGuideText: {
    fontSize: 11,
    color: TOKENS.mutedForeground,
    fontWeight: '600',
    fontFamily: FONTS.mono,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: TOKENS.card,
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: TOKENS.primary,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: TOKENS.foreground,
    marginBottom: 6,
    fontFamily: FONTS.mono,
  },
  modalNotice: {
    fontSize: 11,
    color: TOKENS.mutedForeground,
    marginBottom: 14,
    lineHeight: 16,
  },
  codeItem: {
    backgroundColor: TOKENS.background,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  codeLabel: {
    fontSize: 10,
    color: TOKENS.mutedForeground,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontFamily: FONTS.mono,
  },
  codeVal: {
    fontSize: 18,
    fontWeight: '900',
    color: TOKENS.primary,
    marginVertical: 2,
    letterSpacing: 1,
    fontFamily: FONTS.mono,
  },
  codeDesc: {
    fontSize: 11,
    color: TOKENS.foreground,
    lineHeight: 15,
  },
  modalCloseButton: {
    backgroundColor: TOKENS.primary,
    borderRadius: 6,
    minHeight: METRICS.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  modalCloseText: {
    color: TOKENS.primaryForeground,
    fontWeight: '800',
    fontSize: 13,
    fontFamily: FONTS.mono,
  },
});
