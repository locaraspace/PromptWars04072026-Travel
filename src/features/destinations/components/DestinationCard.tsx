import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { tokens } from '@/theme/theme';

interface DestinationCardProps {
  slug: string;
  name: string;
  country: string;
  summary: string | null;
}

/** Compact, clickable destination card reused by Recent and Saved lists. */
export default function DestinationCard({
  slug,
  name,
  country,
  summary,
}: DestinationCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform .2s ease, box-shadow .2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: tokens.shadowHover,
        },
      }}
    >
      <CardActionArea href={`/destination/${slug}`} sx={{ height: '100%' }}>
        <CardContent>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {name}
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: 'center', color: 'text.secondary' }}
            >
              <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{country}</Typography>
            </Stack>
            {summary && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {summary}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
