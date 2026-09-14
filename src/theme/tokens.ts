import { Platform } from 'react-native';

export interface ThemeTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  ring: string;
  radius: number;

  // Status indicators
  statusSynced: string;
  statusPending: string;
  statusDanger: string;
  statusOffline: string;
  riskCritical: string;
  riskLow: string;

  // Decoy palette (preserved authentic agricultural aesthetic)
  decoyBg: string;
  decoySurface: string;
  decoyText: string;
  decoyMuted: string;
  decoyAccent: string;
  decoyBorder: string;
  decoyHeader: string;
}

// ── Dark Mode: Eye-Friendly Soft Charcoal Dark Grey (Material Design / HIG) ──
export const DARK_TOKENS: ThemeTokens = {
  background: '#16181D', // Softer dark grey; avoids OLED halation & eye fatigue of #000000
  foreground: '#F1F3F5', // Soft off-white; high contrast without blinding glare
  card: '#20242C',       // Elevated surface for cards and modals (+4.5% luminance)
  cardForeground: '#F1F3F5',
  primary: '#F59E0B',    // Tactical warm amber; WCAG AAA compliant on #16181D
  primaryForeground: '#16181D',
  secondary: '#2A2F3A',  // Action surfaces, pill containers, input fields
  secondaryForeground: '#D1D5DB',
  muted: '#1E222A',
  mutedForeground: '#949AA4', // Accessible secondary text
  accent: '#F59E0B',
  accentForeground: '#16181D',
  border: '#373D4A',     // Non-glaring container border
  ring: '#F59E0B',
  radius: 3,

  statusSynced: '#22C55E',
  statusPending: '#F59E0B',
  statusDanger: '#EF4444',
  statusOffline: '#6B7280',
  riskCritical: '#FF6B6B',
  riskLow: '#22C55E',

  // Authentic municipal agricultural disguise
  decoyBg: '#F5F0E8',
  decoySurface: '#FFFFFF',
  decoyText: '#1A1A1A',
  decoyMuted: '#6B6B6B',
  decoyAccent: '#1B5E20',
  decoyBorder: '#D0CABC',
  decoyHeader: '#1B5E20',
};

// ── Light Mode: High-Contrast Daylight Palette (Outdoor Legibility) ──
export const LIGHT_TOKENS: ThemeTokens = {
  background: '#F4F5F7', // Soft off-white canvas; minimizes direct sunlight glare
  foreground: '#111827', // Deep charcoal black; 14:1 contrast ratio (WCAG AAA)
  card: '#FFFFFF',       // Clean, crisp card surface
  cardForeground: '#111827',
  primary: '#D97706',    // Deep daylight amber; high contrast on white/light grey
  primaryForeground: '#FFFFFF',
  secondary: '#E8EAEF',  // Soft grey buttons, inactive tabs, inputs
  secondaryForeground: '#374151',
  muted: '#F1F3F5',
  mutedForeground: '#64748B', // Accessible secondary text (WCAG AA compliant)
  accent: '#D97706',
  accentForeground: '#FFFFFF',
  border: '#D2D6DC',     // Crisp container boundary
  ring: '#D97706',
  radius: 3,

  statusSynced: '#16A34A',
  statusPending: '#D97706',
  statusDanger: '#DC2626',
  statusOffline: '#9CA3AF',
  riskCritical: '#DC2626',
  riskLow: '#16A34A',

  // Authentic municipal agricultural disguise (preserved across themes)
  decoyBg: '#F5F0E8',
  decoySurface: '#FFFFFF',
  decoyText: '#1A1A1A',
  decoyMuted: '#6B6B6B',
  decoyAccent: '#1B5E20',
  decoyBorder: '#D0CABC',
  decoyHeader: '#1B5E20',
};

// Dual-axis risk configuration (Dark mode)
export const DARK_RISK_CONFIG = {
  CRIT: {
    bg: '#3D1414',
    text: '#FF6B6B',
    border: '#8B2525',
    shape: '■',
    label: 'CRITICAL',
    desc: 'Square mark',
  },
  HIGH: {
    bg: '#331F0A',
    text: '#F59E0B',
    border: '#7C480E',
    shape: '▲',
    label: 'HIGH',
    desc: 'Triangle mark',
  },
  MED: {
    bg: '#192B12',
    text: '#84CC16',
    border: '#365314',
    shape: '◆',
    label: 'MEDIUM',
    desc: 'Diamond mark',
  },
  LOW: {
    bg: '#0E2828',
    text: '#38BDF8',
    border: '#155E75',
    shape: '●',
    label: 'LOW',
    desc: 'Circle mark',
  },
};

// Dual-axis risk configuration (Light mode)
export const LIGHT_RISK_CONFIG = {
  CRIT: {
    bg: '#FEE2E2',
    text: '#DC2626',
    border: '#FCA5A5',
    shape: '■',
    label: 'CRITICAL',
    desc: 'Square mark',
  },
  HIGH: {
    bg: '#FEF3C7',
    text: '#D97706',
    border: '#FCD34D',
    shape: '▲',
    label: 'HIGH',
    desc: 'Triangle mark',
  },
  MED: {
    bg: '#ECFDF5',
    text: '#15803D',
    border: '#86EFAC',
    shape: '◆',
    label: 'MEDIUM',
    desc: 'Diamond mark',
  },
  LOW: {
    bg: '#E0F2FE',
    text: '#0284C7',
    border: '#7DD3FC',
    shape: '●',
    label: 'LOW',
    desc: 'Circle mark',
  },
};

// Status configurations
export const DARK_STATUS_CONFIG = {
  synced: {
    icon: '✓',
    label: 'SYNCED',
    color: '#22C55E',
    bg: '#13281A',
    border: '#1E462B',
  },
  pending: {
    icon: '⏳',
    label: 'PENDING',
    color: '#F59E0B',
    bg: '#2E1E08',
    border: '#5C3C0F',
  },
};

export const LIGHT_STATUS_CONFIG = {
  synced: {
    icon: '✓',
    label: 'SYNCED',
    color: '#16A34A',
    bg: '#DCFCE7',
    border: '#86EFAC',
  },
  pending: {
    icon: '⏳',
    label: 'PENDING',
    color: '#D97706',
    bg: '#FEF3C7',
    border: '#FCD34D',
  },
};

// Helpers for dynamic resolution
export function getTheme(mode: 'dark' | 'light'): ThemeTokens {
  return mode === 'light' ? LIGHT_TOKENS : DARK_TOKENS;
}

export function getRiskConfig(mode: 'dark' | 'light') {
  return mode === 'light' ? LIGHT_RISK_CONFIG : DARK_RISK_CONFIG;
}

export function getStatusConfig(mode: 'dark' | 'light') {
  return mode === 'light' ? LIGHT_STATUS_CONFIG : DARK_STATUS_CONFIG;
}

// Backward compatibility defaults (now upgraded to eye-friendly dark grey)
export const TOKENS = DARK_TOKENS;
export const RISK_CONFIG = DARK_RISK_CONFIG;
export const STATUS_CONFIG = DARK_STATUS_CONFIG;

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
