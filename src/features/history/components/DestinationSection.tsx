import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DestinationCard from '@/features/destinations/components/DestinationCard';

export interface DestinationSummary {
  slug: string;
  name: string;
  country: string;
  summary: string | null;
}

interface DestinationSectionProps {
  title: string;
  icon: React.ReactNode;
  items: DestinationSummary[];
  emptyText: string;
}

/** A dashboard section: a titled, responsive grid of destination cards, or an
 * empty-state message when there is nothing to show. */
export default function DestinationSection({
  title,
  icon,
  items,
  emptyText,
}: DestinationSectionProps) {
  return (
    <Stack spacing={2} component="section">
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {icon}
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Stack>

      {items.length === 0 ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {emptyText}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {items.map((item) => (
            <DestinationCard key={item.slug} {...item} />
          ))}
        </Box>
      )}
    </Stack>
  );
}
