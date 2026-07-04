import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0f1a10', color: 'grey.300', py: 6 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ExploreOutlinedIcon sx={{ color: 'secondary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'common.white' }}>
              TravelAI
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3}>
            <MuiLink href="/login" color="inherit" underline="hover">
              Sign in
            </MuiLink>
            <MuiLink href="/register" color="inherit" underline="hover">
              Get started
            </MuiLink>
          </Stack>
        </Stack>
        <Typography variant="body2" sx={{ mt: 3, color: 'grey.500' }}>
          © {new Date().getFullYear()} TravelAI — Discover authentic destinations
          beyond typical tourism.
        </Typography>
      </Container>
    </Box>
  );
}
