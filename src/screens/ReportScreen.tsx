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
import { ReportCategory, ReportSeverity, Language } from '../types';
import { translations } from '../i18n/translations';
import { insertReport } from '../db';
import { NORTHERN_NIGERIA_LOCATIONS } from '../data/lgaData';

interface ReportScreenProps {
  language: Language;
  onReportSubmitted?: () => void;
}

const RESOURCE_TAGS = [
  'Communal Borehole',
  'Grazing Route Corridor',
  'Fertilizer Voucher',
  'Relief Food Diversion',
  'Checkpoint Extortion',
  'Farmland Encroachment',
];

export const ReportScreen: React.FC<ReportScreenProps> = ({ language, onReportSubmitted }) => {
  const t = translations[language];

  const CATEGORIES: { label: string; value: ReportCategory; desc: string }[] = [
    { label: t.catConflict, value: 'Conflict Indicator', desc: t.catConflictDesc },
    { label: t.catInfra, value: 'Infrastructure Breakdown', desc: t.catInfraDesc },
    { label: t.catMisappr, value: 'Misappropriation', desc: t.catMisapprDesc },
  ];

  const SEVERITIES: { label: string; value: ReportSeverity; color: string }[] = [
    { label: t.sevLow, value: 'Low', color: '#16A34A' },
    { label: t.sevMed, value: 'Medium', color: '#F59E0B' },
    { label: t.sevCrit, value: 'Critical', color: '#EF4444' },
  ];

  const [category, setCategory] = useState<ReportCategory>('Conflict Indicator');
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(0);
  const [selectedLGAIndex, setSelectedLGAIndex] = useState<number>(0);
  const [selectedWardIndex, setSelectedWardIndex] = useState<number>(0);
  const [specificLandmark, setSpecificLandmark] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Communal Borehole']);
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<ReportSeverity>('Medium');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Confirmation Modal
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [submittedReportId, setSubmittedReportId] = useState<string>('');
  const [submittedTimestamp, setSubmittedTimestamp] = useState<string>('');

  const currentState = NORTHERN_NIGERIA_LOCATIONS[selectedStateIndex];
  const currentLGA = currentState.lgas[selectedLGAIndex];
  const currentWard = currentLGA.wards[selectedWardIndex];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setFormError('');

    const formattedLocation = `${currentWard}, ${currentLGA.name} LGA, ${currentState.state}${
      specificLandmark.trim() ? ` (${specificLandmark.trim()})` : ''
    }`;

    if (!description.trim() || description.trim().length < 15) {
      setFormError('Please detail what occurred (minimum 15 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      const tagPrefix = selectedTags.length > 0 ? `[Tags: ${selectedTags.join(', ')}] ` : '';
      const fullDescription = `${tagPrefix}${description.trim()}`;

      const newReport = await insertReport({
        category,
        location: formattedLocation,
        description: fullDescription,
        severity,
      });

      setSubmittedReportId(newReport.id);
      setSubmittedTimestamp(newReport.created_at);
      setConfirmationVisible(true);

      // Reset form fields
      setDescription('');
      setSpecificLandmark('');
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
          <View style={styles.header}>
            <Text style={styles.screenHeading}>{t.reportHeading}</Text>
            <Text style={styles.screenSubheading}>{t.reportSubheading}</Text>
          </View>

          {/* Anonymity Banner */}
          <View style={styles.securityBanner}>
            <Text style={styles.securityTitle}>{t.anonymityBannerTitle}</Text>
            <Text style={styles.securityText}>{t.anonymityBannerText}</Text>
          </View>

          {formError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {formError}</Text>
            </View>
          ) : null}

          {/* Category Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>{t.fieldCategory}</Text>
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

          {/* Quick LGA / Ward Selector for Northern Nigeria */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>{t.fieldLocation}</Text>
            
            {/* State Picker */}
            <Text style={styles.subSelectorLabel}>1. SELECT STATE:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {NORTHERN_NIGERIA_LOCATIONS.map((loc, idx) => (
                <TouchableOpacity
                  key={loc.state}
                  style={[styles.locationPill, selectedStateIndex === idx && styles.locationPillActive]}
                  onPress={() => {
                    setSelectedStateIndex(idx);
                    setSelectedLGAIndex(0);
                    setSelectedWardIndex(0);
                  }}
                >
                  <Text style={[styles.locationPillText, selectedStateIndex === idx && styles.locationPillTextActive]}>
                    {loc.state}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* LGA Picker */}
            <Text style={styles.subSelectorLabel}>2. SELECT LGA:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {currentState.lgas.map((lga, idx) => (
                <TouchableOpacity
                  key={lga.name}
                  style={[styles.locationPill, selectedLGAIndex === idx && styles.locationPillActive]}
                  onPress={() => {
                    setSelectedLGAIndex(idx);
                    setSelectedWardIndex(0);
                  }}
                >
                  <Text style={[styles.locationPillText, selectedLGAIndex === idx && styles.locationPillTextActive]}>
                    {lga.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Ward Picker */}
            <Text style={styles.subSelectorLabel}>3. SELECT WARD:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {currentLGA.wards.map((ward, idx) => (
                <TouchableOpacity
                  key={ward}
                  style={[styles.locationPill, selectedWardIndex === idx && styles.locationPillActive]}
                  onPress={() => setSelectedWardIndex(idx)}
                >
                  <Text style={[styles.locationPillText, selectedWardIndex === idx && styles.locationPillTextActive]}>
                    {ward}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Landmark text */}
            <TextInput
              style={[styles.textInput, { marginTop: 8 }]}
              placeholder="Optional landmark (e.g. Near Solar Pump #2 or Old Market Bridge)"
              placeholderTextColor="#64748B"
              value={specificLandmark}
              onChangeText={setSpecificLandmark}
            />
          </View>

          {/* Dispute / Resource Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>RESOURCE DISPUTE TAGS</Text>
            <View style={styles.tagGrid}>
              {RESOURCE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, isSelected && styles.tagChipActive]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[styles.tagText, isSelected && styles.tagTextActive]}>
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Severity */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>{t.fieldSeverity}</Text>
            <View style={styles.severityRow}>
              {SEVERITIES.map((s) => {
                const isSelected = severity === s.value;
                return (
                  <TouchableOpacity
                    key={s.value}
                    activeOpacity={0.8}
                    style={[
                      styles.severityButton,
                      isSelected && { borderColor: s.color, backgroundColor: s.color + '22' },
                    ]}
                    onPress={() => setSeverity(s.value)}
                  >
                    <View style={[styles.severityDot, { backgroundColor: s.color }]} />
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

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>{t.fieldDescription}</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder={t.descPlaceholder}
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? t.submittingText : t.submitButton}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <Modal visible={confirmationVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Text style={styles.modalIcon}>💾</Text>
            </View>
            <Text style={styles.modalTitle}>{t.storedModalTitle}</Text>
            <Text style={styles.modalBody}>{t.storedModalBody}</Text>

            <View style={styles.modalLedgerInfo}>
              <Text style={styles.modalInfoLabel}>{t.ledgerId}</Text>
              <Text style={styles.modalInfoHash}>{submittedReportId}</Text>
              <Text style={[styles.modalInfoLabel, { marginTop: 8 }]}>{t.timestamp}</Text>
              <Text style={styles.modalInfoVal}>{submittedTimestamp}</Text>
              <Text style={[styles.modalInfoLabel, { marginTop: 8 }]}>STATUS:</Text>
              <Text style={styles.modalStatusPill}>{t.syncStatusPending}</Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setConfirmationVisible(false)}
            >
              <Text style={styles.modalCloseText}>{t.done}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  scrollView: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 12 },
  screenHeading: { fontSize: 19, fontWeight: '800', color: '#F8FAFC' },
  screenSubheading: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  securityBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#38BDF8',
    borderWidth: 1,
    borderColor: '#334155',
  },
  securityTitle: { fontSize: 11, fontWeight: '800', color: '#38BDF8', letterSpacing: 0.5, marginBottom: 4 },
  securityText: { fontSize: 11, color: '#CBD5E1', lineHeight: 16 },
  errorBox: {
    backgroundColor: '#450A0A',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: { color: '#FCA5A5', fontSize: 12, fontWeight: '600' },
  inputGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 6 },
  subSelectorLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', marginTop: 4, marginBottom: 4 },
  pillScroll: { marginBottom: 6 },
  locationPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  locationPillActive: { backgroundColor: '#0284C7', borderColor: '#38BDF8' },
  locationPillText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  locationPillTextActive: { color: '#FFFFFF', fontWeight: '700' },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tagChipActive: { backgroundColor: '#1E3A8A', borderColor: '#60A5FA' },
  tagText: { fontSize: 11, color: '#94A3B8' },
  tagTextActive: { color: '#93C5FD', fontWeight: '700' },
  categoryOption: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryOptionSelected: { borderColor: '#38BDF8', backgroundColor: '#0B2545' },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#64748B',
    marginRight: 8,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#38BDF8' },
  categoryOptionTitle: { fontSize: 12, fontWeight: '700', color: '#F1F5F9' },
  categoryOptionTitleSelected: { color: '#38BDF8' },
  categoryOptionDesc: { fontSize: 10, color: '#94A3B8', marginTop: 2, lineHeight: 14 },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: { height: 100 },
  severityRow: { flexDirection: 'row', gap: 6 },
  severityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  severityDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  severityText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  submitButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
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
    padding: 18,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
  },
  modalIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0B2545',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalIcon: { fontSize: 22 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#F8FAFC', marginBottom: 4 },
  modalBody: { fontSize: 11, color: '#CBD5E1', textAlign: 'center', lineHeight: 16, marginBottom: 14 },
  modalLedgerInfo: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  modalInfoLabel: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 },
  modalInfoHash: { fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#38BDF8', marginTop: 1 },
  modalInfoVal: { fontSize: 10, color: '#F1F5F9', marginTop: 1 },
  modalStatusPill: { fontSize: 10, color: '#F59E0B', fontWeight: '700', marginTop: 1 },
  modalCloseButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
