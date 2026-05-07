export const colors = {
  black: "#5f6656",
  white: "#FFFFFF",
  accent: "#f4f4f0",
  accentSoft: "#d9ddd0",
  accentDeep: "#3a4134",
  surface: "#2f372e",
  surfaceSoft: "#252d25",
  surfaceBlue: "#3b4335",
  border: "#7b8471",
  muted: "#d8ddcf",
  faint: "#aab39f",
  chart: "#4f5747"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 56,
  "6xl": 72
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  "2xl": 36
} as const;

export const typography = {
  display: {
    fontFamily: "System",
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "800" as const
  },
  title: {
    fontFamily: "System",
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700" as const
  },
  body: {
    fontFamily: "System",
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "400" as const
  },
  caption: {
    fontFamily: "System",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600" as const
  }
} as const;

export const shadows = {
  glow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 42,
    elevation: 14
  },
  panel: {
    shadowColor: colors.black,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 36,
    elevation: 8
  }
} as const;
