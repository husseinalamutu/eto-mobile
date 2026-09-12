import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Opportunity } from '../types';
import opportunitiesData from '../../assets/data/opportunities.json';

const STATES = ['All', 'Kano', 'Kaduna', 'Borno'];
const GENDERS = ['All', 'Female', 'Male'];
const CATEGORIES = ['All', 'Agriculture', 'Legal Aid', 'Peace Grant'];

export const OpportunityScreen: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const opportunities: Opportunity[] = opportunitiesData as Opportunity[];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      // State filter
      const matchesState =
        selectedState === 'All' ||
        item.target_state === selectedState ||
        item.target_state === 'All';

      // Gender filter
      const matchesGender =
        selectedGender === 'All' ||
        item.target_gender === selectedGender ||
        item.target_gender === 'All';

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      // Keyword search
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.organization.toLowerCase().includes(q) ||
        item.actionable_steps.some((s) => s.toLowerCase().includes(q));

      return matchesState && matchesGender && matchesCategory && matchesQuery;
    });
  }, [opportunities, selectedState, selectedGender, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderOpportunityCard = ({ item }: { item: Opportunity }) => {
    const isExpanded = expandedId === item.id;

    return (
      <View style={styles.card}>
        {/* Top Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
          <View style={styles.locationBadge}>
            <Text style={styles.locationBadgeText}>📍 {item.target_state}</Text>
          </View>
          {item.target_gender !== 'All' && (
            <View style={styles.genderBadge}>
              <Text style={styles.genderBadgeText}>{item.target_gender} Only</Text>
            </View>
          )}
        </View>

        {/* Title and Org */}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardOrg}>🏛️ {item.organization}</Text>

        {/* Verification Meta */}
        <View style={styles.metaRow}>
          <Text style={styles.verifiedTag}>✓ Verified: {item.verification_date}</Text>
          <Text style={styles.sourceTag}>Offline Validated</Text>
        </View>

        {/* Actionable Steps Section */}
        <View style={styles.stepsContainer}>
          <View style={styles.stepsHeader}>
            <Text style={styles.stepsTitle}>
              ACTIONABLE CLAIM STEPS ({item.actionable_steps.length})
            </Text>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.expandButtonText}>
                {isExpanded ? 'Collapse' : 'View Full Protocol'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show first step or all if expanded */}
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
                +{item.actionable_steps.length - 2} more verified steps. Tap to expand.
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenHeading}>Offline Opportunity Engine</Text>
        <Text style={styles.screenSubheading}>
          Pre-cached civic grants, input subsidies & legal aid for the Sahel
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by keyword, ward, or topic..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips: State */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>STATE:</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STATES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedState === item;
            return (
              <TouchableOpacity
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedState(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Filter Chips: Category */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>TYPE:</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Opportunities List */}
      <FlatList
        data={filteredOpportunities}
        keyExtractor={(item) => item.id}
        renderItem={renderOpportunityCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No matching opportunities</Text>
            <Text style={styles.emptySub}>
              Adjust your filters or clear your search term to see cached listings.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  screenSubheading: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  searchWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 12,
    top: 10,
    padding: 2,
  },
  clearSearchText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 8,
    minWidth: 44,
  },
  filterChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#0369A1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0F2FE',
  },
  locationBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  genderBadge: {
    backgroundColor: '#701A75',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  genderBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FDF4FF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 22,
  },
  cardOrg: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  verifiedTag: {
    fontSize: 11,
    color: '#4ADE80',
    fontWeight: '600',
  },
  sourceTag: {
    fontSize: 11,
    color: '#94A3B8',
  },
  stepsContainer: {
    marginTop: 12,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.6,
  },
  expandButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepDescription: {
    flex: 1,
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  moreStepsHint: {
    marginTop: 4,
    paddingVertical: 4,
  },
  moreStepsText: {
    fontSize: 12,
    color: '#38BDF8',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  emptySub: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
});
