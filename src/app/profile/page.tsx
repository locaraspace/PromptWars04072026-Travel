import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { requireSession } from '@/lib/session';
import SignOutButton from '@/features/auth/components/SignOutButton';

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

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Button
            href="/dashboard"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Back to dashboard
          </Button>

          <Typography variant="h4" component="h1">
            Profile
          </Typography>

          <Card>
            <CardContent>
              <Stack spacing={2} divider={<Divider flexItem />}>
                <Field label="Name" value={user.name} />
                <Field label="Email" value={user.email} />
                <Field
                  label="Email verified"
                  value={user.emailVerified ? 'Yes' : 'No'}
                />
              </Stack>
            </CardContent>
          </Card>

          <SignOutButton />
        </Stack>
      </Container>
    </Box>
  );
}
