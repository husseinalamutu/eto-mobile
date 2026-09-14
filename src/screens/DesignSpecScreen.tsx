import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { TOKENS, RISK_CONFIG, STATUS_CONFIG, FONTS, METRICS } from '../theme/tokens';

interface Props {
  onBack: () => void;
}

export const DesignSpecScreen: React.FC<Props> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={TOKENS.background} />

      {/* Top Bar with Return button */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.specEyebrow}>ETO MOBILE · UI SPECIFICATION</Text>
          <Text style={styles.specTitle}>Design System</Text>
          <Text style={styles.specSubtitle}>Sahel-Optimized · WCAG AAA · Android Go</Text>
        </View>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* A. Color Tokens */}
        <Section title="A · Color Tokens — Secure State">
          <View style={styles.tokenList}>
            {[
              { name: '--background', value: '#0A0C0E', label: 'Base / Page ground' },
              { name: '--card', value: '#131619', label: 'Surface / Card' },
              { name: '--secondary', value: '#1C2128', label: 'Elevated surface' },
              { name: '--primary', value: '#E8A020', label: 'Primary amber — sunlight-readable (9.1:1)' },
              { name: '--border', value: '#2A2E34', label: 'Structural hairline' },
              { name: '--muted-foreground', value: '#8A8680', label: 'Labels / captions' },
            ].map((c) => (
              <View key={c.name} style={styles.tokenRow}>
                <View
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c.value, borderColor: TOKENS.border },
                  ]}
                />
                <View style={styles.tokenInfo}>
                  <Text style={styles.tokenValue}>{c.value}</Text>
                  <Text style={styles.tokenLabel}>
                    {c.name} · {c.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        {/* B. Status Indicators — Shape + Color */}
        <Section title="B · Status Indicators — Shape + Color">
          <Text style={styles.sectionParagraph}>
            All status must use shape + label, never color alone. Ensures readability on degraded screens and for color-blind users.
          </Text>

          <View style={styles.tokenList}>
            {Object.entries(RISK_CONFIG).map(([key, item]) => (
              <View key={key} style={styles.tokenRow}>
                <View
                  style={[
                    styles.shapeBox,
                    { backgroundColor: item.bg, borderColor: item.border },
                  ]}
                >
                  <Text style={[styles.shapeIcon, { color: item.text }]}>{item.shape}</Text>
                </View>
                <View style={styles.tokenInfo}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.badgePill,
                        { backgroundColor: item.bg, borderColor: item.border },
                      ]}
                    >
                      <Text style={[styles.badgePillText, { color: item.text }]}>
                        {item.shape} {item.label}
                      </Text>
                    </View>
                    <Text style={styles.badgeDesc}>{item.desc}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Synced and Pending Indicators */}
            {Object.entries(STATUS_CONFIG).map(([key, item]) => (
              <View key={key} style={styles.tokenRow}>
                <View
                  style={[
                    styles.shapeBox,
                    { backgroundColor: item.bg, borderColor: item.border },
                  ]}
                >
                  <Text style={[styles.shapeIcon, { color: item.color }]}>{item.icon}</Text>
                </View>
                <View style={styles.tokenInfo}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.badgePill,
                        { backgroundColor: item.bg, borderColor: item.border },
                      ]}
                    >
                      <Text style={[styles.badgePillText, { color: item.color }]}>
                        {item.icon} {item.label}
                      </Text>
                    </View>
                    <Text style={styles.badgeDesc}>Monochrome status state</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Section>

        {/* C. Typography Hierarchy & Multilingual Expansion */}
        <Section title="C · Typography Hierarchy">
          {[
            { role: 'Screen Title', size: '24px', weight: '700', family: 'Condensed', sample: 'Littafin Filin' },
            { role: 'List Item', size: '14px', weight: '600', family: 'Condensed', sample: 'WFP Distribution — Maiduguri Ward 4' },
            { role: 'Body / Notes', size: '13px', weight: '400', family: 'Condensed', sample: '127 bags diverted. Truck reg. BN-0049-ABJ' },
            { role: 'Data Labels', size: '9–10px', weight: '500', family: 'Mono', sample: 'ENT-0041 · 14:23 · PENDING' },
            { role: 'System Caps', size: '8px', weight: '600', family: 'Mono', sample: 'FIELD NOTE · LOCATION · SYNCED' },
          ].map((t) => (
            <View key={t.role} style={styles.typeRow}>
              <Text style={styles.typeRole}>
                {t.role} · {t.size} {t.weight} · {t.family}
              </Text>
              <Text style={styles.typeSample}>{t.sample}</Text>
            </View>
          ))}

          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>MULTILINGUAL EXPANSION RULE</Text>
            <Text style={styles.highlightText}>
              Hausa labels expand up to 35% vs English. All containers use flex-wrap or fixed heights with truncation. No pixel-exact widths on text elements. Min-height 48dp on all touch targets regardless of text length.
            </Text>
          </View>
        </Section>

        {/* D. Stealth Switch Mechanism */}
        <Section title="D · Stealth Switch Mechanism">
          {/* Panic Trigger */}
          <View style={styles.cardBoxPrimary}>
            <Text style={styles.cardBoxTitleAmber}>SECURE → DECOY (Panic Trigger)</Text>
            {[
              'Tap the status-bar clock region 3× within 800ms',
              'No visual feedback — silent state change',
              'Decoy screen renders in <100ms (no animation)',
              'React state swap only — zero navigation overhead',
              'Works offline, no network call triggered',
            ].map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{idx + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Secret Restore */}
          <View style={styles.cardBoxDanger}>
            <Text style={styles.cardBoxTitleRed}>DECOY → SECURE (Restore)</Text>
            {[
              'Long-press invisible 48×48dp zone in bottom-left corner of decoy footer',
              'Hold for 2000ms (debounced, not tap-sensitive)',
              'No visual indicator — zero visual leak to observers',
              'On release <2s: nothing happens (false press safety)',
              'On release ≥2s: state restored, secure ledger active',
            ].map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <Text style={styles.stepNumberRed}>{idx + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* E. Touch Target & Layout Rules */}
        <Section title="E · Touch Target & Layout Rules">
          {[
            ['Minimum tap target', '48×48 dp on all interactive elements'],
            ['Nav bar height', '56–60dp — bottom fixed, safe area inset'],
            ['List row height', '≥64dp with expanded detail available'],
            ['Input fields', '48dp height, 16px font, full-width in modal'],
            ['Icon size', '20–24dp inline, 28dp standalone actions'],
            ['Font min on data', '10px mono — no smaller (screen readability)'],
            ['Contrast ratio', 'WCAG AAA: ≥7:1 for body text (#E8A020 on #0A0C0E = 9.1:1)'],
            ['No blur effects', 'backdrop-filter: none — zero GPU overhead'],
            ['No box-shadow stacks', 'max 1 shadow layer, prefer border instead'],
            ['Animation budget', 'zero transitions on panic switch; max 150ms elsewhere'],
          ].map(([rule, val]) => (
            <View key={rule} style={styles.ruleRow}>
              <Text style={styles.ruleName}>{rule}</Text>
              <Text style={styles.ruleVal}>{val}</Text>
            </View>
          ))}
        </Section>

        {/* F. Decoy Screen Design Rules */}
        <Section title="F · Decoy Screen Design Rules">
          {[
            { rule: 'Mundane palette', detail: 'Beige/cream base (#F5F0E8), government green header (#1B5E20). Deliberately unstylish.' },
            { rule: 'Real data', detail: 'Actual Borno grain commodity names, realistic NGN price ranges, real LGA references.' },
            { rule: 'Zero ETO branding', detail: 'No amber, no "ÈTÒ", no SECURE badge. Looks like a BOSADP/FMARD public portal.' },
            { rule: 'Boring typography', detail: 'Standard web font weights, no condensed display faces, plain tabular layout.' },
            { rule: 'Fake government footer', detail: 'BOSADP/CBN attribution creates institutional credibility for the decoy.' },
            { rule: 'Restore zone invisible', detail: '48×48dp tap target at bottom-left has zero visual indicator — effectively invisible.' },
          ].map(({ rule, detail }) => (
            <View key={rule} style={styles.decoyRuleRow}>
              <Text style={styles.decoyRuleBullet}>▸</Text>
              <Text style={styles.decoyRuleText}>
                <Text style={styles.decoyRuleTitle}>{rule}: </Text>
                {detail}
              </Text>
            </View>
          ))}
        </Section>

        {/* Footer Build Info */}
        <View style={styles.footerNotice}>
          <Text style={styles.footerText}>
            ÈTÒ MOBILE · Field Operations Build · React Native (Expo) Target
          </Text>
          <Text style={styles.footerSubtext}>
            Android Go optimized · 1GB RAM · Offline-first · WCAG AAA
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <View style={styles.sectionHeaderLine} />
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: TOKENS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
  },
  specEyebrow: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  specTitle: {
    fontFamily: FONTS.condensed,
    fontSize: 22,
    fontWeight: '700',
    color: TOKENS.foreground,
    letterSpacing: 1,
    marginTop: 2,
  },
  specSubtitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    marginTop: 2,
  },
  backButton: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 1,
    borderColor: TOKENS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
  },
  backButtonText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: TOKENS.primary,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: TOKENS.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: TOKENS.border,
  },
  sectionParagraph: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    lineHeight: 14,
    marginBottom: 12,
  },
  tokenList: {
    gap: 8,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorSwatch: {
    width: 36,
    height: 28,
    borderRadius: 2,
    borderWidth: 1,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenValue: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: TOKENS.primary,
    letterSpacing: 1,
  },
  tokenLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    marginTop: 1,
  },
  shapeBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
  },
  shapeIcon: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
  },
  badgePillText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  badgeDesc: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
  },
  typeRow: {
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
    paddingBottom: 8,
    marginBottom: 8,
  },
  typeRole: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  typeSample: {
    fontFamily: FONTS.condensed,
    fontSize: 14,
    color: TOKENS.foreground,
    fontWeight: '600',
  },
  highlightBox: {
    backgroundColor: TOKENS.muted,
    borderWidth: 1,
    borderColor: TOKENS.border,
    padding: 10,
    borderRadius: 2,
    marginTop: 8,
  },
  highlightTitle: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    color: TOKENS.primary,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  highlightText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    lineHeight: 14,
  },
  cardBoxPrimary: {
    backgroundColor: TOKENS.secondary,
    borderWidth: 1,
    borderColor: TOKENS.primary,
    padding: 12,
    borderRadius: 2,
    marginBottom: 10,
  },
  cardBoxTitleAmber: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    color: TOKENS.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardBoxDanger: {
    backgroundColor: TOKENS.muted,
    borderWidth: 1,
    borderColor: TOKENS.border,
    padding: 12,
    borderRadius: 2,
  },
  cardBoxTitleRed: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    fontWeight: '700',
    color: TOKENS.statusDanger,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 5,
  },
  stepNumber: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.primary,
    width: 14,
  },
  stepNumberRed: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.statusDanger,
    width: 14,
  },
  stepText: {
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.foreground,
    lineHeight: 13,
  },
  ruleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.border,
    paddingBottom: 6,
    marginBottom: 6,
  },
  ruleName: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    width: 110,
  },
  ruleVal: {
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.foreground,
  },
  decoyRuleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 6,
  },
  decoyRuleBullet: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.primary,
  },
  decoyRuleText: {
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: TOKENS.mutedForeground,
    lineHeight: 13,
  },
  decoyRuleTitle: {
    color: TOKENS.foreground,
    fontWeight: '700',
  },
  footerNotice: {
    borderWidth: 1,
    borderColor: TOKENS.border,
    backgroundColor: TOKENS.muted,
    padding: 12,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  footerSubtext: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: TOKENS.mutedForeground,
    marginTop: 3,
    textAlign: 'center',
  },
});
