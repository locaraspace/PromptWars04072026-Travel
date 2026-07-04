import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import type { FullDestination } from '@/features/destinations/service';

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={2} component="section">
      <Box>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Stack>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>{children}</Stack>
      </CardContent>
    </Card>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <Typography variant="body2" color="text.secondary">
      <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {label}:{' '}
      </Box>
      {value}
    </Typography>
  );
}

/** Full read-only render of a destination and all its content sections. */
export default function DestinationView({
  destination,
}: {
  destination: FullDestination;
}) {
  const location = [destination.city, destination.region, destination.country]
    .filter(Boolean)
    .join(', ');

  return (
    <Stack spacing={5}>
      {/* Header */}
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', color: 'text.secondary' }}
        >
          <PlaceOutlinedIcon fontSize="small" />
          <Typography variant="body2">{location}</Typography>
          {destination.source === 'AI_GENERATED' && (
            <Chip
              size="small"
              icon={<AutoAwesomeOutlinedIcon />}
              label="AI-crafted"
              color="secondary"
              variant="outlined"
            />
          )}
        </Stack>
        <Typography variant="h3" component="h1">
          {destination.name}
        </Typography>
        {destination.summary && (
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            {destination.summary}
          </Typography>
        )}
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {destination.description}
        </Typography>
        {destination.bestSeason && (
          <MetaLine label="Best season" value={destination.bestSeason} />
        )}
      </Stack>

      {/* Cultural experiences — the USP, surfaced first */}
      {destination.culturalExperiences.length > 0 && (
        <Section
          title="Cultural experiences"
          subtitle="Authentic, local and unforgettable — the heart of your trip."
        >
          {destination.culturalExperiences.map((exp) => (
            <InfoCard key={exp.id}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
              >
                <Typography variant="h6">{exp.title}</Typography>
                <Rating
                  value={exp.authenticityRating}
                  max={5}
                  readOnly
                  size="small"
                />
              </Stack>
              <Typography variant="body2">{exp.description}</Typography>
              <Divider />
              <MetaLine label="Duration" value={exp.duration} />
              <MetaLine label="Approx. cost" value={exp.estimatedCost} />
              <MetaLine label="Ideal time" value={exp.idealTime} />
              <MetaLine label="Local tips" value={exp.localTips} />
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  size="small"
                  label={exp.familyFriendly ? 'Family friendly' : 'Adults-oriented'}
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={exp.bookingRequired ? 'Booking required' : 'No booking needed'}
                  variant="outlined"
                />
              </Stack>
            </InfoCard>
          ))}
        </Section>
      )}

      {/* Attractions */}
      {destination.attractions.length > 0 && (
        <Section title="Top attractions">
          {destination.attractions.map((a) => (
            <InfoCard key={a.id}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
              >
                <Typography variant="h6">{a.title}</Typography>
                {a.category && (
                  <Chip size="small" label={a.category} variant="outlined" />
                )}
              </Stack>
              <Typography variant="body2">{a.description}</Typography>
              {a.area && <MetaLine label="Where" value={a.area} />}
              {a.bestTime && <MetaLine label="Best time" value={a.bestTime} />}
              {a.entryInfo && <MetaLine label="Entry" value={a.entryInfo} />}
            </InfoCard>
          ))}
        </Section>
      )}

      {/* Hidden gems */}
      {destination.hiddenGems.length > 0 && (
        <Section
          title="Hidden gems"
          subtitle="Beloved by locals, missed by most visitors."
        >
          {destination.hiddenGems.map((g) => (
            <InfoCard key={g.id}>
              <Typography variant="h6">{g.title}</Typography>
              <Typography variant="body2">{g.description}</Typography>
              <Divider />
              <MetaLine label="Why locals love it" value={g.whyLocalsLove} />
              <MetaLine label="Why tourists miss it" value={g.whyTouristsMiss} />
              <MetaLine label="Best time" value={g.bestVisitingTime} />
              <MetaLine label="Photography" value={g.photographyTips} />
              <MetaLine label="Nearby food" value={g.nearbyFood} />
            </InfoCard>
          ))}
        </Section>
      )}

      {/* Heritage story */}
      {destination.heritageStory && (
        <Section title="Heritage story">
          <InfoCard>
            <Typography variant="h6">
              {destination.heritageStory.title}
            </Typography>
            {destination.heritageStory.era && (
              <Chip
                size="small"
                label={destination.heritageStory.era}
                variant="outlined"
                sx={{ alignSelf: 'flex-start' }}
              />
            )}
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {destination.heritageStory.story}
            </Typography>
          </InfoCard>
        </Section>
      )}

      {/* Local food */}
      {destination.localFood.length > 0 && (
        <Section title="Local cuisine">
          {destination.localFood.map((f) => (
            <InfoCard key={f.id}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
              >
                <Typography variant="h6">{f.name}</Typography>
                {f.mustTry && (
                  <Chip size="small" label="Must try" color="secondary" />
                )}
              </Stack>
              <Typography variant="body2">{f.description}</Typography>
              {f.whereToTry && <MetaLine label="Where to try" value={f.whereToTry} />}
              {f.priceRange && <MetaLine label="Price" value={f.priceRange} />}
            </InfoCard>
          ))}
        </Section>
      )}

      {/* Travel tips */}
      {destination.travelTips.length > 0 && (
        <Section title="Travel tips">
          <InfoCard>
            {destination.travelTips.map((t) => (
              <Typography key={t.id} variant="body2">
                <Box component="span" sx={{ fontWeight: 600 }}>
                  {t.category ? `${t.category}: ` : ''}
                </Box>
                {t.tip}
              </Typography>
            ))}
          </InfoCard>
        </Section>
      )}
    </Stack>
  );
}
