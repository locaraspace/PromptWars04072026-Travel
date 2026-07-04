import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PersonOutlineIcon from '@mui/icons-material/Person';
import { requireSession } from '@/lib/session';
import SignOutButton from '@/features/auth/components/SignOutButton';

export const metadata: Metadata = {
  title: 'Dashboard · TravelAI',
};

export default async function DashboardPage() {
  const session = await requireSession();

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
                Coming next
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Destination search, recent searches and saved places will appear
                here as we build the recommendation engine.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
