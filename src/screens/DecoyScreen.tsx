import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface DecoyScreenProps {
  onLock: () => void;
}

const REGIONS = [
  { name: 'Kano', temp: '39°C', condition: 'Dry Haze & Harmattan Dust', humidity: '14%', wind: '19 km/h NE' },
  { name: 'Maiduguri', temp: '41°C', condition: 'Severe Heat & Sandy Wind', humidity: '11%', wind: '22 km/h E' },
  { name: 'Sokoto', temp: '40°C', condition: 'Intense Sunlight & Aridity', humidity: '12%', wind: '16 km/h NE' },
  { name: 'Kaduna', temp: '34°C', condition: 'Partly Cloudy & Dry Breeze', humidity: '26%', wind: '14 km/h N' },
];

const COMMODITIES = [
  { name: 'White Maize (Masara)', unitPrice: 78500, priceStr: '₦78,500', market: 'Dawanau Market, Kano', change: '+2.1%', trend: 'up' },
  { name: 'Brown Sorghum (Dawa)', unitPrice: 82000, priceStr: '₦82,000', market: 'Dawanau Market, Kano', change: '-0.5%', trend: 'down' },
  { name: 'Pearl Millet (Maiwa)', unitPrice: 75000, priceStr: '₦75,000', market: 'Monday Market, Maiduguri', change: '0.0%', trend: 'flat' },
  { name: 'White Cowpeas (Wake)', unitPrice: 118000, priceStr: '₦118,000', market: 'Kafanchan Market, Kaduna', change: '+4.3%', trend: 'up' },
  { name: 'Soya Beans (Waken Soya)', unitPrice: 94000, priceStr: '₦94,000', market: 'Dawanau Market, Kano', change: '-1.2%', trend: 'down' },
  { name: 'Unshelled Groundnut (Gyaɗa)', unitPrice: 62000, priceStr: '₦62,000', market: 'Funtua Market, Katsina', change: '+1.8%', trend: 'up' },
];

const MARKET_DAYS = [
  { market: 'Dawanau Grains Market (Kano)', day: 'Every Thursday', focus: 'West Africa Wholesale Hub' },
  { market: 'Maiduguri Monday Market', day: 'Every Monday', focus: 'Lake Chad Basin Livestock & Grain' },
  { market: 'Funtua Regional Market (Katsina)', day: 'Every Friday', focus: 'Cotton, Maize & Groundnut' },
  { market: 'Kachia Central Market (Kaduna)', day: 'Every Saturday', focus: 'Ginger & Agro-Pastoral Trade' },
];

export const DecoyScreen: React.FC<DecoyScreenProps> = ({ onLock }) => {
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(0);
  const [calculatorCropIdx, setCalculatorCropIdx] = useState<number>(0);
  const [quantityBags, setQuantityBags] = useState<string>('5');

  const currentRegion = REGIONS[selectedRegionIndex];
  const selectedCrop = COMMODITIES[calculatorCropIdx];
  const numBags = Math.max(1, parseInt(quantityBags || '1', 10) || 1);
  const calculatedTotal = (selectedCrop.unitPrice * numBags).toLocaleString();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#14532D" />

      {/* Disguised Extension Header */}
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitle}>🌾 Sahel AgriWeather & Grain Bulletin</Text>
          <Text style={styles.brandSubtitle}>NAERLS Agro-Extension & Market Monitor (Offline Cache)</Text>
        </View>
        <TouchableOpacity style={styles.lockButton} onPress={onLock} activeOpacity={0.8}>
          <Text style={styles.lockButtonText}>Lock</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Radio Broadcast Cache Tag */}
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheStatus}>● OFFLINE RADIO WEATHER CACHE VALIDATED</Text>
          <Text style={styles.cacheTime}>Synced via Sahel Agro-FM broadcast • 06:30 AM</Text>
        </View>

        {/* Region Selector Pills */}
        <View style={styles.regionPillRow}>
          {REGIONS.map((reg, idx) => {
            const isSelected = idx === selectedRegionIndex;
            return (
              <TouchableOpacity
                key={reg.name}
                style={[styles.regionPill, isSelected && styles.regionPillActive]}
                onPress={() => setSelectedRegionIndex(idx)}
              >
                <Text style={[styles.regionPillText, isSelected && styles.regionPillTextActive]}>
                  {reg.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Weather Advisory Card */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherLocation}>{currentRegion.name} Agro-Zone</Text>
            <Text style={styles.weatherTemp}>{currentRegion.temp}</Text>
          </View>
          <Text style={styles.weatherCondition}>{currentRegion.condition}</Text>

          <View style={styles.weatherMetrics}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Air Humidity</Text>
              <Text style={styles.metricValue}>{currentRegion.humidity}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Wind Vector</Text>
              <Text style={styles.metricValue}>{currentRegion.wind}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Soil Moisture</Text>
              <Text style={styles.metricValue}>Low (Dry)</Text>
            </View>
          </View>

          <View style={styles.advisoryAlert}>
            <Text style={styles.advisoryAlertText}>
              ⚠️ Agronomy Bulletin: Severe dry air increases storage beetle vulnerability. Ensure triple hermetic bags for cowpeas.
            </Text>
          </View>
        </View>

        {/* Wholesale Grain Index */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Wholesale Grain Ticker (100kg)</Text>
          <Text style={styles.sectionBadge}>Benchmark Index</Text>
        </View>

        {COMMODITIES.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.commodityCard, calculatorCropIdx === idx && styles.commodityCardActive]}
            onPress={() => setCalculatorCropIdx(idx)}
            activeOpacity={0.8}
          >
            <View style={styles.commodityMain}>
              <Text style={styles.commodityName}>{item.name}</Text>
              <Text style={styles.commodityMarket}>{item.market}</Text>
            </View>
            <View style={styles.commodityPriceBlock}>
              <Text style={styles.commodityPrice}>{item.priceStr}</Text>
              <Text
                style={[
                  styles.commodityChange,
                  item.trend === 'up'
                    ? styles.trendUp
                    : item.trend === 'down'
                    ? styles.trendDown
                    : styles.trendFlat,
                ]}
              >
                {item.change}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Interactive Grain Price Calculator */}
        <View style={styles.calcCard}>
          <Text style={styles.calcTitle}>🧮 Grain Batch Cost Estimator</Text>
          <Text style={styles.calcDesc}>Selected: {selectedCrop.name}</Text>

          <View style={styles.calcRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.calcLabel}>Number of 100kg Bags:</Text>
              <TextInput
                style={styles.calcInput}
                keyboardType="numeric"
                value={quantityBags}
                onChangeText={setQuantityBags}
              />
            </View>
            <View style={styles.calcResultBox}>
              <Text style={styles.calcResultLabel}>Total Benchmark Value</Text>
              <Text style={styles.calcResultValue}>₦{calculatedTotal}</Text>
            </View>
          </View>
        </View>

        {/* Regional Market Days Schedule */}
        <View style={styles.marketDayCard}>
          <Text style={styles.marketDayTitle}>📅 Regional Wholesale Market Schedule</Text>
          {MARKET_DAYS.map((m, idx) => (
            <View key={idx} style={styles.marketDayRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.marketDayName}>{m.market}</Text>
                <Text style={styles.marketDayFocus}>{m.focus}</Text>
              </View>
              <Text style={styles.marketDayBadge}>{m.day}</Text>
            </View>
          ))}
        </View>

        {/* Extension Guidelines */}
        <View style={styles.extensionBox}>
          <Text style={styles.extensionTitle}>🌾 Grain Silo & Storage Guidelines</Text>
          <Text style={styles.extensionText}>
            1. Clean storage bins 14 days before loading harvest.{'\n'}
            2. Stack bags on wooden pallets 50cm away from stone walls.{'\n'}
            3. Measure moisture levels every Friday before market shipment.
          </Text>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Federal Ministry of Agriculture & NAERLS Extension Network
          </Text>
          <Text style={styles.footerTextSub}>Public Agricultural Information Service (Sahel Region)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#052E16' },
  topHeader: {
    backgroundColor: '#14532D',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#166534',
  },
  brandTitle: { fontSize: 15, fontWeight: '800', color: '#F0FDF4' },
  brandSubtitle: { fontSize: 10, color: '#BBF7D0', marginTop: 2 },
  lockButton: {
    backgroundColor: '#166534',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#22C55E',
    marginLeft: 8,
  },
  lockButtonText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  scrollView: { flex: 1, backgroundColor: '#052E16' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  cacheBanner: {
    backgroundColor: '#14532D',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  cacheStatus: { fontSize: 11, fontWeight: '800', color: '#86EFAC', letterSpacing: 0.5 },
  cacheTime: { fontSize: 10, color: '#DCFCE7', marginTop: 2 },
  regionPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  regionPill: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#047857',
  },
  regionPillActive: {
    backgroundColor: '#22C55E',
    borderColor: '#86EFAC',
  },
  regionPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A7F3D0',
  },
  regionPillTextActive: {
    color: '#052E16',
  },
  weatherCard: {
    backgroundColor: '#166534',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  weatherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weatherLocation: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  weatherTemp: { fontSize: 26, fontWeight: '900', color: '#FEF08A' },
  weatherCondition: { fontSize: 12, color: '#BBF7D0', marginTop: 3 },
  weatherMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    backgroundColor: '#14532D',
    borderRadius: 6,
    padding: 10,
  },
  metricBox: { alignItems: 'center' },
  metricLabel: { fontSize: 10, color: '#86EFAC' },
  metricValue: { fontSize: 12, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  advisoryAlert: {
    marginTop: 10,
    backgroundColor: '#052E16',
    borderRadius: 6,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF24',
  },
  advisoryAlertText: { fontSize: 11, color: '#FEF08A', lineHeight: 15 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#F0FDF4' },
  sectionBadge: {
    fontSize: 10,
    color: '#86EFAC',
    backgroundColor: '#14532D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  commodityCard: {
    backgroundColor: '#064E3B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#047857',
  },
  commodityCardActive: {
    borderColor: '#FDE047',
    backgroundColor: '#08533F',
  },
  commodityMain: { flex: 1, marginRight: 10 },
  commodityName: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  commodityMarket: { fontSize: 11, color: '#A7F3D0', marginTop: 2 },
  commodityPriceBlock: { alignItems: 'flex-end' },
  commodityPrice: { fontSize: 15, fontWeight: '800', color: '#FEF08A' },
  commodityChange: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  trendUp: { color: '#4ADE80' },
  trendDown: { color: '#F87171' },
  trendFlat: { color: '#CBD5E1' },
  calcCard: {
    backgroundColor: '#14532D',
    borderRadius: 10,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  calcTitle: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  calcDesc: { fontSize: 11, color: '#BBF7D0', marginTop: 2, marginBottom: 10 },
  calcRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  calcLabel: { fontSize: 10, color: '#86EFAC', fontWeight: '700', marginBottom: 4 },
  calcInput: {
    backgroundColor: '#052E16',
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  calcResultBox: {
    flex: 1.2,
    backgroundColor: '#052E16',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  calcResultLabel: { fontSize: 9, color: '#86EFAC', fontWeight: '700' },
  calcResultValue: { fontSize: 16, fontWeight: '900', color: '#FEF08A', marginTop: 2 },
  marketDayCard: {
    backgroundColor: '#064E3B',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#047857',
  },
  marketDayTitle: { fontSize: 13, fontWeight: '800', color: '#F0FDF4', marginBottom: 8 },
  marketDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#14532D',
  },
  marketDayName: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  marketDayFocus: { fontSize: 10, color: '#A7F3D0', marginTop: 1 },
  marketDayBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FEF08A',
    backgroundColor: '#14532D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  extensionBox: {
    backgroundColor: '#14532D',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#166534',
  },
  extensionTitle: { fontSize: 12, fontWeight: '800', color: '#86EFAC', marginBottom: 4 },
  extensionText: { fontSize: 11, color: '#D1FAE5', lineHeight: 16 },
  footerInfo: { marginTop: 16, alignItems: 'center', paddingVertical: 10 },
  footerText: { fontSize: 10, color: '#6EE7B7', textAlign: 'center' },
  footerTextSub: { fontSize: 9, color: '#059669', marginTop: 2 },
});
