import { useAuth } from '@/components/auth-provider';
import { isAnonymousUser } from '@/lib/auth-config';

/**
 * Hook to check if current user can save questions
 * Returns false for anonymous users
 */
export function useCanSaveQuestions() {
  const { user } = useAuth();
  return user && !isAnonymousUser(user);
}

/**
 * Hook to check if current user can access bookmarks
 * Returns false for anonymous users
 */
export function useCanAccessBookmarks() {
  const { user } = useAuth();
  return user && !isAnonymousUser(user);
}

/**
 * Hook to check if current user can track progress
 * Returns false for anonymous users
 */
export function useCanTrackProgress() {
  const { user } = useAuth();
  return user && !isAnonymousUser(user);
}

/**
 * Hook to get user's account status
 */
export function useAccountStatus() {
  const { user } = useAuth();
  return {
    isAuthenticated: !!user,
    isAnonymous: isAnonymousUser(user),
    canSaveQuestions: user && !isAnonymousUser(user),
    canAccessBookmarks: user && !isAnonymousUser(user),
    canTrackProgress: user && !isAnonymousUser(user),
  };
}
