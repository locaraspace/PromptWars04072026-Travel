import * as React from 'react';
import type { Metadata } from 'next';
import MuiLink from '@mui/material/Link';
import AuthCard from '@/features/auth/components/AuthCard';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in · TravelAI',
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue exploring authentic destinations."
      footer={
        <>
          New to TravelAI?{' '}
          <MuiLink href="/register" sx={{ fontWeight: 600 }}>
            Create an account
          </MuiLink>
        </>
      }
    >
      {/* useSearchParams requires a Suspense boundary during prerender. */}
      <React.Suspense fallback={null}>
        <LoginForm />
      </React.Suspense>
    </AuthCard>
  );
}
