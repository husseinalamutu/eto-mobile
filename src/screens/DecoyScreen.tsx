import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TOKENS, FONTS, METRICS } from '../theme/tokens';

interface Props {
  onRestore?: () => void;
  onLock?: () => void;
}

const GRAIN_DATA = [
  { name: 'Millet (Gero)', unit: '50kg bag', price: '₦8,400', unitPrice: 8400, change: '+1.2%', up: true },
  { name: 'Sorghum (Dawa)', unit: '50kg bag', price: '₦7,200', unitPrice: 7200, change: '-0.8%', up: false },
  { name: 'Cowpea (Wake)', unit: '50kg bag', price: '₦14,800', unitPrice: 14800, change: '+3.1%', up: true },
  { name: 'Maize (Masara)', unit: '50kg bag', price: '₦6,600', unitPrice: 6600, change: '+0.5%', up: true },
  { name: 'Groundnut (Gyada)', unit: '25kg bag', price: '₦11,200', unitPrice: 11200, change: '-1.4%', up: false },
  { name: 'Rice (Shinkafa)', unit: '25kg bag', price: '₦13,500', unitPrice: 13500, change: '+2.0%', up: true },
];

const WEATHER = [
  { day: 'Today', icon: '☀', high: 38, low: 24, desc: 'Sunny & Dry' },
  { day: 'Mon', icon: '🌤', high: 36, low: 23, desc: 'Mostly Clear' },
  { day: 'Tue', icon: '🌥', high: 34, low: 22, desc: 'Partly Cloudy' },
  { day: 'Wed', icon: '☀', high: 39, low: 25, desc: 'Sunny' },
  { day: 'Thu', icon: '☀', high: 40, low: 26, desc: 'Hot & Dry' },
];

const ALERTS = [
  'Maiduguri market: New price ceiling for millet effective Mon Sep 14',
  'Borno: Livestock fair, Maiduguri Monday Market, 06:00–14:00',
  'Rain alert: Possible light showers — Ngala area, Wednesday',
];

export const DecoyScreen: React.FC<Props> = ({ onRestore, onLock }) => {
  const [calcGrainIndex, setCalcGrainIndex] = useState(0);
  const [bagCount, setBagCount] = useState('10');

  // Stealth Restore Mechanism: 2-second continuous long press on invisible bottom-left 48x48dp zone
  const restoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressIn = useCallback(() => {
    restoreTimer.current = setTimeout(() => {
      if (onRestore) {
        onRestore();
      } else if (onLock) {
        onLock();
      }
    }, 2000);
  }, [onRestore, onLock]);

  const handlePressOut = useCallback(() => {
    if (restoreTimer.current) {
      clearTimeout(restoreTimer.current);
      restoreTimer.current = null;
    }
  }, []);

  const currentGrain = GRAIN_DATA[calcGrainIndex];
  const countNum = parseInt(bagCount, 10) || 0;
  const estimatedCost = countNum * currentGrain.unitPrice;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={TOKENS.decoyBg} translucent={false} />

      {/* Official Government Header — BOSADP Green (Emblem serves as covert exit trigger) */}
      <View style={styles.headerBanner}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitles}>
            <Text style={styles.headerMainTitle}>Borno Grain & Weather</Text>
            <Text style={styles.headerSubtitle}>BOSADP Market Information Service</Text>
          </View>
          <TouchableOpacity
            style={styles.headerEmblem}
            onPress={() => {
              if (onRestore) onRestore();
              else if (onLock) onLock();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.emblemIcon}>🌾</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Urgent Market Notice Bar */}
        <View style={styles.noticeTicker}>
          <Text style={styles.noticeTag}>⚑ NOTICE:</Text>
          <Text style={styles.noticeMessage}>
            Maiduguri market: New price ceiling for millet effective Mon Sep 14
          </Text>
        </View>

        {/* 5-Day Weather Forecast */}
        <View style={styles.weatherCard}>
          <Text style={styles.sectionCaption}>5-DAY FORECAST · MAIDUGURI</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weatherRow}>
            {WEATHER.map((w, idx) => (
              <View
                key={w.day}
                style={[
                  styles.weatherDayItem,
                  idx === 0 && styles.weatherTodayHighlight,
                ]}
              >
                <Text style={styles.weatherDayLabel}>{w.day}</Text>
                <Text style={styles.weatherEmoji}>{w.icon}</Text>
                <Text style={styles.weatherHighTemp}>{w.high}°</Text>
                <Text style={styles.weatherLowTemp}>{w.low}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Commodity Prices Section */}
        <View style={styles.priceSectionHeader}>
          <Text style={styles.sectionCaption}>MARKET PRICES · BORNO STATE</Text>
          <Text style={styles.updateTime}>Updated: 09:00 today</Text>
        </View>

        {/* Commodity Table Header */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableColTitle, { flex: 1 }]}>COMMODITY</Text>
            <Text style={[styles.tableColTitle, { width: 85, textAlign: 'right', marginRight: 12 }]}>PRICE</Text>
            <Text style={[styles.tableColTitle, { width: 55, textAlign: 'center' }]}>CHG</Text>
          </View>

          {/* Commodity Items */}
          {GRAIN_DATA.map((item) => (
            <View key={item.name} style={styles.tableDataRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.commodityName}>{item.name}</Text>
                <Text style={styles.commodityUnit}>{item.unit}</Text>
              </View>
              <Text style={styles.commodityPrice}>{item.price}</Text>
              <View
                style={[
                  styles.changePill,
                  item.up ? styles.changeUpPill : styles.changeDownPill,
                ]}
              >
                <Text
                  style={[
                    styles.changePillText,
                    item.up ? styles.changeUpText : styles.changeDownText,
                  ]}
                >
                  {item.up ? '▲' : '▼'} {item.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Camouflage Interactive Tool: Grain Price Calculator */}
        <View style={styles.calcCard}>
          <Text style={styles.sectionCaption}>COMMODITY BULK CALCULATOR</Text>
          <Text style={styles.calcDescription}>
            Official BOSADP producer conversion tool for market aggregators.
          </Text>

          <View style={styles.grainChipRow}>
            {GRAIN_DATA.slice(0, 3).map((g, idx) => (
              <TouchableOpacity
                key={g.name}
                onPress={() => setCalcGrainIndex(idx)}
                style={[
                  styles.grainChip,
                  calcGrainIndex === idx && styles.grainChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.grainChipText,
                    calcGrainIndex === idx && styles.grainChipTextActive,
                  ]}
                >
                  {g.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.calcInputRow}>
            <View style={styles.calcInputGroup}>
              <Text style={styles.calcInputLabel}>BAG QUANTITY</Text>
              <TextInput
                style={styles.calcInput}
                value={bagCount}
                onChangeText={setBagCount}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <View style={styles.calcTotalGroup}>
              <Text style={styles.calcInputLabel}>ESTIMATED COST</Text>
              <Text style={styles.calcTotalText}>₦{estimatedCost.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Market Notices */}
        <View style={styles.noticesCard}>
          <Text style={styles.sectionCaption}>MARKET NOTICES</Text>
          {ALERTS.map((alert, i) => (
            <View key={i} style={styles.noticeBulletRow}>
              <View style={styles.noticeGreenBar} />
              <Text style={styles.noticeItemText}>{alert}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Official Government Footer & Invisible Restore Zone */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerLegalText}>
          Borno State ATASP-C · Data: FMARD/CBN · Not for commercial use
        </Text>

        {/* Discreet Evaluator Exit (styled like an authentic bulletin terminal ID) */}
        <TouchableOpacity
          onPress={() => {
            if (onRestore) onRestore();
            else if (onLock) onLock();
          }}
          activeOpacity={0.7}
          style={styles.evaluatorExitLink}
        >
          <Text style={styles.evaluatorExitText}>BOSADP Terminal v2.4 · [ Tap to Exit Cover ]</Text>
        </TouchableOpacity>

        {/* INVISIBLE RESTORE ZONE (48×48dp at bottom-left) */}
        <TouchableOpacity
          style={styles.invisibleRestoreZone}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          accessible={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: TOKENS.decoyBg,
  },
  statusBarSim: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: TOKENS.decoyBg,
  },
  clockSim: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: '#444444',
  },
  systemSim: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: '#555555',
  },
  evaluatorExitLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  evaluatorExitText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#718096',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerBanner: {
    backgroundColor: TOKENS.decoyHeader,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitles: {
    flex: 1,
  },
  headerMainTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: '#A5D6A7',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  headerEmblem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emblemIcon: {
    fontSize: 18,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  noticeTicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    borderBottomWidth: 1,
    borderBottomColor: '#F9A825',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  noticeTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F57F17',
  },
  noticeMessage: {
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: '#5D4037',
  },
  weatherCard: {
    backgroundColor: TOKENS.decoySurface,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.decoyBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionCaption: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#888888',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  weatherRow: {
    gap: 8,
    paddingVertical: 2,
  },
  weatherDayItem: {
    width: 56,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  weatherTodayHighlight: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  weatherDayLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#666666',
  },
  weatherEmoji: {
    fontSize: 20,
    marginVertical: 4,
  },
  weatherHighTemp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B5E20',
  },
  weatherLowTemp: {
    fontSize: 9,
    color: '#888888',
  },
  priceSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  updateTime: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#888888',
  },
  tableContainer: {
    paddingHorizontal: 12,
    gap: 6,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
  },
  tableColTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#555555',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TOKENS.decoySurface,
    borderWidth: 1,
    borderColor: TOKENS.decoyBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 2,
  },
  commodityName: {
    fontFamily: FONTS.condensed,
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  commodityUnit: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#888888',
    marginTop: 1,
  },
  commodityPrice: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E20',
    width: 85,
    textAlign: 'right',
    marginRight: 12,
  },
  changePill: {
    width: 55,
    paddingVertical: 2,
    borderRadius: 2,
    alignItems: 'center',
  },
  changeUpPill: {
    backgroundColor: '#E8F5E9',
  },
  changeDownPill: {
    backgroundColor: '#FFEBEE',
  },
  changePillText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
  },
  changeUpText: {
    color: '#2E7D32',
  },
  changeDownText: {
    color: '#C62828',
  },
  calcCard: {
    backgroundColor: TOKENS.decoySurface,
    borderWidth: 1,
    borderColor: TOKENS.decoyBorder,
    marginHorizontal: 12,
    marginTop: 14,
    padding: 12,
    borderRadius: 2,
  },
  calcDescription: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#666666',
    marginBottom: 10,
  },
  grainChipRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  grainChip: {
    flex: 1,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: TOKENS.decoyBorder,
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  grainChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  grainChipText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#555555',
  },
  grainChipTextActive: {
    color: '#1B5E20',
    fontWeight: '700',
  },
  calcInputRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  calcInputGroup: {
    flex: 1,
  },
  calcInputLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: '#888888',
    marginBottom: 2,
  },
  calcInput: {
    borderWidth: 1,
    borderColor: TOKENS.decoyBorder,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: '#1A1A1A',
    borderRadius: 2,
  },
  calcTotalGroup: {
    flex: 1.2,
  },
  calcTotalText: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
  },
  noticesCard: {
    backgroundColor: TOKENS.decoySurface,
    borderWidth: 1,
    borderColor: TOKENS.decoyBorder,
    marginHorizontal: 12,
    marginTop: 14,
    padding: 12,
    borderRadius: 2,
  },
  noticeBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  noticeGreenBar: {
    width: 2,
    height: 14,
    backgroundColor: '#A5D6A7',
    marginTop: 2,
  },
  noticeItemText: {
    flex: 1,
    fontSize: 11,
    color: '#444444',
    lineHeight: 16,
  },
  footerContainer: {
    backgroundColor: '#EDEAE0',
    borderTopWidth: 1,
    borderTopColor: TOKENS.decoyBorder,
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'relative',
  },
  footerLegalText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
  },
  invisibleRestoreZone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: METRICS.minTouchTarget,
    height: METRICS.minTouchTarget,
    backgroundColor: 'transparent',
  },
});
