'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { EventDTO } from '@/features/events/service';

function formatDateRange(startISO: string | null, endISO: string | null): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  if (startISO && endISO && startISO !== endISO) return `${fmt(startISO)} – ${fmt(endISO)}`;
  if (startISO) return fmt(startISO);
  return '';
}

export default function EventsSection({
  slug,
  initialEvents,
}: {
  slug: string;
  initialEvents: EventDTO[];
}) {
  const [events, setEvents] = React.useState<EventDTO[]>(initialEvents);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loadedOnce, setLoadedOnce] = React.useState(initialEvents.length > 0);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error('request failed');
      const data = (await res.json()) as { events: EventDTO[] };
      setEvents(data.events);
      setLoadedOnce(true);
    } catch {
      setError('Could not load events right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} component="section">
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <EventOutlinedIcon color="action" />
          <Typography variant="h5" component="h2">
            Festivals &amp; events
          </Typography>
        </Stack>
        {loadedOnce && (
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={fetchEvents}
            disabled={loading}
          >
            Refresh
          </Button>
        )}
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Searching the web for upcoming events…
          </Typography>
        </Stack>
      )}

      {!loading && events.length === 0 && (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Typography variant="body2" color="text.secondary">
                {loadedOnce
                  ? 'No upcoming events found for this destination right now.'
                  : 'Events are refreshed live from the web. Fetch the latest festivals and happenings near this destination.'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<EventOutlinedIcon />}
                onClick={fetchEvents}
              >
                {loadedOnce ? 'Try again' : 'Find events'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {!loading &&
        events.map((event) => {
          const dates = formatDateRange(event.startDate, event.endDate);
          return (
            <Card key={event.id}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6">{event.title}</Typography>
                  {(dates || event.venue) && (
                    <Typography variant="body2" color="text.secondary">
                      {[dates, event.venue].filter(Boolean).join(' · ')}
                    </Typography>
                  )}
                  <Typography variant="body2">{event.description}</Typography>
                  {event.sourceUrl && (
                    <Box>
                      <MuiLink
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                      >
                        More details
                      </MuiLink>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
    </Stack>
  );
}
