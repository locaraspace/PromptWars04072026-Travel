import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import TempleHinduOutlinedIcon from '@mui/icons-material/TempleHinduOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import FestivalOutlinedIcon from '@mui/icons-material/FestivalOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LandingHeader from '@/components/layout/LandingHeader';
import Footer from '@/components/layout/Footer';
import { tokens } from '@/theme/theme';

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const HERO_IMG = img('1524492412937-b28074a5d7da', 1900);

const FEATURES = [
  {
    icon: <TempleHinduOutlinedIcon />,
    title: 'Iconic attractions',
    text: 'The must-see landmarks, told like a story rather than a checklist.',
  },
  {
    icon: <VisibilityOffOutlinedIcon />,
    title: 'Hidden gems',
    text: 'The spots locals love and most travellers walk right past.',
  },
  {
    icon: <MenuBookOutlinedIcon />,
    title: 'Immersive heritage',
    text: 'Living history that transports you, not dry museum captions.',
  },
  {
    icon: <Diversity3Icon />,
    title: 'Cultural experiences',
    text: 'Authentic, bookable experiences — the heart of every trip.',
  },
  {
    icon: <LocalDiningOutlinedIcon />,
    title: 'Local cuisine',
    text: 'What to eat, where to find it, and what the locals swear by.',
  },
  {
    icon: <FestivalOutlinedIcon />,
    title: 'Live events',
    text: 'Festivals and happenings, refreshed from the web in real time.',
  },
];

const STEPS = [
  {
    icon: <SearchOutlinedIcon />,
    title: 'Search a destination',
    text: 'Type any place — a city, a temple, a region you are curious about.',
  },
  {
    icon: <AutoAwesomeIcon />,
    title: 'Get a crafted guide',
    text: 'We serve rich, journalist-quality content instantly, or craft it with AI.',
  },
  {
    icon: <BookmarkBorderIcon />,
    title: 'Save & revisit',
    text: 'Bookmark places and keep your discoveries in one dashboard.',
  },
];

const DESTINATIONS = [
  { name: 'Agra', tag: 'Taj Mahal', id: '1524492412937-b28074a5d7da' },
  { name: 'Varanasi', tag: 'Sacred ghats', id: '1561361513-2d000a50f0dc' },
  { name: 'Rajasthan', tag: 'Palaces & forts', id: '1599661046289-e31897846e41' },
  { name: 'Himalayas', tag: 'Mountain trails', id: '1477587458883-47145ed94245' },
];

export default function Home() {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <LandingHeader />

      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 520, md: 640 },
          display: 'flex',
          alignItems: 'center',
          color: 'common.white',
          backgroundImage: `linear-gradient(180deg, rgba(15,26,16,0.45) 0%, rgba(15,26,16,0.75) 100%), url(${HERO_IMG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} sx={{ py: 8 }}>
            <Chip
              icon={<AutoAwesomeIcon />}
              label="GenAI travel companion"
              sx={{
                alignSelf: 'flex-start',
                bgcolor: 'rgba(255,255,255,0.16)',
                color: 'common.white',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{ fontWeight: 700, fontSize: { xs: '2.4rem', md: '3.6rem' }, lineHeight: 1.1 }}
            >
              Discover the soul of a place, not just the sights.
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: 620, opacity: 0.92 }}>
              TravelAI reveals authentic destinations beyond typical tourism —
              hidden gems, immersive heritage, living culture and the experiences
              locals actually love.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button href="/register" variant="contained" size="large">
                Start exploring — it&apos;s free
              </Button>
              <Button
                href="/login"
                size="large"
                sx={{
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.6)',
                  '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
                }}
                variant="outlined"
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features */}
      <Box id="features" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack spacing={1.5} sx={{ textAlign: 'center', mb: 5, alignItems: 'center' }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
              What you&apos;ll discover
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700 }}>
              Everything for an authentic trip
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
              Six layers of rich, local knowledge for every destination — served
              instantly from our library or freshly crafted by AI.
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            {FEATURES.map((f) => (
              <Card key={f.title} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={1.5}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(46,125,50,0.10)',
                        color: 'primary.main',
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography variant="h6">{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {f.text}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How it works */}
      <Box id="how-it-works" sx={{ py: { xs: 7, md: 10 }, bgcolor: '#F1F5F1' }}>
        <Container maxWidth="lg">
          <Stack spacing={1.5} sx={{ textAlign: 'center', mb: 5, alignItems: 'center' }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
              How it works
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700 }}>
              From curiosity to itinerary in seconds
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            }}
          >
            {STEPS.map((s, i) => (
              <Card key={s.title} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        {s.icon}
                      </Box>
                      <Typography variant="overline" color="text.secondary">
                        Step {i + 1}
                      </Typography>
                    </Stack>
                    <Typography variant="h6">{s.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.text}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Destinations */}
      <Box id="destinations" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack spacing={1.5} sx={{ textAlign: 'center', mb: 5, alignItems: 'center' }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
              Popular right now
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700 }}>
              Places travellers are exploring
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            }}
          >
            {DESTINATIONS.map((d) => (
              <Box
                key={d.name}
                component="a"
                href="/register"
                sx={{
                  position: 'relative',
                  height: 240,
                  borderRadius: `${tokens.borderRadius}px`,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                  color: 'common.white',
                  boxShadow: tokens.shadowResting,
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%), url(${img(d.id)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform .25s ease, box-shadow .25s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: tokens.shadowHover },
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {d.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {d.tag}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md">
          <Stack spacing={3} sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700 }}>
              Your next journey starts with a search.
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9 }}>
              Create a free account and start discovering authentic destinations today.
            </Typography>
            <Button
              href="/register"
              variant="contained"
              color="secondary"
              size="large"
            >
              Get started free
            </Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
