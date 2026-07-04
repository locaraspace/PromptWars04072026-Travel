import * as React from 'react';
import type { Metadata } from 'next';
import MuiLink from '@mui/material/Link';
import AuthCard from '@/features/auth/components/AuthCard';
import RegisterForm from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account · TravelAI',
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start discovering hidden gems and living local culture."
      footer={
        <>
          Already have an account?{' '}
          <MuiLink href="/login" sx={{ fontWeight: 600 }}>
            Sign in
          </MuiLink>
        </>
      }
    >
      <React.Suspense fallback={null}>
        <RegisterForm />
      </React.Suspense>
    </AuthCard>
  );
}
