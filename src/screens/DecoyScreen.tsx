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
  { name: 'Kano', temp: '39°C', condition: 'Dry Haze & Harmattan Wind', humidity: '14%', wind: '19 km/h NE' },
  { name: 'Maiduguri', temp: '41°C', condition: 'Severe Heat & Dry Breeze', humidity: '11%', wind: '22 km/h E' },
  { name: 'Sokoto', temp: '40°C', condition: 'Intense Sunlight & Aridity', humidity: '12%', wind: '16 km/h NE' },
  { name: 'Kaduna', temp: '34°C', condition: 'Partly Cloudy & Dry Breeze', humidity: '26%', wind: '14 km/h N' },
];

const COMMODITIES = [
  { name: 'White Maize (Masara)', unitPrice: 78500, priceStr: '₦78,500', market: 'Dawanau Grain Market, Kano', change: '+2.1%', isUp: true },
  { name: 'Brown Sorghum (Dawa)', unitPrice: 82000, priceStr: '₦82,000', market: 'Dawanau Grain Market, Kano', change: '-0.5%', isUp: false },
  { name: 'Pearl Millet (Maiwa)', unitPrice: 75000, priceStr: '₦75,000', market: 'Monday Market, Maiduguri', change: '0.0%', isUp: null },
  { name: 'White Cowpeas (Wake)', unitPrice: 118000, priceStr: '₦118,000', market: 'Kafanchan Market, Kaduna', change: '+4.3%', isUp: true },
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
      <StatusBar barStyle="light-content" backgroundColor="#041A0F" />

      {/* Top Header: High-Contrast Forest Header */}
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitle}>🌾 Sahel AgriWeather & Grain Bulletin</Text>
          <Text style={styles.brandSubtitle}>NAERLS Agro-Extension & Commodity Index</Text>
        </View>
        <TouchableOpacity style={styles.lockButton} onPress={onLock} activeOpacity={0.8}>
          <Text style={styles.lockButtonText}>🔒 Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Offline Broadcast Badge */}
        <View style={styles.cachePill}>
          <View style={styles.pulseDot} />
          <Text style={styles.cacheText}>OFFLINE RADIO BROADCAST CACHE VALIDATED</Text>
        </View>

        {/* Region Selector Chips */}
        <View style={styles.regionRow}>
          {REGIONS.map((reg, idx) => {
            const isSelected = idx === selectedRegionIndex;
            return (
              <TouchableOpacity
                key={reg.name}
                style={[styles.regionChip, isSelected && styles.regionChipActive]}
                onPress={() => setSelectedRegionIndex(idx)}
              >
                <Text style={[styles.regionChipText, isSelected && styles.regionChipTextActive]}>
                  {reg.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Weather Card: High Contrast */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherTop}>
            <View>
              <Text style={styles.weatherZone}>{currentRegion.name} Agro-Climatic Zone</Text>
              <Text style={styles.weatherDesc}>{currentRegion.condition}</Text>
            </View>
            <Text style={styles.weatherTemp}>{currentRegion.temp}</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Humidity</Text>
              <Text style={styles.metricVal}>{currentRegion.humidity}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Wind Vector</Text>
              <Text style={styles.metricVal}>{currentRegion.wind}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Soil Moisture</Text>
              <Text style={styles.metricVal}>Low (Dry)</Text>
            </View>
          </View>

          <View style={styles.advisoryBox}>
            <Text style={styles.advisoryText}>
              ⚠️ <Text style={{ fontWeight: '800' }}>Agronomy Advisory:</Text> Severe harmattan aridity. Ensure triple hermetic bags for cowpeas to prevent storage weevil infestation.
            </Text>
          </View>
        </View>

        {/* Wholesale Grain Prices */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Wholesale Grain Index (100kg Bag)</Text>
          <Text style={styles.sectionSub}>Dawanau & Monday Markets</Text>
        </View>

        {COMMODITIES.map((item, idx) => {
          const isSelected = calculatorCropIdx === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.commodityCard, isSelected && styles.commodityCardSelected]}
              onPress={() => setCalculatorCropIdx(idx)}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.commodityName}>{item.name}</Text>
                <Text style={styles.commodityMarket}>{item.market}</Text>
              </View>

              <View style={styles.priceBlock}>
                <Text style={styles.commodityPrice}>{item.priceStr}</Text>
                <Text
                  style={[
                    styles.commodityChange,
                    item.isUp === true && styles.changeUp,
                    item.isUp === false && styles.changeDown,
                    item.isUp === null && styles.changeFlat,
                  ]}
                >
                  {item.change}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Interactive Batch Price Calculator */}
        <View style={styles.calcContainer}>
          <Text style={styles.calcHeader}>🧮 Grain Batch Value Calculator</Text>
          <Text style={styles.calcSelectedCrop}>Selected: {selectedCrop.name}</Text>

          <View style={styles.calcInputsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.calcInputLabel}>Enter Bags (100kg):</Text>
              <TextInput
                style={styles.calcTextInput}
                keyboardType="numeric"
                value={quantityBags}
                onChangeText={setQuantityBags}
                maxLength={4}
              />
            </View>

            <View style={styles.calcTotalCard}>
              <Text style={styles.calcTotalLabel}>Total Benchmark Value</Text>
              <Text style={styles.calcTotalValue}>₦{calculatedTotal}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerNotice}>
          <Text style={styles.footerNoticeText}>
            National Agricultural Extension & Research Liaison Services (NAERLS)
          </Text>
          <Text style={styles.footerNoticeSub}>Public Agro-Climatic Dissemination Bulletin</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#041A0F' },
  topHeader: {
    backgroundColor: '#0A2617',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#17472C',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 2,
  },
  lockButton: {
    backgroundColor: '#165330',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#34D399',
    marginLeft: 10,
  },
  lockButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollView: { flex: 1, backgroundColor: '#041A0F' },
  scrollContent: { padding: 18, paddingBottom: 40 },
  cachePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A2617',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#17472C',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 8,
  },
  cacheText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  regionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  regionChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#0C2B1B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1D4F35',
  },
  regionChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#34D399',
  },
  regionChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D1FAE5',
  },
  regionChipTextActive: {
    color: '#041A0F',
    fontWeight: '900',
  },
  weatherCard: {
    backgroundColor: '#0C2B1B',
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1D4F35',
  },
  weatherTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weatherZone: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  weatherDesc: {
    fontSize: 12,
    color: '#D1FAE5',
    marginTop: 3,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FDE047',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#061D12',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#133E28',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#1D4F35',
  },
  metricLabel: {
    fontSize: 10,
    color: '#A7F3D0',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  advisoryBox: {
    marginTop: 12,
    backgroundColor: '#061D12',
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FDE047',
  },
  advisoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 17,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionSub: {
    fontSize: 11,
    color: '#A7F3D0',
  },
  commodityCard: {
    backgroundColor: '#0C2B1B',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D4F35',
  },
  commodityCardSelected: {
    borderColor: '#FDE047',
    backgroundColor: '#0F3622',
  },
  commodityName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  commodityMarket: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 2,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  commodityPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FDE047',
  },
  commodityChange: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  changeUp: { color: '#4ADE80' },
  changeDown: { color: '#F87171' },
  changeFlat: { color: '#CBD5E1' },
  calcContainer: {
    backgroundColor: '#0A2617',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1D4F35',
  },
  calcHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calcSelectedCrop: {
    fontSize: 12,
    color: '#D1FAE5',
    marginTop: 2,
    marginBottom: 12,
  },
  calcInputsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  calcInputLabel: {
    fontSize: 11,
    color: '#D1FAE5',
    fontWeight: '700',
    marginBottom: 4,
  },
  calcTextInput: {
    backgroundColor: '#041A0F',
    borderWidth: 1,
    borderColor: '#34D399',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  calcTotalCard: {
    flex: 1.3,
    backgroundColor: '#041A0F',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  calcTotalLabel: {
    fontSize: 10,
    color: '#D1FAE5',
    fontWeight: '700',
  },
  calcTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FDE047',
    marginTop: 2,
  },
  footerNotice: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerNoticeText: {
    fontSize: 11,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  footerNoticeSub: {
    fontSize: 10,
    color: '#6EE7B7',
    marginTop: 2,
  },
});
