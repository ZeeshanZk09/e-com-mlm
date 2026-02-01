/**
 * @type {string[]} puplicRoutes - Exact match public routes
 */
export const puplicRoutes: string[] = [
  '/',
  '/mlm',
  '/contact',
  '/faq',
  '/terms',
  '/privacy',
  '/cookies',
  '/shipping',
  '/returns',
  '/pricing',
];

/**
 * @type {string[]} publicPrefixes - Routes that start with these prefixes are public
 */
export const publicPrefixes: string[] = ['/shop', '/category', '/search'];
/**
 * @type {string[]} privateRoutes
 */
export const privateRoutes = ['/profile'];
/**
 * @type {string[]} authRoutes
 */
export const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-in/factor-one',
  '/auth/sign-in/reset-password',
  '/auth/sign-up',
  '/auth/sign-up/verify-email',
  '/auth/error',
];

/**
 * @type {string} apiPrefixAuth
 */
export const apiPrefixAuth = '/api/auth';

/**
 * @type {string} DEFAULT_REDIRECT
 */
export const DEFAULT_REDIRECT = '/profile';
