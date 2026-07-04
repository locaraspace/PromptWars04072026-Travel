import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { requireSession } from '@/lib/session';
import { getDestinationBySlug } from '@/features/destinations/service';
import DestinationView from '@/features/destinations/components/DestinationView';
import SaveButton from '@/features/history/components/SaveButton';
import { isSaved } from '@/features/history/saved-service';
import EventsSection from '@/features/events/components/EventsSection';
import { getCachedEvents } from '@/features/events/service';

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireSession();
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const [saved, cachedEvents] = await Promise.all([
    isSaved(session.user.id, destination.id),
    getCachedEvents(destination.id),
  ]);

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', py: 5 }}>
      <Container maxWidth="md">
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
        >
          <Button href="/dashboard" startIcon={<ArrowBackIcon />}>
            Back to dashboard
          </Button>
          <SaveButton destinationId={destination.id} initialSaved={saved} />
        </Stack>
        <DestinationView destination={destination} />
        <Box sx={{ mt: 5 }}>
          <EventsSection slug={destination.slug} initialEvents={cachedEvents} />
        </Box>
      </Container>
    </Box>
  );
}
