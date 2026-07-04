import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { requireSession } from '@/lib/session';
import AppHeader from '@/components/layout/AppHeader';

export const metadata: Metadata = {
  title: 'Profile · TravelAI',
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}

export default async function ProfilePage() {
  const session = await requireSession();
  const { user } = session;

  const initial = user.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <AppHeader />
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Button
            href="/dashboard"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Back to dashboard
          </Button>

          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'primary.main',
                      fontSize: 28,
                      fontWeight: 600,
                    }}
                  >
                    {initial}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h1">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack spacing={2} divider={<Divider flexItem />}>
                  <Field label="Name" value={user.name} />
                  <Field label="Email" value={user.email} />
                  <Field
                    label="Email verified"
                    value={user.emailVerified ? 'Yes' : 'No'}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
