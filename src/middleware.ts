import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(15, '10 s'),
  ephemeralCache: new Map(),
  analytics: true,
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
): Promise<Response | undefined> {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }
  const ip = request.ip ?? '127.0.0.1';

  const { success, pending } = await ratelimit.limit(
    `ratelimit_middleware_${ip}`,
  );
  event.waitUntil(pending);

  if (success) {
    return NextResponse.next();
  }

  return new NextResponse(
    JSON.stringify({
      msg: 'Too many requests. Try again later.',
    }),
    { status: 429, headers: { 'content-type': 'application/json' } },
  );
}

export const config = {
  matcher: ['/api/:path((?!auth/session|blocked).*)'],
};
