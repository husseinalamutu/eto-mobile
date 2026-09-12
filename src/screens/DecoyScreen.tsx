import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface DecoyScreenProps {
  onLock: () => void;
}

interface CommodityPrice {
  name: string;
  unit: string;
  market: string;
  price: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
}

const COMMODITIES: CommodityPrice[] = [
  {
    name: 'White Maize (Masara)',
    unit: '100kg bag',
    market: 'Dawanau Grain Market, Kano',
    price: '₦78,500',
    change: '+2.1%',
    trend: 'up',
  },
  {
    name: 'Brown Sorghum (Dawa)',
    unit: '100kg bag',
    market: 'Dawanau Grain Market, Kano',
    price: '₦82,000',
    change: '-0.5%',
    trend: 'down',
  },
  {
    name: 'Pearl Millet (Maiwa)',
    unit: '100kg bag',
    market: 'Monday Market, Maiduguri',
    price: '₦75,000',
    change: '0.0%',
    trend: 'flat',
  },
  {
    name: 'Cowpeas / White Beans (Wake)',
    unit: '100kg bag',
    market: 'Kafanchan Central Market, Kaduna',
    price: '₦118,000',
    change: '+4.3%',
    trend: 'up',
  },
  {
    name: 'Soya Beans (Waken Soya)',
    unit: '100kg bag',
    market: 'Dawanau Grain Market, Kano',
    price: '₦94,000',
    change: '-1.2%',
    trend: 'down',
  },
  {
    name: 'Groundnut Unshelled (Gyaɗa)',
    unit: '50kg bag',
    market: 'Funtua Regional Market, Katsina',
    price: '₦62,000',
    change: '+1.8%',
    trend: 'up',
  },
];

export const DecoyScreen: React.FC<DecoyScreenProps> = ({ onLock }) => {
  const [lastRefreshed] = useState<string>('Today, 06:30 AM (Offline Cached)');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#14532D" />

      {/* Disguised Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.brandTitle}>🌾 Sahel AgriWeather & Grain Bulletin</Text>
          <Text style={styles.brandSubtitle}>Northern Agricultural Extension & Commodity Index</Text>
        </View>
        <TouchableOpacity
          style={styles.lockButton}
          onPress={onLock}
          activeOpacity={0.8}
        >
          <Text style={styles.lockButtonText}>Lock</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Offline Cache Status Banner */}
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheStatus}>● OFFLINE RADIO BROADCAST CACHE ACTIVE</Text>
          <Text style={styles.cacheTime}>{lastRefreshed}</Text>
        </View>

        {/* Weather Advisory Card */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherLocation}>Kano / Sahel Agro-Climatic Zone</Text>
            <Text style={styles.weatherTemp}>39°C</Text>
          </View>
          <Text style={styles.weatherCondition}>Dry Haze & Seasonal Harmattan Dust</Text>
          
          <View style={styles.weatherMetrics}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Humidity</Text>
              <Text style={styles.metricValue}>14%</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Wind Speed</Text>
              <Text style={styles.metricValue}>19 km/h NE</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Soil Moisture</Text>
              <Text style={styles.metricValue}>Critical Low</Text>
            </View>
          </View>

          <View style={styles.advisoryAlert}>
            <Text style={styles.advisoryAlertText}>
              ⚠️ Agronomy Advisory: Dry air increases grain storage pest susceptibility. Ensure triple-bagging hermetic storage for cowpea stock.
            </Text>
          </View>
        </View>

        {/* Commodity Prices Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Wholesale Grain Prices</Text>
          <Text style={styles.sectionBadge}>Benchmark Index</Text>
        </View>

        {COMMODITIES.map((item, idx) => (
          <View key={idx} style={styles.commodityCard}>
            <View style={styles.commodityMain}>
              <Text style={styles.commodityName}>{item.name}</Text>
              <Text style={styles.commodityMarket}>{item.market} • {item.unit}</Text>
            </View>
            <View style={styles.commodityPriceBlock}>
              <Text style={styles.commodityPrice}>{item.price}</Text>
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
          </View>
        ))}

        {/* Local Storage / Grain Silo Guidelines */}
        <View style={styles.extensionBox}>
          <Text style={styles.extensionTitle}>🌾 Grain Silo Best Practices</Text>
          <Text style={styles.extensionText}>
            1. Clean and fumigate storage bins 14 days before loading new harvest.{'\n'}
            2. Keep bags stacked on wooden pallets at least 50cm away from stone walls.{'\n'}
            3. Inspect moisture levels every Friday before market dispatch.
          </Text>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            National Agricultural Extension and Research Liaison Services (NAERLS)
          </Text>
          <Text style={styles.footerTextSub}>
            Public Bulletin Dissemination System (Offline Mode)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#052E16',
  },
  topHeader: {
    backgroundColor: '#14532D',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#166534',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0FDF4',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#BBF7D0',
    marginTop: 2,
  },
  lockButton: {
    backgroundColor: '#166534',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  lockButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#052E16',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  cacheBanner: {
    backgroundColor: '#14532D',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  cacheStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#86EFAC',
    letterSpacing: 0.5,
  },
  cacheTime: {
    fontSize: 11,
    color: '#DCFCE7',
    marginTop: 2,
  },
  weatherCard: {
    backgroundColor: '#166534',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLocation: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weatherTemp: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FEF08A',
  },
  weatherCondition: {
    fontSize: 13,
    color: '#BBF7D0',
    marginTop: 4,
  },
  weatherMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    backgroundColor: '#14532D',
    borderRadius: 6,
    padding: 10,
  },
  metricBox: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#86EFAC',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  advisoryAlert: {
    marginTop: 12,
    backgroundColor: '#052E16',
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF24',
  },
  advisoryAlertText: {
    fontSize: 12,
    color: '#FEF08A',
    lineHeight: 17,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0FDF4',
  },
  sectionBadge: {
    fontSize: 11,
    color: '#86EFAC',
    backgroundColor: '#14532D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  commodityCard: {
    backgroundColor: '#064E3B',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#047857',
  },
  commodityMain: {
    flex: 1,
    marginRight: 10,
  },
  commodityName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  commodityMarket: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 3,
  },
  commodityPriceBlock: {
    alignItems: 'flex-end',
  },
  commodityPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FEF08A',
  },
  commodityChange: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  trendUp: {
    color: '#4ADE80',
  },
  trendDown: {
    color: '#F87171',
  },
  trendFlat: {
    color: '#CBD5E1',
  },
  extensionBox: {
    backgroundColor: '#14532D',
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#166534',
  },
  extensionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#86EFAC',
    marginBottom: 6,
  },
  extensionText: {
    fontSize: 12,
    color: '#D1FAE5',
    lineHeight: 18,
  },
  footerInfo: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 11,
    color: '#6EE7B7',
    textAlign: 'center',
  },
  footerTextSub: {
    fontSize: 10,
    color: '#059669',
    marginTop: 2,
  },
});
