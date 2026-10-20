// Design tokens for the Spending Insights Dashboard.
// All colors are defined here as the single source of truth and exposed as
// CSS custom properties in src/index.css. UI components must reference tokens,
// never raw Tailwind [type]-[color]-[variant] utility classes.
//
// Naming is role-based, not color-based:
//   surface / text / border / success / warning / danger / error
//   variants: subtle | default | strong | light

export const COLORS = {
  // ── Surface ──
  surface: {
    white: '#ffffff',
    canvas: 'rgba(248, 250, 252, 0.6)', // page background
    subtle: '#f8fafc', // hover rows
    default: '#f1f5f9', // card backgrounds, dividers
    muted: '#e2e8f0', // skeleton, progress bar track
    dark: '#0f172a', // dark panels, gradients
  },
  // ── Text ──
  text: {
    default: '#0f172a', // headings, primary content
    secondary: '#475569', // secondary labels
    muted: '#94a3b8', // captions, small labels
    subtle: '#cbd5e1', // de-emphasized text on dark
    inverse: '#ffffff', // text on dark backgrounds
  },
  // ── Success ──
  success: {
    subtle: '#ecfdf5', // bg tint
    default: '#10b981', // solid color (dots, bars)
    strong: '#059669', // text color
    light: '#6ee7b7', // lighter text on subtle bg
  },
  // ── Warning ──
  warning: {
    subtle: '#fffbeb', // bg tint
    default: '#f59e0b', // solid color
    strong: '#a16207', // text color
  },
  // ── Danger ──
  danger: {
    subtle: '#fff1f2', // bg tint
    default: '#f43f5e', // solid color
    strong: '#be123c', // text color
    light: '#fb7185', // lighter text on subtle bg
  },
  // ── Error (critical) ──
  error: {
    subtle: '#fecaca', // border bg
    default: '#b91c1c', // text / border
  },
  // ── Border ──
  border: {
    subtle: '#e2e8f0', // input borders, card borders
    default: '#cbd5e1', // hover borders
    dark: '#0f172a', // selected states
  },
} as const;

export type ColorRole = keyof typeof COLORS;
