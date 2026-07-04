import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

/**
 * Temporary themed placeholder for the landing page. Confirms the design system
 * (Poppins, brand palette, rounded surfaces) is wired up. The real landing page
 * is built in a later step.
 */
export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <ExploreOutlinedIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h3" component="h1">
            TravelAI
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            Discover authentic destinations beyond typical tourism — hidden gems,
            heritage stories and living local culture.
          </Typography>
          <Chip
            label="Step 1 complete · Foundations ready"
            color="secondary"
            variant="outlined"
          />
        </Stack>
      </Container>
    </Box>
  );
}
