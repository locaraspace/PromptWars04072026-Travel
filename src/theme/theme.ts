import { createTheme } from '@mui/material/styles';

/**
 * TravelAI design tokens.
 *
 * Light-only Material Design theme inspired by Google Travel, Airbnb and
 * Tripadvisor: minimal, modern, premium and fast. Keep all brand colours and
 * shape decisions here so they are defined in exactly one place.
 */
export const tokens = {
  primary: '#2E7D32',
  secondary: '#FF9800',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  borderRadius: 12,
  fontFamily: 'var(--font-poppins), "Poppins", "Helvetica", "Arial", sans-serif',
} as const;

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: { main: tokens.primary },
    secondary: { main: tokens.secondary },
    background: {
      default: tokens.background,
      paper: tokens.surface,
    },
  },
  shape: {
    borderRadius: tokens.borderRadius,
  },
  typography: {
    fontFamily: tokens.fontFamily,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: tokens.surface,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: tokens.borderRadius },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: tokens.borderRadius },
      },
    },
  },
});

export default theme;
