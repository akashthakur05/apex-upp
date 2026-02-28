/**
 * Auth Configuration
 * Controls which authentication methods are enabled via environment variables
 */

export interface AuthConfig {
  emailPassword: boolean;
  anonymous: boolean;
  google: boolean;
  github: boolean;
  apple: boolean;
}

export function getAuthConfig(): AuthConfig {
  return {
    emailPassword: process.env.NEXT_PUBLIC_AUTH_EMAIL_ENABLED !== 'false',
    anonymous: process.env.NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED === 'true',
    google: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED !== 'false',
    github: process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === 'true',
    apple: process.env.NEXT_PUBLIC_AUTH_APPLE_ENABLED === 'true',
  };
}

/**
 * Determines if a user is anonymous
 */
export function isAnonymousUser(user: any): boolean {
  return user?.isAnonymous === true;
}

/**
 * Determines if user can save questions (requires non-anonymous account)
 */
export function canUserSaveQuestions(user: any): boolean {
  return user && !isAnonymousUser(user);
}

/**
 * Determines if user can access bookmarks (requires non-anonymous account)
 */
export function canUserAccessBookmarks(user: any): boolean {
  return user && !isAnonymousUser(user);
}

/**
 * Determines if user can view progress tracking (requires non-anonymous account)
 */
export function canUserTrackProgress(user: any): boolean {
  return user && !isAnonymousUser(user);
}
