import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Destinations', href: '#destinations' },
];

/** Public marketing header shown on the landing page. */
export default function LandingHeader() {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(16,24,40,0.06)',
      }}
    >
      <Toolbar sx={{ maxWidth: 'lg', mx: 'auto', width: '100%', gap: 2 }}>
        <MuiLink
          href="/"
          underline="none"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <ExploreOutlinedIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            TravelAI
          </Typography>
        </MuiLink>

        <Stack
          direction="row"
          spacing={3}
          sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
        >
          {NAV_LINKS.map((link) => (
            <MuiLink
              key={link.href}
              href={link.href}
              color="text.secondary"
              underline="none"
              sx={{ fontWeight: 500, '&:hover': { color: 'text.primary' } }}
            >
              {link.label}
            </MuiLink>
          ))}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button href="/login" color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Sign in
          </Button>
          <Button href="/register" variant="contained">
            Get started
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
