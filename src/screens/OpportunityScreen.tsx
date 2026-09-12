import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Opportunity, Language } from '../types';
import { translations } from '../i18n/translations';
import { toggleBookmark, getBookmarkedIds } from '../db';
import opportunitiesData from '../../assets/data/opportunities.json';

interface OpportunityScreenProps {
  language: Language;
}

const STATES = ['All', 'Kano', 'Kaduna', 'Borno', 'Katsina'];
const CATEGORIES = ['All', 'Agriculture', 'Legal Aid', 'Peace Grant', 'Civic Oversight'];

export const OpportunityScreen: React.FC<OpportunityScreenProps> = ({ language }) => {
  const t = translations[language];
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const opportunities: Opportunity[] = opportunitiesData as Opportunity[];

  const loadBookmarks = useCallback(async () => {
    try {
      const ids = await getBookmarkedIds();
      setBookmarkedIds(ids);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleToggleBookmark = async (id: string) => {
    try {
      const isSaved = await toggleBookmark(id);
      setBookmarkedIds((prev) =>
        isSaved ? [...prev, id] : prev.filter((bId) => bId !== id)
      );
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleShareSMS = (item: Opportunity) => {
    const text = `ETO CIVIC NOTICE: ${item.title} (${item.organization}). Verified: ${item.verification_date}. Steps: 1. ${item.actionable_steps[0]} 2. ${item.actionable_steps[1] || ''}`;
    Alert.alert(
      t.shareSMS,
      `SMS Broadcast Payload (${text.length} chars):\n\n"${text}"\n\nReady for 2G SMS dispatch or Bluetooth beaming.`,
      [{ text: 'OK' }]
    );
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      const matchesState =
        selectedState === 'All' || item.target_state === selectedState || item.target_state === 'All';
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesBookmark = !showBookmarksOnly || bookmarkedIds.includes(item.id);

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.organization.toLowerCase().includes(q) ||
        item.actionable_steps.some((s) => s.toLowerCase().includes(q));

      return matchesState && matchesCategory && matchesBookmark && matchesQuery;
    });
  }, [opportunities, selectedState, selectedCategory, showBookmarksOnly, bookmarkedIds, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.screenHeading}>{t.oppHeading}</Text>
          <TouchableOpacity
            style={[styles.bookmarkFilterBtn, showBookmarksOnly && styles.bookmarkFilterBtnActive]}
            onPress={() => setShowBookmarksOnly(!showBookmarksOnly)}
          >
            <Text style={[styles.bookmarkFilterText, showBookmarksOnly && styles.bookmarkFilterTextActive]}>
              ⭐ {showBookmarksOnly ? t.bookmarked : t.bookmark} ({bookmarkedIds.length})
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.screenSubheading}>{t.oppSubheading}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchPlaceholder}
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* State Filter Chips */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>{t.filterState}</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STATES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedState === item && styles.filterChipActive]}
              onPress={() => setSelectedState(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedState === item && styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Category Filter Chips */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>{t.filterType}</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedCategory === item && styles.filterChipActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === item && styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Opportunities List */}
      <FlatList
        data={filteredOpportunities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          const isBookmarked = bookmarkedIds.includes(item.id);

          return (
            <View style={styles.card}>
              <View style={styles.badgeRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
                <View style={styles.locationBadge}>
                  <Text style={styles.locationBadgeText}>📍 {item.target_state}</Text>
                </View>
                {item.target_gender !== 'All' && (
                  <View style={styles.genderBadge}>
                    <Text style={styles.genderBadgeText}>{item.target_gender}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.bookmarkIconButton}
                  onPress={() => handleToggleBookmark(item.id)}
                >
                  <Text style={styles.bookmarkIconText}>{isBookmarked ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardOrg}>🏛️ {item.organization}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.verifiedTag}>{t.verifiedTag} {item.verification_date}</Text>
                <Text style={styles.sourceTag}>{t.offlineTag}</Text>
              </View>

              {/* Actionable Steps Protocol */}
              <View style={styles.stepsContainer}>
                <View style={styles.stepsHeader}>
                  <Text style={styles.stepsTitle}>
                    {t.claimProtocol} ({item.actionable_steps.length})
                  </Text>
                  <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                    <Text style={styles.expandButtonText}>
                      {isExpanded ? t.collapse : t.viewAll}
                    </Text>
                  </TouchableOpacity>
                </View>

                {(isExpanded ? item.actionable_steps : item.actionable_steps.slice(0, 2)).map(
                  (step, idx) => (
                    <View key={idx} style={styles.stepItem}>
                      <View style={styles.stepNumberBadge}>
                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepDescription}>{step}</Text>
                    </View>
                  )
                )}

                {!isExpanded && item.actionable_steps.length > 2 && (
                  <TouchableOpacity
                    style={styles.moreStepsHint}
                    onPress={() => toggleExpand(item.id)}
                  >
                    <Text style={styles.moreStepsText}>
                      +{item.actionable_steps.length - 2} more steps. Tap to expand.
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Quick Share SMS Bar */}
                <View style={styles.actionButtonBar}>
                  <TouchableOpacity
                    style={styles.smsShareBtn}
                    onPress={() => handleShareSMS(item)}
                  >
                    <Text style={styles.smsShareText}>📲 {t.shareSMS}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{t.noOppTitle}</Text>
            <Text style={styles.emptySub}>{t.noOppSub}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  screenHeading: { fontSize: 18, fontWeight: '800', color: '#F8FAFC', flex: 1 },
  bookmarkFilterBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bookmarkFilterBtnActive: {
    backgroundColor: '#0369A1',
    borderColor: '#38BDF8',
  },
  bookmarkFilterText: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  bookmarkFilterTextActive: { color: '#FFFFFF' },
  screenSubheading: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  searchWrapper: { marginHorizontal: 16, marginTop: 6, marginBottom: 6, position: 'relative' },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
  },
  clearSearchBtn: { position: 'absolute', right: 10, top: 8, padding: 2 },
  clearSearchText: { color: '#94A3B8', fontSize: 13, fontWeight: 'bold' },
  filterSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginVertical: 3 },
  filterLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', marginRight: 6, minWidth: 40 },
  filterChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: { backgroundColor: '#0284C7', borderColor: '#38BDF8' },
  filterChipText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  filterChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8, alignItems: 'center' },
  categoryBadge: { backgroundColor: '#0369A1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  categoryBadgeText: { fontSize: 10, fontWeight: '700', color: '#E0F2FE' },
  locationBadge: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  locationBadgeText: { fontSize: 10, fontWeight: '600', color: '#CBD5E1' },
  genderBadge: { backgroundColor: '#701A75', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  genderBadgeText: { fontSize: 10, fontWeight: '600', color: '#FDF4FF' },
  bookmarkIconButton: { marginLeft: 'auto', padding: 2 },
  bookmarkIconText: { fontSize: 16, color: '#FBBF24' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', lineHeight: 20 },
  cardOrg: { fontSize: 11, color: '#38BDF8', fontWeight: '600', marginTop: 3 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  verifiedTag: { fontSize: 10, color: '#4ADE80', fontWeight: '600' },
  sourceTag: { fontSize: 10, color: '#94A3B8' },
  stepsContainer: {
    marginTop: 10,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  stepsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stepsTitle: { fontSize: 10, fontWeight: '800', color: '#F59E0B', letterSpacing: 0.5 },
  expandButtonText: { fontSize: 10, fontWeight: '700', color: '#38BDF8' },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  stepNumberBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginTop: 2,
  },
  stepNumberText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  stepDescription: { flex: 1, fontSize: 12, color: '#E2E8F0', lineHeight: 16 },
  moreStepsHint: { marginTop: 2, paddingVertical: 2 },
  moreStepsText: { fontSize: 11, color: '#38BDF8', fontStyle: 'italic' },
  actionButtonBar: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  smsShareBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  smsShareText: { fontSize: 10, fontWeight: '700', color: '#38BDF8' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC' },
  emptySub: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },
});
