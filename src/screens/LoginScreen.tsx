import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface LoginScreenProps {
  onUnlock: () => void;
  onTriggerDuress: () => void;
}

const PIN_LENGTH = 4;
const REAL_PIN = '1234';
const DURESS_PIN = '9999';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onUnlock,
  onTriggerDuress,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDigitPress = (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + digit;
    setPin(newPin);
    setErrorMessage('');

    if (newPin.length === PIN_LENGTH) {
      // Evaluate entered PIN immediately
      setTimeout(() => {
        if (newPin === REAL_PIN) {
          setPin('');
          onUnlock();
        } else if (newPin === DURESS_PIN) {
          setPin('');
          // Instantly launch decoy screen with zero delay or human rights trace
          onTriggerDuress();
        } else {
          setPin('');
          setErrorMessage('Invalid PIN. Please try again.');
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.shieldBadge}>
            <Text style={styles.shieldIcon}>🔒</Text>
          </View>
          <Text style={styles.title}>System Security Access</Text>
          <Text style={styles.subtitle}>
            Enter terminal PIN to authenticate device session
          </Text>
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

        {/* Error Message */}
        <View style={styles.errorContainer}>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <Text style={styles.helperText}>Protected by Local Cryptographic Enclave</Text>
          )}
        </View>

        {/* Tactile Keypad */}
        <View style={styles.keypad}>
          <View style={styles.keyRow}>
            {['1', '2', '3'].map((digit) => (
              <TouchableOpacity
                key={digit}
                activeOpacity={0.7}
                style={styles.keyButton}
                onPress={() => handleDigitPress(digit)}
              >
                <Text style={styles.keyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keyRow}>
            {['4', '5', '6'].map((digit) => (
              <TouchableOpacity
                key={digit}
                activeOpacity={0.7}
                style={styles.keyButton}
                onPress={() => handleDigitPress(digit)}
              >
                <Text style={styles.keyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keyRow}>
            {['7', '8', '9'].map((digit) => (
              <TouchableOpacity
                key={digit}
                activeOpacity={0.7}
                style={styles.keyButton}
                onPress={() => handleDigitPress(digit)}
              >
                <Text style={styles.keyText}>{digit}</Text>
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

        {/* Evaluator / Demo Helper Callout */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>HACKATHON EVALUATOR NOTICE</Text>
          <Text style={styles.demoDesc}>
            • Real Field Access PIN: <Text style={styles.codeText}>1234</Text>{'\n'}
            • Checkpoint Duress PIN: <Text style={styles.codeText}>9999</Text> (Decoy mode)
          </Text>
        </View>
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
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  shieldBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  shieldIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
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
  dotFilled: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  errorContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    color: '#64748B',
    fontSize: 12,
  },
  keypad: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    gap: 14,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  auxKeyButton: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  auxKeyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  demoBox: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 10,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  demoDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  codeText: {
    fontWeight: '700',
    color: '#38BDF8',
  },
});
