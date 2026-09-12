import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ReportCategory, ReportSeverity } from '../types';
import { insertReport } from '../db';

interface ReportScreenProps {
  onReportSubmitted?: () => void;
}

const CATEGORIES: { label: string; value: ReportCategory; desc: string }[] = [
  {
    label: 'Conflict Indicator',
    value: 'Conflict Indicator',
    desc: 'Pastoralist-farmer boundary disputes, grazing friction, or vigilante tensions.',
  },
  {
    label: 'Infrastructure Breakdown',
    value: 'Infrastructure Breakdown',
    desc: 'Borehole/solar pump failure, bridge washout, or damaged public clinic.',
  },
  {
    label: 'Misappropriation',
    value: 'Misappropriation',
    desc: 'Diverted relief food/seed supplies, extortion at checkpoints, or ghost projects.',
  },
];

const SEVERITIES: { label: string; value: ReportSeverity; color: string }[] = [
  { label: 'Low (Routine observation)', value: 'Low', color: '#16A34A' },
  { label: 'Medium (Active friction)', value: 'Medium', color: '#F59E0B' },
  { label: 'Critical (Immediate danger)', value: 'Critical', color: '#EF4444' },
];

export const ReportScreen: React.FC<ReportScreenProps> = ({ onReportSubmitted }) => {
  const [category, setCategory] = useState<ReportCategory>('Conflict Indicator');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<ReportSeverity>('Medium');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Confirmation Modal State
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [submittedReportId, setSubmittedReportId] = useState<string>('');
  const [submittedTimestamp, setSubmittedTimestamp] = useState<string>('');

  const handleSubmit = async () => {
    setFormError('');

    if (!location.trim()) {
      setFormError('Please provide a Ward or Local Government location.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide a factual incident description.');
      return;
    }
    if (description.trim().length < 15) {
      setFormError('Description is too brief. Please detail the situation (min 15 chars).');
      return;
    }

    try {
      setIsSubmitting(true);
      const newReport = await insertReport({
        category,
        location: location.trim(),
        description: description.trim(),
        severity,
      });

      setSubmittedReportId(newReport.id);
      setSubmittedTimestamp(newReport.created_at);
      setConfirmationVisible(true);

      // Clear Form Fields
      setLocation('');
      setDescription('');
      setSeverity('Medium');
      setCategory('Conflict Indicator');

      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (err) {
      setFormError('Failed to commit record to offline database.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.screenHeading}>Civic Incident Intake</Text>
            <Text style={styles.screenSubheading}>
              Zero-PII local SQLite ledger. Immune to network outages and checkpoint searches.
            </Text>
          </View>

          {/* Anonymity Banner */}
          <View style={styles.securityBanner}>
            <Text style={styles.securityTitle}>🛡️ ZERO-TRACE CIVIC ANONYMITY</Text>
            <Text style={styles.securityText}>
              IMEI, phone numbers, GPS coordinates, and personal identifiers are strictly excluded.
              Reports are identified solely by a decentralized cryptographic hash.
            </Text>
          </View>

          {/* Form Error Banner */}
          {formError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {formError}</Text>
            </View>
          ) : null}

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>INCIDENT CATEGORY</Text>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.value;
              return (
                <TouchableOpacity
                  key={cat.value}
                  activeOpacity={0.8}
                  style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                  onPress={() => setCategory(cat.value)}
                >
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.categoryOptionTitle,
                        isSelected && styles.categoryOptionTitleSelected,
                      ]}
                    >
                      {cat.label}
                    </Text>
                    <Text style={styles.categoryOptionDesc}>{cat.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Ward / Location Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>WARD & LGA LOCATION</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Gwarzo Central Ward, Kano or Kachia LGA, Kaduna"
              placeholderTextColor="#64748B"
              value={location}
              onChangeText={setLocation}
              autoCapitalize="words"
            />
            <Text style={styles.inputHint}>
              Specify only administrative ward or landmark. Do not write personal house numbers.
            </Text>
          </View>

          {/* Severity Level */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>SEVERITY LEVEL</Text>
            <View style={styles.severityRow}>
              {SEVERITIES.map((s) => {
                const isSelected = severity === s.value;
                return (
                  <TouchableOpacity
                    key={s.value}
                    activeOpacity={0.8}
                    style={[
                      styles.severityButton,
                      isSelected && {
                        borderColor: s.color,
                        backgroundColor: s.color + '22',
                      },
                    ]}
                    onPress={() => setSeverity(s.value)}
                  >
                    <View
                      style={[
                        styles.severityDot,
                        { backgroundColor: s.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.severityText,
                        isSelected && { color: '#FFFFFF', fontWeight: '700' },
                      ]}
                    >
                      {s.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Incident Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>FACTUAL INCIDENT REPORT</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe what occurred, parties involved (e.g. farmer group / borehole committee), and current tension level..."
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <Text style={styles.inputHint}>
              Strictly objective facts. Minimum 15 characters.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Recording to SQLite...' : 'Save to Offline Ledger'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Offline Success Confirmation Modal */}
      <Modal
        visible={confirmationVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Text style={styles.modalIcon}>💾</Text>
            </View>
            <Text style={styles.modalTitle}>Stored in Offline Ledger</Text>
            <Text style={styles.modalBody}>
              Your incident report has been written directly to the local SQLite database. No network was required.
            </Text>

            <View style={styles.modalLedgerInfo}>
              <Text style={styles.modalInfoLabel}>LEDGER ENTRY ID:</Text>
              <Text style={styles.modalInfoHash}>{submittedReportId}</Text>

              <Text style={[styles.modalInfoLabel, { marginTop: 8 }]}>TIMESTAMP:</Text>
              <Text style={styles.modalInfoVal}>{submittedTimestamp}</Text>

              <Text style={[styles.modalInfoLabel, { marginTop: 8 }]}>SYNC STATUS:</Text>
              <Text style={styles.modalStatusPill}>Pending Field Synchronization (synced = 0)</Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setConfirmationVisible(false)}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 12,
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  screenSubheading: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  securityBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#38BDF8',
    borderWidth: 1,
    borderColor: '#334155',
  },
  securityTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  errorBox: {
    backgroundColor: '#450A0A',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  categoryOption: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryOptionSelected: {
    borderColor: '#38BDF8',
    backgroundColor: '#0B2545',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748B',
    marginRight: 10,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38BDF8',
  },
  categoryOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  categoryOptionTitleSelected: {
    color: '#38BDF8',
  },
  categoryOptionDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 15,
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    height: 110,
  },
  inputHint: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 5,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  submitButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
  },
  modalIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0B2545',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalIcon: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  modalBody: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalLedgerInfo: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  modalInfoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  modalInfoHash: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#38BDF8',
    marginTop: 2,
  },
  modalInfoVal: {
    fontSize: 11,
    color: '#F1F5F9',
    marginTop: 2,
  },
  modalStatusPill: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
    marginTop: 2,
  },
  modalCloseButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
