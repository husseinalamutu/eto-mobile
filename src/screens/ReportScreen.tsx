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
import { NIGERIA_LOCATIONS } from '../data/lgaData';

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

  // Location Picker Modal State
  const [locationModalVisible, setLocationModalVisible] = useState<boolean>(false);

  // Confirmation Modal
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [submittedReportId, setSubmittedReportId] = useState<string>('');
  const [submittedTimestamp, setSubmittedTimestamp] = useState<string>('');

  const currentState = NIGERIA_LOCATIONS[selectedStateIndex];
  const currentLGA = currentState.lgas[selectedLGAIndex];
  const currentWard = currentLGA.wards[selectedWardIndex];

  const formattedLocation = `${currentWard}, ${currentLGA.name}, ${currentState.state}${
    specificLandmark.trim() ? ` (${specificLandmark.trim()})` : ''
  }`;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setFormError('');

    if (!description.trim() || description.trim().length < 10) {
      setFormError('Please detail what occurred (minimum 10 characters).');
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.screenHeading}>{t.reportHeading}</Text>
            <Text style={styles.screenSubheading}>{t.reportSubheading}</Text>
          </View>

          {/* Anonymity Shield Banner */}
          <View style={styles.securityBanner}>
            <Text style={styles.securityTitle}>🛡️ ZERO-TRACE CIVIC ANONYMITY</Text>
            <Text style={styles.securityText}>
              Device identifiers, phone numbers, and coordinates are excluded. Identified solely by a decentralized cryptographic hash.
            </Text>
          </View>

          {formError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {formError}</Text>
            </View>
          ) : null}

          {/* Section 1: Location Selector */}
          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>{t.fieldLocation}</Text>
              <TouchableOpacity
                onPress={() => setLocationModalVisible(true)}
                style={styles.changeLocBtn}
              >
                <Text style={styles.changeLocText}>Change</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.locationDisplayBox}
              onPress={() => setLocationModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.locationPinIcon}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationStateLga}>
                  {currentState.state} • {currentLGA.name}
                </Text>
                <Text style={styles.locationWard}>{currentWard}</Text>
              </View>
            </TouchableOpacity>

            <TextInput
              style={styles.landmarkInput}
              placeholder="Optional landmark (e.g. Near Solar Pump #2 or Old Market Bridge)"
              placeholderTextColor="#64748B"
              value={specificLandmark}
              onChangeText={setSpecificLandmark}
            />
          </View>

          {/* Section 2: Incident Category */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>{t.fieldCategory}</Text>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.value;
              return (
                <TouchableOpacity
                  key={cat.value}
                  activeOpacity={0.8}
                  style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                  onPress={() => setCategory(cat.value)}
                >
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.categoryTitle,
                        isSelected && styles.categoryTitleSelected,
                      ]}
                    >
                      {cat.label}
                    </Text>
                    <Text style={styles.categoryDesc}>{cat.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 3: Severity Level */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>{t.fieldSeverity}</Text>
            <View style={styles.severityRow}>
              {SEVERITIES.map((s) => {
                const isSelected = severity === s.value;
                return (
                  <TouchableOpacity
                    key={s.value}
                    activeOpacity={0.8}
                    style={[
                      styles.severityBtn,
                      isSelected && { borderColor: s.color, backgroundColor: s.color + '22' },
                    ]}
                    onPress={() => setSeverity(s.value)}
                  >
                    <View style={[styles.severityDot, { backgroundColor: s.color }]} />
                    <Text
                      style={[
                        styles.severityText,
                        isSelected && { color: '#FFFFFF', fontWeight: '800' },
                      ]}
                    >
                      {s.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 4: Resource Tags */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>DISPUTE / RESOURCE TAGS</Text>
            <View style={styles.tagsContainer}>
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

          {/* Section 5: Description */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>{t.fieldDescription}</Text>
            <TextInput
              style={styles.textArea}
              placeholder={t.descPlaceholder}
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
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

      {/* Clean Location Selector Modal */}
      <Modal
        visible={locationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.locationModal}>
            <Text style={styles.locModalTitle}>📍 Select State, LGA & Ward</Text>

            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={styles.locStepHeader}>1. SELECT STATE</Text>
              <View style={styles.locChipWrap}>
                {NIGERIA_LOCATIONS.map((loc, idx) => (
                  <TouchableOpacity
                    key={loc.state}
                    style={[styles.locChoiceChip, selectedStateIndex === idx && styles.locChoiceChipActive]}
                    onPress={() => {
                      setSelectedStateIndex(idx);
                      setSelectedLGAIndex(0);
                      setSelectedWardIndex(0);
                    }}
                  >
                    <Text style={[styles.locChoiceText, selectedStateIndex === idx && styles.locChoiceTextActive]}>
                      {loc.state}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.locStepHeader}>2. SELECT LGA</Text>
              <View style={styles.locChipWrap}>
                {currentState.lgas.map((lga, idx) => (
                  <TouchableOpacity
                    key={lga.name}
                    style={[styles.locChoiceChip, selectedLGAIndex === idx && styles.locChoiceChipActive]}
                    onPress={() => {
                      setSelectedLGAIndex(idx);
                      setSelectedWardIndex(0);
                    }}
                  >
                    <Text style={[styles.locChoiceText, selectedLGAIndex === idx && styles.locChoiceTextActive]}>
                      {lga.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.locStepHeader}>3. SELECT WARD</Text>
              <View style={styles.locChipWrap}>
                {currentLGA.wards.map((ward, idx) => (
                  <TouchableOpacity
                    key={ward}
                    style={[styles.locChoiceChip, selectedWardIndex === idx && styles.locChoiceChipActive]}
                    onPress={() => setSelectedWardIndex(idx)}
                  >
                    <Text style={[styles.locChoiceText, selectedWardIndex === idx && styles.locChoiceTextActive]}>
                      {ward}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.locModalDoneBtn}
              onPress={() => setLocationModalVisible(false)}
            >
              <Text style={styles.locModalDoneText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={confirmationVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmCard}>
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
  scrollContent: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 12 },
  screenHeading: { fontSize: 20, fontWeight: '900', color: '#F8FAFC' },
  screenSubheading: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
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
  securityTitle: { fontSize: 11, fontWeight: '800', color: '#38BDF8', letterSpacing: 0.5, marginBottom: 4 },
  securityText: { fontSize: 11, color: '#CBD5E1', lineHeight: 16 },
  errorBox: {
    backgroundColor: '#450A0A',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: { color: '#FCA5A5', fontSize: 12, fontWeight: '600' },
  cardSection: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 8 },
  changeLocBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  changeLocText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  locationDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  locationPinIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  locationStateLga: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  locationWard: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  landmarkInput: {
    backgroundColor: '#0F172A',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 10,
  },
  categoryCard: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryCardSelected: { borderColor: '#38BDF8', backgroundColor: '#0B2545' },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748B',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#38BDF8' },
  categoryTitle: { fontSize: 13, fontWeight: '700', color: '#F1F5F9' },
  categoryTitleSelected: { color: '#38BDF8' },
  categoryDesc: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  severityRow: { flexDirection: 'row', gap: 8 },
  severityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  severityText: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tagChipActive: { backgroundColor: '#1E3A8A', borderColor: '#60A5FA' },
  tagText: { fontSize: 11, color: '#94A3B8' },
  tagTextActive: { color: '#93C5FD', fontWeight: '800' },
  textArea: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
    height: 90,
  },
  submitButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  locationModal: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  locModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  locStepHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  locChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  locChoiceChip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  locChoiceChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  locChoiceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  locChoiceTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  locModalDoneBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  locModalDoneText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  confirmCard: {
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
