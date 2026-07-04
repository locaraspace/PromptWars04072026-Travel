import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PersonOutlineIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { requireSession } from '@/lib/session';
import SignOutButton from '@/features/auth/components/SignOutButton';
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

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
          >
            <Box>
              <Typography variant="h4" component="h1">
                Welcome, {session.user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your travel companion dashboard.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                href="/profile"
                variant="outlined"
                startIcon={<PersonOutlineIcon />}
              >
                Profile
              </Button>
              <SignOutButton />
            </Stack>
          </Stack>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Where to next?
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2.5 }}
              >
                Search any destination to discover attractions, hidden gems,
                heritage stories and authentic local experiences.
              </Typography>
              <SearchBox />
            </CardContent>
          </Card>

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
