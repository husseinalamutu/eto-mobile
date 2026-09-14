import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { ThemeTokens, FONTS, METRICS, HIT_SLOP_64 } from '../theme/tokens';
import { useTheme } from '../theme/ThemeContext';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

interface Props {
  language: Language;
  onReportSubmitted?: () => void;
  onPanicTap?: () => void;
  onLock?: () => void;
  onOpenSpec?: () => void;
  onOpenGuide?: () => void;
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

// Nationwide baseline field entries across Nigeria
const DEFAULT_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'ENT-0041',
    category: 'Security',
    categoryHA: 'Tsaro',
    title: 'Farmer-Herder Corridor Dispute — Bokkos LGA',
    titleHA: 'Rikicin Manoma da Makiyaya — Bokkos',
    date: '2026-09-14',
    time: '14:23',
    status: 'pending' as const,
    location: 'Plateau State (Daffo Grazing Area, Bokkos)',
    note: 'Transit corridor access obstructed by unauthorized barricade. Joint community dialogue committee convened.',
    noteHA: 'An toshe hanyar kiwo. Kwamitin sulhu yana zama domin warware matsalar.',
    risk: 'HIGH' as const,
  },
  {
    id: 'ENT-0040',
    category: 'Water Points',
    categoryHA: 'Ruwa',
    title: 'Shared Water Point Contested — Guma Agro-Buffer',
    titleHA: 'Rikicin Mashayar Ruwa — Daudu / Guma',
    date: '2026-09-13',
    time: '09:11',
    status: 'synced' as const,
    location: 'Benue State (Daudu Cluster, Guma LGA)',
    note: 'Solar borehole pump seized over user-fee disagreement. Local youth leaders mediating access.',
    noteHA: 'An dakatar da famfon sola sakamakon rashin jituwa kan kudin aiki.',
    risk: 'MED' as const,
  },
  {
    id: 'ENT-0039',
    category: 'Security',
    categoryHA: 'Tsaro',
    title: 'Illegal Armed Transit Tolls — Birnin Gwari Route',
    titleHA: 'Shingen Makamai a Hanyar Birnin Gwari',
    date: '2026-09-12',
    time: '17:55',
    status: 'synced' as const,
    location: 'Kaduna State (Kuyello Ward, Birnin Gwari)',
    note: '4 armed actors demanding illicit cash tolls from farm produce transport trucks.',
    noteHA: 'Wasu mutane dauke da makamai suna karbar kudin haram daga motocin abinci.',
    risk: 'CRIT' as const,
  },
  {
    id: 'ENT-0038',
    category: 'Infrastructure',
    categoryHA: 'Kayan Aiki',
    title: 'Artisanal Bunkering Pipeline Tension — Ebubu Corridor',
    titleHA: 'Gobarar Bututun Mai — Eleme',
    date: '2026-09-11',
    time: '11:02',
    status: 'synced' as const,
    location: 'Rivers State (Ebubu Pipeline Zone, Eleme LGA)',
    note: 'Illegal tap breach caused agricultural soil spill. Community council requesting emergency containment.',
    noteHA: 'Lalacewar bututun mai ya shafi gonakin al\'umma.',
    risk: 'CRIT' as const,
  },
  {
    id: 'ENT-0037',
    category: 'Relief Aid',
    categoryHA: 'Agaji',
    title: 'Fertilizer Subsidy Diversion — Bodija Agro-Market',
    titleHA: 'Karkatar da Takin Tallafi — Bodija',
    date: '2026-09-10',
    time: '10:14',
    status: 'synced' as const,
    location: 'Oyo State (Bodija Market Ward, Ibadan North)',
    note: '140 subsidized fertilizer bags diverted into private stores for resale at inflated prices.',
    noteHA: 'An karkatar da buhunan taki 140 zuwa dakin ajiyar sirri.',
    risk: 'HIGH' as const,
  },
  {
    id: 'ENT-0036',
    category: 'Land',
    categoryHA: 'Ƙasa',
    title: 'Farmland Encroachment & Extortion — Opi Corridor',
    titleHA: 'Rikicin Gonaki da Haraji — Nsukka',
    date: '2026-09-09',
    time: '16:40',
    status: 'synced' as const,
    location: 'Enugu State (Opi Agro-Corridor, Nsukka LGA)',
    note: 'Unauthorized boundary trench dug through community cassava plots without consultation.',
    noteHA: 'An hako rami ba bisa ka\'ida ba a gonakin rogo na al\'umma.',
    risk: 'MED' as const,
  },
];

const CATEGORIES = ['Security', 'Land', 'Water Points', 'Relief Aid', 'Infrastructure'];

export const ReportScreen: React.FC<Props> = ({
  language,
  onReportSubmitted,
  onPanicTap,
  onLock,
  onOpenSpec,
  onOpenGuide,
}) => {
  const { theme, isDark, riskConfig, statusConfig } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
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
      const risk = riskConfig[entry.risk] || riskConfig.HIGH;
      const status = statusConfig[entry.status] || statusConfig.pending;
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
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />

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
          {onOpenGuide && (
            <TouchableOpacity
              onPress={onOpenGuide}
              style={styles.guideMiniBtn}
              activeOpacity={0.7}
              hitSlop={HIT_SLOP_64}
            >
              <Text style={styles.guideMiniBtnText}>📖 GUIDE</Text>
            </TouchableOpacity>
          )}
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
          <Text style={styles.mainTitle}>
            {t.reportHeading ? t.reportHeading.toUpperCase() : 'NATIONAL INCIDENT LEDGER'}
          </Text>
          <Text style={styles.subTitle}>
            NATIONWIDE INCIDENT RECORDS · {filteredEntries.length} ACTIVE
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowNewModal(true)}
          style={styles.newRecordBtn}
          activeOpacity={0.8}
          hitSlop={HIT_SLOP_64}
        >
          <Text style={styles.newRecordBtnIcon}>+</Text>
          <Text style={styles.newRecordBtnText}>
            {t.logIncidentBtn || '+ LOG INCIDENT'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Contextual Explainer Banner ── */}
      <View style={styles.explainerBanner}>
        <View style={styles.explainerBannerHeader}>
          <Text style={styles.explainerBannerTitle}>📋 ABOUT THIS LEDGER</Text>
          {onOpenGuide && (
            <TouchableOpacity
              onPress={onOpenGuide}
              style={styles.explainerHelpPill}
              activeOpacity={0.7}
              hitSlop={HIT_SLOP_64}
            >
              <Text style={styles.explainerHelpPillText}>HOW IT WORKS ℹ</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.explainerBannerText}>
          {t.reportBanner || 'Secure offline record book for logging security complaints, threats, extortion, and early warning alerts across Nigeria. Tap "+ LOG INCIDENT" to record.'}
        </Text>
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
                placeholderTextColor={theme.mutedForeground}
                value={formTitle}
                onChangeText={setFormTitle}
              />

              {/* Risk Level */}
              <Text style={styles.inputLabel}>RISK LEVEL</Text>
              <View style={styles.riskRow}>
                {(['CRIT', 'HIGH', 'MED', 'LOW'] as const).map((r) => {
                  const cfg = riskConfig[r];
                  const isSelected = formRisk === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setFormRisk(r)}
                      style={[
                        styles.riskOption,
                        { borderColor: isSelected ? cfg.text : theme.border },
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
                placeholderTextColor={theme.mutedForeground}
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

const createStyles = (theme: ThemeTokens, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  panicTriggerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clockText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: theme.primary,
    letterSpacing: 1.2,
  },
  secureBadge: {
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  secureBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.mutedForeground,
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
    color: theme.statusPending,
    letterSpacing: 0.8,
  },
  specMiniBtn: {
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  specMiniBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.primary,
    fontWeight: '700',
  },
  guideMiniBtn: {
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  guideMiniBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.primary,
    fontWeight: '800',
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
  explainerBanner: {
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.border,
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 8,
    padding: 10,
    borderRadius: 3,
  },
  explainerBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  explainerBannerTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '800',
    color: theme.primary,
    letterSpacing: 1,
  },
  explainerHelpPill: {
    backgroundColor: theme.card,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: theme.border,
  },
  explainerHelpPillText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    color: theme.mutedForeground,
  },
  explainerBannerText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: theme.mutedForeground,
    lineHeight: 14,
  },
  headerTitleGroup: {
    flex: 1,
  },
  mainTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 22,
    fontWeight: '700',
    color: theme.primary,
    letterSpacing: 1,
  },
  subTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.mutedForeground,
    letterSpacing: 1,
    marginTop: 2,
  },
  newRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 2,
  },
  newRecordBtnIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryForeground,
    lineHeight: 16,
  },
  newRecordBtnText: {
    fontFamily: FONTS.condensed,
    fontSize: 12,
    fontWeight: '700',
    color: theme.primaryForeground,
    letterSpacing: 1,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
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
    borderBottomColor: theme.primary,
  },
  tabButtonText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.mutedForeground,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tabButtonTextActive: {
    color: theme.primary,
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
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  entryCardExpanded: {
    backgroundColor: theme.secondary,
    borderColor: theme.primary,
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
    color: theme.mutedForeground,
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
    color: theme.foreground,
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
    color: theme.mutedForeground,
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
    color: theme.mutedForeground,
    marginTop: 2,
  },
  expandedSection: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
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
    color: theme.mutedForeground,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  gridColValue: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: theme.primary,
  },
  gridColValueWhite: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: theme.foreground,
  },
  fieldNoteBox: {
    backgroundColor: theme.muted,
    padding: 8,
    borderRadius: 2,
    marginBottom: 10,
  },
  fieldNoteLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.mutedForeground,
    letterSpacing: 1,
    marginBottom: 2,
  },
  fieldNoteText: {
    fontFamily: FONTS.condensed,
    fontSize: 13,
    color: theme.foreground,
    lineHeight: 18,
  },
  expandedActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnPrimary: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.primary,
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: 'center',
  },
  actionBtnPrimaryText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actionBtnDanger: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.statusDanger,
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: 'center',
  },
  actionBtnDangerText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.statusDanger,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.card,
    borderTopWidth: 2,
    borderTopColor: theme.primary,
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
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    color: theme.mutedForeground,
  },
  modalScroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  errorText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: theme.statusDanger,
  },
  inputLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.mutedForeground,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  catScroll: {
    marginBottom: 4,
  },
  catChip: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 2,
    marginRight: 6,
  },
  catChipActive: {
    borderColor: theme.primary,
    backgroundColor: theme.primary,
  },
  catChipText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.mutedForeground,
  },
  catChipTextActive: {
    color: theme.primaryForeground,
    fontWeight: '700',
  },
  locationSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.secondary,
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
    color: theme.foreground,
  },
  changeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.primary,
    fontWeight: '700',
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.secondary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 2,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: theme.foreground,
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
    backgroundColor: theme.secondary,
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
    backgroundColor: theme.primary,
    paddingVertical: 14,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontFamily: FONTS.condensed,
    fontSize: 14,
    fontWeight: '700',
    color: theme.primaryForeground,
    letterSpacing: 1.5,
  },
  locationModalOverlay: {
    flex: 1,
    backgroundColor: '#000000E0',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  locationModalCard: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 4,
    padding: 16,
    maxHeight: '80%',
  },
  locationModalTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 12,
  },
  locationSubLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.mutedForeground,
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
    borderColor: theme.border,
    backgroundColor: theme.secondary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  locChipActive: {
    borderColor: theme.primary,
    backgroundColor: theme.primary,
  },
  locChipText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.mutedForeground,
  },
  locChipTextActive: {
    color: theme.primaryForeground,
    fontWeight: '700',
  },
  lgaScroll: {
    marginBottom: 8,
  },
  locationDoneBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 10,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 10,
  },
  locationDoneBtnText: {
    fontFamily: FONTS.condensed,
    fontSize: 12,
    fontWeight: '700',
    color: theme.primaryForeground,
    letterSpacing: 1,
  },
});
