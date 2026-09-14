import { Platform } from 'react-native';

export const TOKENS = {
  // ETO Secure State — Tactical Field Terminal Dark (from Figma Design Specification)
  background: '#0A0C0E',
  foreground: '#F0EDE6',
  card: '#131619',
  cardForeground: '#F0EDE6',
  primary: '#E8A020', // Sunlight-readable amber, 9.1:1 on #0A0C0E (WCAG AAA)
  primaryForeground: '#0A0C0E',
  secondary: '#1C2128',
  secondaryForeground: '#C8C4BC',
  muted: '#1A1D21',
  mutedForeground: '#8A8680',
  accent: '#E8A020',
  accentForeground: '#0A0C0E',
  border: '#2A2E34',
  ring: '#E8A020',
  radius: 3,

  // Status indicators — high contrast, shape-reinforced
  statusSynced: '#22C55E',
  statusPending: '#E8A020',
  statusDanger: '#EF4444',
  statusOffline: '#6B7280',
  riskCritical: '#FF6B6B',
  riskLow: '#22C55E',

  // Decoy palette — civic utility beige & BOSADP green
  decoyBg: '#F5F0E8',
  decoySurface: '#FFFFFF',
  decoyText: '#1A1A1A',
  decoyMuted: '#6B6B6B',
  decoyAccent: '#1B5E20',
  decoyBorder: '#D0CABC',
  decoyHeader: '#1B5E20',
};

// Dual-axis risk configuration (Shape + Color + Label)
export const RISK_CONFIG = {
  CRIT: {
    bg: '#3D0A0A',
    text: '#FF6B6B',
    border: '#8B1A1A',
    shape: '■',
    label: 'CRITICAL',
    desc: 'Square mark',
  },
  HIGH: {
    bg: '#2D1A00',
    text: '#E8A020',
    border: '#6B3E00',
    shape: '▲',
    label: 'HIGH',
    desc: 'Triangle mark',
  },
  MED: {
    bg: '#1A2500',
    text: '#7EC850',
    border: '#3A5A00',
    shape: '◆',
    label: 'MEDIUM',
    desc: 'Diamond mark',
  },
  LOW: {
    bg: '#0A1A1A',
    text: '#4FC3C3',
    border: '#0F3B3B',
    shape: '●',
    label: 'LOW',
    desc: 'Circle mark',
  },
};

// Status configurations
export const STATUS_CONFIG = {
  synced: {
    icon: '✓',
    label: 'SYNCED',
    color: '#22C55E',
    bg: '#0A1A0F',
    border: '#14532D',
  },
  pending: {
    icon: '⏳',
    label: 'PENDING',
    color: '#E8A020',
    bg: '#1A1200',
    border: '#6B4B00',
  },
};

// Touch target and metric rules (Battlefield-grade under adrenaline & screen damage)
export const METRICS = {
  minTouchTarget: 64,
  cardMinHeight: 72,
  bottomNavHeight: 60,
  borderRadius: 4,
};

export const HIT_SLOP_64 = {
  top: 16,
  bottom: 16,
  left: 16,
  right: 16,
};

// Cross-platform font families
export const FONTS = {
  mono: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  condensed: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-condensed',
  sans: Platform.OS === 'ios' ? 'System' : 'sans-serif',
};
