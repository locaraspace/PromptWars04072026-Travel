import { describe, it, expect } from 'vitest';
import { apiSuccess, apiError } from '@/lib/api';

describe('apiSuccess', () => {
  it('returns the payload with a 200 status by default', async () => {
    const res = apiSuccess({ hello: 'world' });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ hello: 'world' });
  });

  it('honours a custom status', () => {
    expect(apiSuccess({ ok: true }, 201).status).toBe(201);
  });
});

describe('apiError', () => {
  it('returns an error body with the given status and code', async () => {
    const res = apiError('Nope', 401, 'UNAUTHORIZED');
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({
      error: 'Nope',
      code: 'UNAUTHORIZED',
    });
  });

  it('defaults to status 400', () => {
    expect(apiError('Bad').status).toBe(400);
  });
});
