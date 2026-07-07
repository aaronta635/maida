import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/crm/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ['/staff/:path*', '/crm/:path*', '/login', '/auth/callback'],
};
