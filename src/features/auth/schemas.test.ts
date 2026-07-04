import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '@/features/auth/schemas';

describe('registerSchema', () => {
  it('accepts a valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'Test Traveler',
      email: 'test@example.com',
      password: 'secret12345',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a short password', () => {
    const result = registerSchema.safeParse({
      name: 'Test',
      email: 'test@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'Test',
      email: 'not-an-email',
      password: 'secret12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty name', () => {
    const result = registerSchema.safeParse({
      name: '',
      email: 'test@example.com',
      password: 'secret12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts a valid login', () => {
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success,
    ).toBe(true);
  });

  it('rejects a missing password', () => {
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: '' }).success,
    ).toBe(false);
  });
});
