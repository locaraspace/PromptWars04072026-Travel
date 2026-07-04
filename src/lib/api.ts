import { NextResponse } from 'next/server';

/** Standard JSON success response. */
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/** Standard JSON error response with an optional machine-readable code. */
export function apiError(
  message: string,
  status = 400,
  code?: string,
): NextResponse {
  return NextResponse.json({ error: message, code }, { status });
}
