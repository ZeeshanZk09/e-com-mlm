// proxy.ts
import { apiPrefixAuth, authRoutes, publicPrefixes, puplicRoutes } from '@/shared/lib/route';
import { auth } from './auth';

export default auth((req) => {
  const { nextUrl } = req;
  try {
    const isLogedIn = !!req.auth;
    console.log('proxy.ts => req.auth: ', req.auth);

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiPrefixAuth);
    const isApiRoute = nextUrl.pathname.startsWith('/api');
    const isPuplic =
      puplicRoutes.includes(nextUrl.pathname) ||
      publicPrefixes.some((prefix) => nextUrl.pathname.startsWith(prefix));
    const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

    // Allow all API routes to pass through (they handle their own auth)
    if (isApiAuthRoute || isApiRoute) {
      return;
    }

    if (isAuthRoutes) {
      if (isLogedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return;
    }

    if (!isPuplic && !isLogedIn) {
      return Response.redirect(new URL('/auth/sign-in', nextUrl));
    }
    return;
  } catch (error) {
    console.error('Proxy error:', error);
    return Response.redirect(new URL('/auth/sign-in', nextUrl));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
