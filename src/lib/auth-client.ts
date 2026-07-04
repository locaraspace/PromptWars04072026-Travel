'use client';

import { createAuthClient } from 'better-auth/react';

/**
 * Browser auth client. `baseURL` defaults to the current origin, so no config is
 * needed for same-origin usage. Re-export the common helpers for ergonomics.
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
