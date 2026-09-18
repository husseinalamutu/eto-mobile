import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { Opportunity, Language } from '../types';
import { translations } from '../i18n/translations';
import { toggleBookmark, getBookmarkedIds } from '../db';
import opportunitiesData from '../../assets/data/opportunities.json';
import { ThemeTokens, FONTS, METRICS, HIT_SLOP_64 } from '../theme/tokens';
import { useTheme } from '../theme/ThemeContext';
import { FlashList } from '@shopify/flash-list';

interface OpportunityScreenProps {
  language: Language;
}

const STATES = ['All', 'Kano', 'Kaduna', 'Borno', 'Katsina', 'Oyo', 'Enugu'];
const CATEGORIES = ['All', 'Agriculture', 'Legal Aid', 'Peace Grant', 'Civic Oversight'];

export const OpportunityScreen: React.FC<OpportunityScreenProps> = ({ language }) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
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
    <View style={styles.safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} translucent={false} />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.screenHeading}>{t.oppHeading.toUpperCase()}</Text>
          <TouchableOpacity
            style={[styles.bookmarkFilterBtn, showBookmarksOnly && styles.bookmarkFilterBtnActive]}
            onPress={() => setShowBookmarksOnly(!showBookmarksOnly)}
            hitSlop={HIT_SLOP_64}
          >
            <Text style={[styles.bookmarkFilterText, showBookmarksOnly && styles.bookmarkFilterTextActive]}>
              ⭐ {showBookmarksOnly ? t.bookmarked : t.bookmark} ({bookmarkedIds.length})
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.screenSubheading}>{t.oppSubheading}</Text>
      </View>

      {/* Explanatory Contextual Banner */}
      <View style={styles.explainerBanner}>
        <Text style={styles.explainerBannerTitle}>🤝 COMMUNITY PEACE OPPORTUNITIES</Text>
        <Text style={styles.explainerBannerText}>
          {t.oppBanner || 'Verified community peace grants, legal aid, agricultural subsidies, and youth vocational programs across Nigerian communities.'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={theme.mutedForeground}
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

      {/* Opportunities List (1GB RAM & Android Go Optimized) */}
      <FlashList
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
                  hitSlop={HIT_SLOP_64}
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
                    {t.claimProtocol.toUpperCase()} ({item.actionable_steps.length})
                  </Text>
                  <TouchableOpacity onPress={() => toggleExpand(item.id)} hitSlop={HIT_SLOP_64}>
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
                    hitSlop={HIT_SLOP_64}
                  >
                    <Text style={styles.moreStepsText}>
                      +{item.actionable_steps.length - 2} more steps. Tap to expand.
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.actionButtonBar}>
                <TouchableOpacity
                  style={styles.smsShareBtn}
                  onPress={() => handleShareSMS(item)}
                  hitSlop={HIT_SLOP_64}
                >
                  <Text style={styles.smsShareText}>📡 {t.shareSMS}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{t.noOppTitle}</Text>
            <Text style={styles.emptySub}>
              {t.noOppSub}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const createStyles = (theme: ThemeTokens, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenHeading: {
    fontFamily: FONTS.condensed,
    fontSize: 20,
    fontWeight: '700',
    color: theme.primary,
    letterSpacing: 1,
  },
  screenSubheading: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.mutedForeground,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  bookmarkFilterBtn: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: theme.border,
  },
  bookmarkFilterBtnActive: {
    borderColor: theme.primary,
    backgroundColor: theme.muted,
  },
  bookmarkFilterText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: theme.mutedForeground,
  },
  bookmarkFilterTextActive: {
    color: theme.primary,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: theme.secondary,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: theme.foreground,
    borderWidth: 1,
    borderColor: theme.border,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 24,
    top: 14,
    padding: 2,
  },
  clearSearchText: {
    color: theme.mutedForeground,
    fontSize: 13,
    fontWeight: 'bold',
  },
  explainerBanner: {
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.border,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    padding: 10,
    borderRadius: 3,
  },
  explainerBannerTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '800',
    color: theme.primary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  explainerBannerText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: theme.mutedForeground,
    lineHeight: 14,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 3,
  },
  filterLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    color: theme.mutedForeground,
    marginRight: 6,
    minWidth: 40,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  filterChip: {
    backgroundColor: theme.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterChipText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.mutedForeground,
  },
  filterChipTextActive: {
    color: theme.primaryForeground,
    fontWeight: '700',
  },
  listContent: {
    padding: 14,
    paddingBottom: 32,
    gap: 10,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 2,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    color: theme.primary,
    letterSpacing: 0.5,
  },
  locationBadge: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: theme.border,
  },
  locationBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.mutedForeground,
  },
  genderBadge: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  genderBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: theme.mutedForeground,
  },
  bookmarkIconButton: {
    marginLeft: 'auto',
    padding: 2,
  },
  bookmarkIconText: {
    fontSize: 16,
    color: theme.primary,
  },
  cardTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 15,
    fontWeight: '700',
    color: theme.foreground,
    lineHeight: 20,
  },
  cardOrg: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: theme.primary,
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  verifiedTag: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.statusSynced,
    fontWeight: '600',
  },
  sourceTag: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.mutedForeground,
  },
  stepsContainer: {
    marginTop: 10,
    backgroundColor: theme.muted,
    borderRadius: 2,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepsTitle: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    color: theme.primary,
    letterSpacing: 1,
  },
  expandButtonText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: theme.primary,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  stepNumberBadge: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: theme.secondary,
    borderWidth: 1,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: theme.primary,
  },
  stepDescription: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: theme.foreground,
    lineHeight: 16,
  },
  moreStepsHint: {
    marginTop: 2,
    paddingVertical: 2,
  },
  moreStepsText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: theme.primary,
  },
  actionButtonBar: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  smsShareBtn: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: theme.border,
  },
  smsShareText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: theme.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 16,
    fontWeight: '700',
    color: theme.foreground,
  },
  emptySub: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: theme.mutedForeground,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
});
