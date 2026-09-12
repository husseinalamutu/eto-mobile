import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { wipeAllLocalData } from '../db';

interface LoginScreenProps {
  onUnlock: () => void;
  onTriggerDuress: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

const PIN_LENGTH = 4;
const REAL_PIN = '1234';
const DURESS_PIN = '9999';
const WIPE_PIN = '0000';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onUnlock,
  onTriggerDuress,
  language,
  onToggleLanguage,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const t = translations[language];

  const handleDigitPress = async (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + digit;
    setPin(newPin);
    setErrorMessage('');

    if (newPin.length === PIN_LENGTH) {
      setTimeout(async () => {
        if (newPin === REAL_PIN) {
          setPin('');
          onUnlock();
        } else if (newPin === DURESS_PIN) {
          setPin('');
          // Instantly launch harmless decoy screen
          onTriggerDuress();
        } else if (newPin === WIPE_PIN) {
          // Emergency panic wipe: purge SQLite ledger entirely
          setPin('');
          try {
            await wipeAllLocalData();
          } catch (e) {
            console.error('Panic wipe error:', e);
          }
          // Enter decoy screen cleanly
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
        {/* Top Utility Bar with Language Switcher */}
        <View style={styles.topUtilityBar}>
          <View style={styles.secureTag}>
            <Text style={styles.secureTagText}>SECURE TERMINAL</Text>
          </View>
          <TouchableOpacity
            style={styles.langToggle}
            onPress={onToggleLanguage}
            activeOpacity={0.7}
          >
            <Text style={styles.langToggleText}>
              {language === 'en'
                ? '🇬🇧 EN'
                : language === 'ha'
                ? '🇳🇬 HA (Hausa)'
                : language === 'yo'
                ? '🇳🇬 YO (Yorùbá)'
                : '🇳🇬 IG (Igbo)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.shieldBadge}>
            <Text style={styles.shieldIcon}>🔒</Text>
          </View>
          <Text style={styles.title}>{t.loginTitle}</Text>
          <Text style={styles.subtitle}>{t.loginSubtitle}</Text>
        </View>

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

        {/* Status / Error Container */}
        <View style={styles.errorContainer}>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <Text style={styles.helperText}>{t.loginHelper}</Text>
          )}
        </View>

        {/* Tactile Keypad */}
        <View style={styles.keypad}>
          <View style={styles.keyRow}>
            {['1', '2', '3'].map((d) => (
              <TouchableOpacity
                key={d}
                activeOpacity={0.7}
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
                activeOpacity={0.7}
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
                activeOpacity={0.7}
                style={styles.keyButton}
                onPress={() => handleDigitPress(d)}
              >
                <Text style={styles.keyText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.keyButton, styles.auxKeyButton]}
              onPress={handleClear}
            >
              <Text style={styles.auxKeyText}>CLR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.keyButton}
              onPress={() => handleDigitPress('0')}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.keyButton, styles.auxKeyButton]}
              onPress={handleDelete}
            >
              <Text style={styles.auxKeyText}>DEL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hackathon Evaluator & Security Protocol Notice */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>{t.loginNotice}</Text>
          <Text style={styles.demoDesc}>
            {t.loginRealPin}{'\n'}
            {t.loginDuressPin}{'\n'}
            {t.loginWipePin}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  topUtilityBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secureTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  secureTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  langToggle: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  langToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  header: { alignItems: 'center', marginTop: 10 },
  shieldBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  shieldIcon: { fontSize: 26 },
  title: { fontSize: 19, fontWeight: '800', color: '#F8FAFC', letterSpacing: 0.5 },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 4, textAlign: 'center' },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 14,
    gap: 16,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  errorContainer: { height: 22, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '700' },
  helperText: { color: '#64748B', fontSize: 11 },
  keypad: { width: '100%', maxWidth: 310, alignSelf: 'center', gap: 12 },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between' },
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
  keyText: { fontSize: 24, fontWeight: '700', color: '#F1F5F9' },
  auxKeyButton: { backgroundColor: '#0F172A', borderColor: '#1E293B' },
  auxKeyText: { fontSize: 13, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  demoBox: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  demoDesc: { fontSize: 11, color: '#CBD5E1', lineHeight: 16 },
});
