'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { signOut } from '@/lib/auth-client';

/** Signs the user out and returns them to the login screen. */
export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <Button
      variant="outlined"
      color="inherit"
      startIcon={<LogoutOutlinedIcon />}
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
