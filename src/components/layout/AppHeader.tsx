import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import PersonOutlineIcon from '@mui/icons-material/Person';
import SignOutButton from '@/features/auth/components/SignOutButton';

/** Authenticated app header shown on dashboard, profile and destination pages. */
export default function AppHeader() {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(16,24,40,0.06)',
      }}
    >
      <Toolbar sx={{ maxWidth: 'lg', mx: 'auto', width: '100%', gap: 1.5 }}>
        <MuiLink
          href="/dashboard"
          underline="none"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
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

        <Button
          href="/dashboard"
          color="inherit"
          startIcon={<SpaceDashboardOutlinedIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Dashboard
        </Button>
        <Button
          href="/profile"
          color="inherit"
          startIcon={<PersonOutlineIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Profile
        </Button>
        <SignOutButton />
      </Toolbar>
    </AppBar>
  );
}
