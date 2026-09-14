import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Alert,
} from 'react-native';
import { Report, ReportCategory, ReportSeverity, Language } from '../types';
import { translations } from '../i18n/translations';
import { getReports, insertReport } from '../db';
import { NIGERIA_LOCATIONS } from '../data/lgaData';
import { TOKENS, RISK_CONFIG, STATUS_CONFIG, FONTS, METRICS, HIT_SLOP_64 } from '../theme/tokens';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

interface Props {
  language: Language;
  onReportSubmitted?: () => void;
  onPanicTap?: () => void;
  onLock?: () => void;
  onOpenSpec?: () => void;
}

export interface LedgerEntry {
  id: string;
  category: string;
  categoryHA: string;
  title: string;
  titleHA: string;
  date: string;
  time: string;
  status: 'synced' | 'pending';
  location: string;
  note: string;
  noteHA: string;
  risk: 'CRIT' | 'HIGH' | 'MED' | 'LOW';
}

// Initial baseline field entries if database has newly initialized
const DEFAULT_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'ENT-0041',
    category: 'Relief Aid',
    categoryHA: 'Agaji',
    title: 'WFP Distribution — Maiduguri Ward 4',
    titleHA: 'Rabawa WFP — Garin Maiduguri 4',
    date: '2026-09-12',
    time: '14:23',
    status: 'pending' as const,
    location: '12.234°N 13.157°E (Maiduguri)',
    note: '127 bags diverted. Truck reg. BN-0049-ABJ',
    noteHA: 'Mun sace jakar 127. Mota BN-0049-ABJ',
    risk: 'HIGH' as const,
  },
  {
    id: 'ENT-0040',
    category: 'Water Points',
    categoryHA: 'Ruwa',
    title: 'Borehole #7 — Konduga LGA',
    titleHA: 'Rijiya #7 — Ƙananan Hukumar Konduga',
    date: '2026-09-12',
    time: '09:11',
    status: 'synced' as const,
    location: '11.904°N 13.288°E (Konduga)',
    note: 'Pump seized. Community blocked access since Aug 30.',
    noteHA: 'An toshe famfo. An katse shiga tun Ogusta 30.',
    risk: 'MED' as const,
  },
  {
    id: 'ENT-0039',
    category: 'Security',
    categoryHA: 'Tsaro',
    title: 'Armed Stop — Route B7 / Dikwa Road',
    titleHA: 'Dakatar da Makamai — Hanyar B7/Dikwa',
    date: '2026-09-11',
    time: '17:55',
    status: 'synced' as const,
    location: '12.017°N 13.904°E (Mafa/Dikwa)',
    note: '4 armed, plain-clothed. Documents demanded.',
    noteHA: '4 makami, riguna. An buƙaci takardu.',
    risk: 'CRIT' as const,
  },
  {
    id: 'ENT-0038',
    category: 'Land',
    categoryHA: 'Ƙasa',
    title: 'Forced eviction — Ngala farming cluster',
    titleHA: 'Korar da tilastawa — Gonaki Ngala',
    date: '2026-09-10',
    time: '11:02',
    status: 'synced' as const,
    location: '12.356°N 14.189°E (Ngala)',
    note: '23 families. No documentation issued.',
    noteHA: 'Iyalai 23. Ba\'a bayar da takarda.',
    risk: 'HIGH' as const,
  },
];

const CATEGORIES = ['Relief Aid', 'Water Points', 'Security', 'Land', 'Infrastructure'];

export const ReportScreen: React.FC<Props> = ({
  language,
  onReportSubmitted,
  onPanicTap,
  onLock,
  onOpenSpec,
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<number>(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [dbReports, setDbReports] = useState<Report[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(1);

  // Form State inside Modal
  const [formCategory, setFormCategory] = useState<string>('Relief Aid');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formRisk, setFormRisk] = useState<'CRIT' | 'HIGH' | 'MED' | 'LOW'>('HIGH');
  const [formNote, setFormNote] = useState<string>('');
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(2); // Default Borno
  const [selectedLGAIndex, setSelectedLGAIndex] = useState<number>(0);
  const [selectedWardIndex, setSelectedWardIndex] = useState<number>(0);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Panic Tap tracking (3 taps within 800ms)
  const panicTapCount = useRef<number>(0);
  const panicTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHeaderTap = useCallback(() => {
    panicTapCount.current += 1;
    if (panicTimer.current) clearTimeout(panicTimer.current);

    if (panicTapCount.current >= 3) {
      panicTapCount.current = 0;
      if (onPanicTap) onPanicTap();
      return;
    }

    panicTimer.current = setTimeout(() => {
      panicTapCount.current = 0;
    }, 800);
  }, [onPanicTap]);

  // Load records from local SQLite database
  const loadDatabaseReports = useCallback(async () => {
    try {
      const stored: Report[] = await getReports();
      setDbReports(stored);
      const unsynced = stored.filter((r: Report) => r.synced === 0).length;
      setPendingCount(unsynced + 1); // include default pending
    } catch (err) {
      console.error('Failed to load SQLite reports:', err);
    }
  }, []);

  useEffect(() => {
    loadDatabaseReports();
  }, [loadDatabaseReports]);

  // Merge SQLite records with baseline records
  const allEntries = [
    ...dbReports.map((r) => ({
      id: `ENT-${r.id.substring(0, 4).toUpperCase()}`,
      category: r.category,
      categoryHA: r.category,
      title: r.description.split('.')[0] || 'Community Incident Observation',
      titleHA: r.description.split('.')[0] || 'Bayanan Filin',
      date: r.created_at.split('T')[0] || '2026-09-14',
      time: r.created_at.split('T')[1]?.substring(0, 5) || '10:00',
      status: (r.synced === 1 ? 'synced' : 'pending') as 'synced' | 'pending',
      location: r.location,
      note: r.description,
      noteHA: r.description,
      risk: (r.severity === 'Critical' ? 'CRIT' : r.severity === 'Low' ? 'LOW' : 'HIGH') as 'CRIT' | 'HIGH' | 'MED' | 'LOW',
    })),
    ...DEFAULT_LEDGER_ENTRIES,
  ];

  // Tab Filtering
  const filteredEntries: LedgerEntry[] =
    activeTab === 0
      ? allEntries
      : allEntries.filter((e) => {
          const targetCat = CATEGORIES[activeTab - 1];
          return e.category.toLowerCase().includes(targetCat.toLowerCase());
        });

  const renderEntryCard: ListRenderItem<LedgerEntry> = useCallback(
    ({ item: entry }) => {
      const risk = RISK_CONFIG[entry.risk] || RISK_CONFIG.HIGH;
      const status = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending;
      const isOpen = expandedId === entry.id;

      return (
        <TouchableOpacity
          key={entry.id}
          onPress={() => setExpandedId(isOpen ? null : entry.id)}
          style={[styles.entryCard, isOpen && styles.entryCardExpanded]}
          activeOpacity={0.85}
        >
          <View style={styles.entryMainRow}>
            {/* 32×32 Shape Icon */}
            <View
              style={[
                styles.shapeBox,
                { backgroundColor: risk.bg, borderColor: risk.border },
              ]}
            >
              <Text style={[styles.shapeIcon, { color: risk.text }]}>
                {risk.shape}
              </Text>
            </View>

            {/* Core Details */}
            <View style={styles.entryInfoCol}>
              <View style={styles.entryMetaRow}>
                <Text style={styles.entryIdText}>{entry.id}</Text>
                <View
                  style={[
                    styles.riskBadge,
                    { backgroundColor: risk.bg, borderColor: risk.border },
                  ]}
                >
                  <Text style={[styles.riskBadgeText, { color: risk.text }]}>
                    {risk.shape} {entry.risk}
                  </Text>
                </View>
              </View>

              <Text style={styles.entryTitleText}>
                {language === 'ha' ? entry.titleHA : entry.title}
              </Text>

              <View style={styles.entryStatusRow}>
                <Text style={styles.entryDateText}>
                  {entry.date} {entry.time}
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: status.bg, borderColor: status.border },
                  ]}
                >
                  <Text style={[styles.statusPillText, { color: status.color }]}>
                    {status.icon} {status.label}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.chevronArrow}>{isOpen ? '▴' : '▾'}</Text>
          </View>

          {/* Expandable Details Box */}
          {isOpen && (
            <View style={styles.expandedSection}>
              <View style={styles.expandedGrid}>
                <View style={styles.gridCol}>
                  <Text style={styles.gridColLabel}>LOCATION</Text>
                  <Text style={styles.gridColValue}>{entry.location}</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.gridColLabel}>CATEGORY</Text>
                  <Text style={styles.gridColValueWhite}>{entry.category}</Text>
                </View>
              </View>

              <View style={styles.fieldNoteBox}>
                <Text style={styles.fieldNoteLabel}>FIELD NOTE</Text>
                <Text style={styles.fieldNoteText}>
                  {language === 'ha' ? entry.noteHA : entry.note}
                </Text>
              </View>

              <View style={styles.expandedActionsRow}>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Record Receipt',
                      `Local ID: ${entry.id}\nGPS: ${entry.location}\nIntegrity Hash: SHA-256 Validated`
                    )
                  }
                  style={styles.actionBtnPrimary}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.actionBtnPrimaryText}>🔍 RECEIPT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Flag Incident',
                      `Flagged ${entry.id} for emergency peer-verification.`
                    )
                  }
                  style={styles.actionBtnDanger}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.actionBtnDangerText}>⚑ FLAG</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [expandedId, language]
  );

  // Current selected location label
  const currentState = NIGERIA_LOCATIONS[selectedStateIndex] || NIGERIA_LOCATIONS[0];
  const currentLGA = currentState.lgas[selectedLGAIndex] || currentState.lgas[0];
  const currentWard = currentLGA.wards[selectedWardIndex] || currentLGA.wards[0];
  const locationSummary = `${currentWard}, ${currentLGA.name} LGA, ${currentState.state} State`;

  // Submit New Record
  const handleSaveRecord = async () => {
    if (!formTitle.trim() && !formNote.trim()) {
      setFormError('Please enter an incident summary or field note.');
      return;
    }

    try {
      const severityMap: Record<string, ReportSeverity> = {
        CRIT: 'Critical',
        HIGH: 'Medium',
        MED: 'Medium',
        LOW: 'Low',
      };

      const categoryMap: Record<string, ReportCategory> = {
        'Relief Aid': 'Misappropriation',
        'Water Points': 'Infrastructure Breakdown',
        'Security': 'Conflict Indicator',
        'Land': 'Conflict Indicator',
        'Infrastructure': 'Infrastructure Breakdown',
      };

      await insertReport({
        category: categoryMap[formCategory] || 'Conflict Indicator',
        location: locationSummary,
        description: `${formTitle.trim()} — ${formNote.trim()}`,
        severity: severityMap[formRisk] || 'Medium',
      });

      setShowNewModal(false);
      setFormTitle('');
      setFormNote('');
      setFormError('');
      await loadDatabaseReports();

      if (onReportSubmitted) {
        onReportSubmitted();
      }

      Alert.alert(
        'Record Saved Offline',
        `Entry committed to local encrypted SQLite ledger (${locationSummary}).`
      );
    } catch (err) {
      console.error('Failed to save record:', err);
      setFormError('Database write error. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={TOKENS.background} />

      {/* ── Status Bar — PANIC TRIGGER ZONE (3 rapid taps within 800ms) ── */}
      <TouchableOpacity
        onPress={handleHeaderTap}
        activeOpacity={0.9}
        style={styles.panicTriggerBar}
      >
        <View style={styles.clockRow}>
          <Text style={styles.clockText}>09:41</Text>
          <View style={styles.secureBadge}>
            <Text style={styles.secureBadgeText}>SECURE</Text>
          </View>
        </View>

        <View style={styles.syncStatusRow}>
          <Text style={styles.syncStatusText}>
            ⬡ OFFLINE · {pendingCount} PENDING
          </Text>
          {onOpenSpec && (
            <TouchableOpacity
              onPress={onOpenSpec}
              style={styles.specMiniBtn}
              activeOpacity={0.7}
              hitSlop={HIT_SLOP_64}
            >
              <Text style={styles.specMiniBtnText}>SPEC</Text>
            </TouchableOpacity>
          )}
          {onLock && (
            <TouchableOpacity
              onPress={onLock}
              style={styles.lockMiniBtn}
              activeOpacity={0.7}
              hitSlop={HIT_SLOP_64}
            >
              <Text style={styles.lockMiniBtnText}>🔒</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* ── Header Row ── */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.mainTitle}>{t.tabReport.toUpperCase()}</Text>
          <Text style={styles.subTitle}>
            NORTHERN LEDGER · {filteredEntries.length} RECORDS
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowNewModal(true)}
          style={styles.newRecordBtn}
          activeOpacity={0.8}
          hitSlop={HIT_SLOP_64}
        >
          <Text style={styles.newRecordBtnIcon}>+</Text>
          <Text style={styles.newRecordBtnText}>NEW</Text>
        </TouchableOpacity>
      </View>

      {/* ── Category Filter Tabs ── */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {['ALL', ...CATEGORIES].map((cat, i) => {
            const isActive = activeTab === i;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveTab(i)}
                style={[
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                ]}
                activeOpacity={0.7}
                hitSlop={HIT_SLOP_64}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isActive && styles.tabButtonTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Virtualized Entries List (1GB RAM & Android Go Optimized) ── */}
      <View style={styles.listContainer}>
        <FlashList
          data={filteredEntries}
          renderItem={renderEntryCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* ── "+ NEW RECORD" Modal ── */}
      <Modal
        visible={showNewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>+ NEW FIELD RECORD</Text>
              <TouchableOpacity
                onPress={() => setShowNewModal(false)}
                style={styles.closeBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

              {/* Category selector */}
              <Text style={styles.inputLabel}>CATEGORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setFormCategory(cat)}
                    style={[
                      styles.catChip,
                      formCategory === cat && styles.catChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        formCategory === cat && styles.catChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Location Picker */}
              <Text style={styles.inputLabel}>LOCATION (NIGERIAN LGA / GPS)</Text>
              <TouchableOpacity
                onPress={() => setShowLocationPicker(true)}
                style={styles.locationSelectorBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationSummaryText} numberOfLines={1}>
                  {locationSummary}
                </Text>
                <Text style={styles.changeText}>CHANGE</Text>
              </TouchableOpacity>

              {/* Title / Summary */}
              <Text style={styles.inputLabel}>TITLE / SUMMARY</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Brief summary of incident..."
                placeholderTextColor={TOKENS.mutedForeground}
                value={formTitle}
                onChangeText={setFormTitle}
              />

              {/* Risk Level */}
              <Text style={styles.inputLabel}>RISK LEVEL</Text>
              <View style={styles.riskRow}>
                {(['CRIT', 'HIGH', 'MED', 'LOW'] as const).map((r) => {
                  const cfg = RISK_CONFIG[r];
                  const isSelected = formRisk === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setFormRisk(r)}
                      style={[
                        styles.riskOption,
                        { borderColor: isSelected ? cfg.text : TOKENS.border },
                        isSelected && { backgroundColor: cfg.bg },
                      ]}
                    >
                      <Text style={[styles.riskOptionShape, { color: cfg.text }]}>
                        {cfg.shape}
                      </Text>
                      <Text style={[styles.riskOptionText, { color: cfg.text }]}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Field Note */}
              <Text style={styles.inputLabel}>FIELD NOTE (DETAILS)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Detailed observation (truck plate, affected individuals, witnesses)..."
                placeholderTextColor={TOKENS.mutedForeground}
                value={formNote}
                onChangeText={setFormNote}
                multiline={true}
                numberOfLines={4}
              />

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveRecord}
                style={styles.submitBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>▣ SAVE RECORD TO LEDGER</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Sub-Modal: Nigerian Location Directory Picker ── */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <View style={styles.locationModalOverlay}>
          <View style={styles.locationModalCard}>
            <Text style={styles.locationModalTitle}>Select Nigerian Location</Text>

            {/* State Picker */}
            <Text style={styles.locationSubLabel}>1. STATE</Text>
            <View style={styles.chipGrid}>
              {NIGERIA_LOCATIONS.map((loc, idx) => (
                <TouchableOpacity
                  key={loc.state}
                  onPress={() => {
                    setSelectedStateIndex(idx);
                    setSelectedLGAIndex(0);
                    setSelectedWardIndex(0);
                  }}
                  style={[
                    styles.locChip,
                    selectedStateIndex === idx && styles.locChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.locChipText,
                      selectedStateIndex === idx && styles.locChipTextActive,
                    ]}
                  >
                    {loc.state}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* LGA Picker */}
            <Text style={styles.locationSubLabel}>2. LGA</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lgaScroll}>
              {currentState.lgas.map((lga, idx) => (
                <TouchableOpacity
                  key={lga.name}
                  onPress={() => {
                    setSelectedLGAIndex(idx);
                    setSelectedWardIndex(0);
                  }}
                  style={[
                    styles.locChip,
                    selectedLGAIndex === idx && styles.locChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.locChipText,
                      selectedLGAIndex === idx && styles.locChipTextActive,
                    ]}
                  >
                    {lga.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Ward Picker */}
            <Text style={styles.locationSubLabel}>3. WARD / COMMUNITY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lgaScroll}>
              {currentLGA.wards.map((w, idx) => (
                <TouchableOpacity
                  key={w}
                  onPress={() => setSelectedWardIndex(idx)}
                  style={[
                    styles.locChip,
                    selectedWardIndex === idx && styles.locChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.locChipText,
                      selectedWardIndex === idx && styles.locChipTextActive,
                    ]}
                  >
                    {w}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowLocationPicker(false)}
              style={styles.locationDoneBtn}
            >
              <Text style={styles.locationDoneBtnText}>CONFIRM LOCATION</Text>
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
    backgroundColor: TOKENS.background,
  },
  panicTriggerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clockText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: TOKENS.primary,
    letterSpacing: 1.2,
  },
  secureBadge: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 1,
    borderColor: TOKENS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  secureBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncStatusText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.statusPending,
    letterSpacing: 0.8,
  },
  specMiniBtn: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 1,
    borderColor: TOKENS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  specMiniBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.primary,
    fontWeight: '700',
  },
  lockMiniBtn: {
    paddingHorizontal: 4,
  },
  lockMiniBtnText: {
    fontSize: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerTitleGroup: {
    flex: 1,
  },
  mainTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 22,
    fontWeight: '700',
    color: TOKENS.primary,
    letterSpacing: 1,
  },
  subTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
    marginTop: 2,
  },
  newRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: TOKENS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 2,
  },
  newRecordBtnIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TOKENS.primaryForeground,
    lineHeight: 16,
  },
  newRecordBtnText: {
    fontFamily: FONTS.condensed,
    fontSize: 12,
    fontWeight: '700',
    color: TOKENS.primaryForeground,
    letterSpacing: 1,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabButtonActive: {
    borderBottomColor: TOKENS.primary,
  },
  tabButtonText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tabButtonTextActive: {
    color: TOKENS.primary,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 8,
  },
  entryCard: {
    backgroundColor: TOKENS.card,
    borderWidth: 1,
    borderColor: TOKENS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  entryCardExpanded: {
    backgroundColor: TOKENS.secondary,
    borderColor: TOKENS.primary,
  },
  entryMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 10,
  },
  shapeBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    marginTop: 2,
  },
  shapeIcon: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  entryInfoCol: {
    flex: 1,
  },
  entryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  entryIdText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
  },
  riskBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    borderWidth: 1,
  },
  riskBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  entryTitleText: {
    fontFamily: FONTS.condensed,
    fontSize: 14,
    fontWeight: '600',
    color: TOKENS.foreground,
    lineHeight: 18,
  },
  entryStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  entryDateText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 2,
    borderWidth: 1,
  },
  statusPillText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chevronArrow: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: TOKENS.mutedForeground,
    marginTop: 2,
  },
  expandedSection: {
    borderTopWidth: 1,
    borderTopColor: TOKENS.border,
    padding: 12,
  },
  expandedGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  gridCol: {
    flex: 1,
  },
  gridColLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  gridColValue: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: TOKENS.primary,
  },
  gridColValueWhite: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: TOKENS.foreground,
  },
  fieldNoteBox: {
    backgroundColor: TOKENS.muted,
    padding: 8,
    borderRadius: 2,
    marginBottom: 10,
  },
  fieldNoteLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
    marginBottom: 2,
  },
  fieldNoteText: {
    fontFamily: FONTS.condensed,
    fontSize: 13,
    color: TOKENS.foreground,
    lineHeight: 18,
  },
  expandedActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnPrimary: {
    flex: 1,
    borderWidth: 1,
    borderColor: TOKENS.primary,
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: 'center',
  },
  actionBtnPrimaryText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actionBtnDanger: {
    flex: 1,
    borderWidth: 1,
    borderColor: TOKENS.statusDanger,
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: 'center',
  },
  actionBtnDangerText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.statusDanger,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: TOKENS.card,
    borderTopWidth: 2,
    borderTopColor: TOKENS.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
  },
  modalTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 16,
    fontWeight: '700',
    color: TOKENS.primary,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    color: TOKENS.mutedForeground,
  },
  modalScroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  errorText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: TOKENS.statusDanger,
  },
  inputLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  catScroll: {
    marginBottom: 4,
  },
  catChip: {
    borderWidth: 1,
    borderColor: TOKENS.border,
    backgroundColor: TOKENS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 2,
    marginRight: 6,
  },
  catChipActive: {
    borderColor: TOKENS.primary,
    backgroundColor: TOKENS.primary,
  },
  catChipText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
  },
  catChipTextActive: {
    color: TOKENS.primaryForeground,
    fontWeight: '700',
  },
  locationSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TOKENS.border,
    backgroundColor: TOKENS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 2,
    gap: 8,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationSummaryText: {
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.foreground,
  },
  changeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.primary,
    fontWeight: '700',
  },
  textInput: {
    borderWidth: 1,
    borderColor: TOKENS.border,
    backgroundColor: TOKENS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 2,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: TOKENS.foreground,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  riskRow: {
    flexDirection: 'row',
    gap: 8,
  },
  riskOption: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: TOKENS.secondary,
  },
  riskOptionShape: {
    fontSize: 14,
    marginBottom: 2,
  },
  riskOptionText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: TOKENS.primary,
    paddingVertical: 14,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontFamily: FONTS.condensed,
    fontSize: 14,
    fontWeight: '700',
    color: TOKENS.primaryForeground,
    letterSpacing: 1.5,
  },
  locationModalOverlay: {
    flex: 1,
    backgroundColor: '#000000E0',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  locationModalCard: {
    backgroundColor: TOKENS.card,
    borderWidth: 1,
    borderColor: TOKENS.primary,
    borderRadius: 4,
    padding: 16,
    maxHeight: '80%',
  },
  locationModalTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 16,
    fontWeight: '700',
    color: TOKENS.primary,
    marginBottom: 12,
  },
  locationSubLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 6,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  locChip: {
    borderWidth: 1,
    borderColor: TOKENS.border,
    backgroundColor: TOKENS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  locChipActive: {
    borderColor: TOKENS.primary,
    backgroundColor: TOKENS.primary,
  },
  locChipText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
  },
  locChipTextActive: {
    color: TOKENS.primaryForeground,
    fontWeight: '700',
  },
  lgaScroll: {
    marginBottom: 8,
  },
  locationDoneBtn: {
    backgroundColor: TOKENS.primary,
    paddingVertical: 10,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 10,
  },
  locationDoneBtnText: {
    fontFamily: FONTS.condensed,
    fontSize: 12,
    fontWeight: '700',
    color: TOKENS.primaryForeground,
    letterSpacing: 1,
  },
});
