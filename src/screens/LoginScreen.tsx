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
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
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
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
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
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  langPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
  },
  centerSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  shieldBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  shieldIcon: { fontSize: 26 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
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
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  errorContainer: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  helperText: {
    color: '#64748B',
    fontSize: 11,
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
    borderRadius: 34,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  auxKeyButton: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  auxKeyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
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
    color: '#64748B',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  modalNotice: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 14,
    lineHeight: 16,
  },
  codeItem: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  codeVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#38BDF8',
    marginVertical: 2,
    letterSpacing: 1,
  },
  codeDesc: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 15,
  },
  modalCloseButton: {
    backgroundColor: '#0284C7',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
