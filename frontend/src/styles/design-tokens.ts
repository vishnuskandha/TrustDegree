/**
 * TrustDegree Design Tokens
 *
 * Centralized constants for colors, typography, spacing, and other design decisions.
 * These tokens map directly to the CSS custom properties defined in index.css.
 *
 * Design Style: SaaS (B2B SaaS Modern)
 * Color Palette: Micro-Credentials/Badges Platform (#29)
 * Font Pairing: SaaS Mobile Boutique – Calistoga + Inter + JetBrains Mono
 *
 * @see docs/design-system.md for complete specification
 */

export const colors = {
  // Primary palette – Trust blue
  primary: {
    DEFAULT: '#0369A1',
    foreground: '#FFFFFF',
    // Gradient endpoint
    light: '#0EA5E9',
  },

  // Secondary – Lighter blue for gradients and hover
  secondary: {
    DEFAULT: '#0EA5E9',
    foreground: '#0F172A',
  },

  // Accent – Achievement gold
  accent: {
    DEFAULT: '#A16207',
    foreground: '#FFFFFF',
  },

  // Backgrounds
  background: '#F0F9FF', // Light blue-tinted canvas
  foreground: '#0C4A6E', // Primary text

  // Cards & surfaces
  card: '#FFFFFF',
  cardForeground: '#0C4A6E',

  // Muted elements
  muted: '#E7EFF5',
  mutedForeground: '#64748B',

  // Borders
  border: '#BAE6FD',

  // Destructive actions
  destructive: {
    DEFAULT: '#DC2626',
    foreground: '#FFFFFF',
  },

  // Focus rings
  ring: '#0369A1',

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #0369A1, #0EA5E9)',
    primaryHorizontal: 'linear-gradient(90deg, #0369A1, #0EA5E9)',
    accent: 'linear-gradient(135deg, #A16207, #D97706)',
  },
} as const;

export const typography = {
  // Font families
  fonts: {
    display: "'Calistoga', serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },

  // Font size scale (in rem)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.5px',
    tight: '-0.25px',
    normal: '0',
    wide: '0.5px',
    wider: '1px',
    widest: '1.5px',
  },

  // Special token for display font weight (Calistoga typically 700)
  displayWeight: '700',
} as const;

export const spacing = {
  // 4px base unit
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

export const radius = {
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 28px
  xl: '9999px',   // full (pill)
  '2xl': '2rem',  // 32px
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(3, 105, 161, 0.05)',
  md: '0 4px 6px -1px rgba(3, 105, 161, 0.1), 0 2px 4px -2px rgba(3, 105, 161, 0.05)',
  lg: '0 10px 15px -3px rgba(3, 105, 161, 0.15), 0 4px 6px -4px rgba(3, 105, 161, 0.1)',
  xl: '0 20px 25px -5px rgba(3, 105, 161, 0.2), 0 8px 10px -6px rgba(3, 105, 161, 0.1)',
  primary: '0 0 15px rgba(3, 105, 161, 0.3)',
  // Existing glassmorphism (keep)
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  neon: '0 0 15px rgba(99, 102, 241, 0.4)', // existing indigo neon (optional)
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    slower: '500ms',
  },
  easing: {
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.2, 0, 0, 1)', // SaaS "Emphasized"
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 2000,
  fixed: 3000,
  modalBackdrop: 4000,
  modal: 4100,
  popover: 4200,
  toast: 5000,
  max: 9999,
} as const;

// Utility function to generate CSS custom properties string
export function generateCSSVariables(): string {
  const lines: string[] = [];

  // Colors
  lines.push('/* Colors */');
  lines.push(`--color-primary: ${colors.primary.DEFAULT};`);
  lines.push(`--color-primary-foreground: ${colors.primary.foreground};`);
  lines.push(`--color-secondary: ${colors.secondary.DEFAULT};`);
  lines.push(`--color-secondary-foreground: ${colors.secondary.foreground};`);
  lines.push(`--color-accent: ${colors.accent.DEFAULT};`);
  lines.push(`--color-accent-foreground: ${colors.accent.foreground};`);
  lines.push(`--color-background: ${colors.background};`);
  lines.push(`--color-foreground: ${colors.foreground};`);
  lines.push(`--color-card: ${colors.card};`);
  lines.push(`--color-card-foreground: ${colors.cardForeground};`);
  lines.push(`--color-muted: ${colors.muted};`);
  lines.push(`--color-muted-foreground: ${colors.mutedForeground};`);
  lines.push(`--color-border: ${colors.border};`);
  lines.push(`--color-destructive: ${colors.destructive.DEFAULT};`);
  lines.push(`--color-destructive-foreground: ${colors.destructive.foreground};`);
  lines.push(`--color-ring: ${colors.ring};`);
  lines.push(`--gradient-primary: ${colors.gradients.primary};`);

  // Fonts
  lines.push('\n/* Typography */');
  lines.push(`--font-display: ${typography.fonts.display};`);
  lines.push(`--font-sans: ${typography.fonts.sans};`);
  lines.push(`--font-mono: ${typography.fonts.mono};`);

  // Font sizes
  lines.push('\n/* Font Sizes */');
  for (const [key, value] of Object.entries(typography.fontSize)) {
    lines.push(`--text-${key}: ${value};`);
  }

  // Line heights
  lines.push('\n/* Line Heights */');
  for (const [key, value] of Object.entries(typography.lineHeight)) {
    lines.push(`--line-height-${key}: ${value};`);
  }

  // Spacing
  lines.push('\n/* Spacing */');
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`--space-${key}: ${value};`);
  }

  // Border radius
  lines.push('\n/* Border Radius */');
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`--radius-${key}: ${value};`);
  }

  // Shadows
  lines.push('\n/* Shadows */');
  for (const [key, value] of Object.entries(shadows)) {
    lines.push(`--shadow-${key}: ${value};`);
  }

  // Animation
  lines.push('\n/* Animation */');
  lines.push(`--duration-fast: ${animation.duration.fast};`);
  lines.push(`--duration-normal: ${animation.duration.normal};`);
  lines.push(`--duration-slow: ${animation.duration.slow};`);
  lines.push(`--ease-out: ${animation.easing.out};`);
  lines.push(`--ease-in-out: ${animation.easing['in-out']};`);
  lines.push(`--ease-spring: ${animation.easing.spring};`);

  // Breakpoints
  lines.push('\n/* Breakpoints */');
  for (const [key, value] of Object.entries(breakpoints)) {
    lines.push(`--breakpoint-${key}: ${value};`);
  }

  // Z-index
  lines.push('\n/* Z-Index */');
  for (const [key, value] of Object.entries(zIndex)) {
    lines.push(`--z-${key}: ${value};`);
  }

  return lines.join('\n');
}

// Default export for convenient import
export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  animation,
  breakpoints,
  zIndex,
};
