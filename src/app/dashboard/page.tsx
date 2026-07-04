import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { requireSession } from '@/lib/session';
import AppHeader from '@/components/layout/AppHeader';
import SearchBox from '@/features/search/components/SearchBox';
import DestinationSection from '@/features/history/components/DestinationSection';
import { getRecentSearches } from '@/features/history/history-service';
import { getSavedDestinations } from '@/features/history/saved-service';

export const metadata: Metadata = {
  title: 'Dashboard · TravelAI',
};

export default async function DashboardPage() {
  const session = await requireSession();
  const [recent, saved] = await Promise.all([
    getRecentSearches(session.user.id),
    getSavedDestinations(session.user.id),
  ]);

  const firstName = session.user.name.split(' ')[0] ?? session.user.name;

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <AppHeader />

      {/* Search hero */}
      <Box
        sx={{
          background:
            'linear-gradient(135deg, #2E7D32 0%, #1B5E20 60%, #14481a 100%)',
          color: 'common.white',
          py: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Where to next, {firstName}?
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Search any destination for attractions, hidden gems, heritage,
                cuisine, cultural experiences and live events.
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                p: { xs: 2, sm: 2.5 },
                boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
              }}
            >
              <SearchBox />
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={5}>
          <DestinationSection
            title="Recent searches"
            icon={<AccessTimeIcon color="action" />}
            items={recent}
            emptyText="Your recent searches will appear here once you start exploring."
          />
          <DestinationSection
            title="Saved places"
            icon={<BookmarkBorderIcon color="action" />}
            items={saved}
            emptyText="Bookmark a destination to keep it here for later."
          />
        </Stack>
      </Container>
    </Box>
  );
}
