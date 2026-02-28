# Authentication Migration Guide

If you had an existing login page or auth system, here's what changed and how to adapt.

## What Changed

### Login Page Improvements

**Before:**
- Only Google sign-in button
- No email/password option
- No anonymous/guest access
- Simple, single-button page

**After:**
- Multi-tab interface (Sign In, Sign Up, Guest)
- Email/password authentication with full forms
- Anonymous user support
- All social providers (Google, GitHub, Apple)
- Fully configurable via environment variables

### Authentication Provider Enhancement

**Before:**
- Used Firebase for Google auth
- localStorage fallback for email auth

**After:**
- Full Firebase support for all methods
- Email/password via Firebase Authentication
- Anonymous auth via Firebase
- Social auth via Firebase providers
- Proper async auth state management
- Methods exported: `loginWithEmail`, `signupWithEmail`, `loginAnonymously`, `logout`

### Feature Gating

**New:**
- `useCanSaveQuestions()` hook for checking permissions
- Anonymous users cannot save questions
- Automatic UI disabling/hiding for restricted features
- Upgrade prompts shown when anonymous users try gated features

## Configuration

### 1. Update Environment Variables

Create or update your `.env.local`:

```env
# Existing Firebase config (unchanged)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... other Firebase vars ...

# NEW: Auth method toggles
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=true
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
NEXT_PUBLIC_AUTH_GITHUB_ENABLED=false
NEXT_PUBLIC_AUTH_APPLE_ENABLED=false
```

### 2. Enable Required Firebase Features

In Firebase Console:
- Authentication > Sign-in method > Enable "Email/Password"
- Authentication > Sign-in method > Enable "Anonymous"
- Authentication > Sign-in method > Ensure "Google" is enabled

## Code Changes Required

### If You Had Custom Auth Logic

You no longer need custom auth functions. Use the new context methods:

**Old way (using localStorage):**
```typescript
const login = async (email: string, password: string) => {
  const user = { uid: Date.now().toString(), email };
  localStorage.setItem('user', JSON.stringify(user));
  setUser(user);
};
```

**New way (using Firebase + Context):**
```typescript
const { loginWithEmail } = useAuth();
await loginWithEmail(email, password);
```

### If You Had Conditional Auth UI

**Old way:**
```typescript
const renderLoginPage = () => {
  return <GoogleSignInButton />;
};
```

**New way:**
```typescript
import LoginForm from '@/components/login-form';

// Automatically renders correct tabs and buttons
// based on NEXT_PUBLIC_AUTH_* environment variables
<LoginForm />
```

### If You Protected Pages

**Old way:**
```typescript
if (!user) {
  router.push('/login');
}
```

**New way (with anonymous support):**
```typescript
import { useAuth } from '@/components/auth-provider';

const { user, loading } = useAuth();

if (!loading && !user) {
  router.push('/login');
}
```

### For Feature Gating

**Old way (probably no gating):**
```typescript
// No distinction between user types
const handleSave = async () => {
  await saveQuestion(question);
};
```

**New way (with anonymous gating):**
```typescript
import { useCanSaveQuestions } from '@/hooks/use-can-save-questions';

const canSave = useCanSaveQuestions();

const handleSave = async () => {
  if (!canSave) {
    showToast('Sign in to save questions');
    return;
  }
  await saveQuestion(question);
};
```

## Breaking Changes

### Auth Provider Return Type

The `AuthProvider` now exports additional methods:

```typescript
// Before
const { user, loading } = useAuth();

// After (also includes)
const { 
  user, 
  loading,
  loginWithEmail,        // NEW
  signupWithEmail,       // NEW
  loginAnonymously,      // NEW
  logout,                // NEW
} = useAuth();
```

### Anonymous User Handling

Firebase now returns a `user` object with `isAnonymous: true` for anonymous users.

Check user type with:
```typescript
import { isAnonymousUser } from '@/lib/auth-config';

if (isAnonymousUser(user)) {
  // Show anonymous-specific UI
}
```

## Migration Checklist

- [ ] Update `.env.local` with new `NEXT_PUBLIC_AUTH_*` variables
- [ ] Enable Email/Password and Anonymous auth in Firebase Console
- [ ] Replace old login page with `<LoginForm />` from `components/login-form.tsx`
- [ ] Update auth checks to use new `useAuth()` exports
- [ ] Add feature gating with `useCanSaveQuestions()` where needed
- [ ] Remove any localStorage-based auth logic
- [ ] Test all auth flows (email, google, anonymous)
- [ ] Test anonymous user restrictions (save, bookmarks, etc.)
- [ ] Test sign-in/sign-up forms work correctly

## Testing After Migration

### 1. Test Each Auth Method
```
✓ Email sign-up works
✓ Email sign-in works
✓ Google sign-in works
✓ Anonymous login works
✓ (GitHub/Apple if enabled)
```

### 2. Test Feature Gating
```
✓ Anonymous user can browse questions
✓ Anonymous user cannot save questions
✓ Anonymous user sees upgrade prompt when trying to save
✓ Authenticated user can save questions
✓ Authenticated user can view saved questions
```

### 3. Test Environment Variable Configuration
```
✓ Disable email: "Sign In" and "Sign Up" tabs disappear
✓ Disable anonymous: "Continue as Guest" tab disappears
✓ Disable google: Google button disappears
✓ Enable github: GitHub button appears
```

### 4. Test Edge Cases
```
✓ Switching from anonymous to authenticated works
✓ Logout and re-login works
✓ Page refresh maintains auth state
✓ Browser back button doesn't break auth state
```

## Rollback Instructions

If you need to rollback to the old system:

1. Keep the old login page code in git history
2. Revert `components/login-form.tsx` to original
3. Remove `lib/auth-config.ts`
4. Remove social auth components
5. Revert `components/auth-provider.tsx` to original version
6. Remove new environment variables

However, we recommend staying with the new system as it's more flexible and feature-rich.

## Common Issues & Solutions

### Login page shows no tabs
**Problem:** All auth methods disabled in env variables
**Solution:** Set at least one `NEXT_PUBLIC_AUTH_*` to true

### "Firebase not initialized" error
**Problem:** Firebase config variables not set
**Solution:** Verify all `NEXT_PUBLIC_FIREBASE_*` vars are in `.env.local`

### Anonymous login doesn't work
**Problem:** Anonymous auth not enabled in Firebase Console
**Solution:** Firebase Console > Auth > Sign-in methods > Enable Anonymous

### Save button still shows for anonymous users
**Problem:** Not using `useCanSaveQuestions()` hook
**Solution:** Wrap save functionality with the hook as shown above

### Old localStorage data lost
**Problem:** Migrated to Firebase auth
**Solution:** Clear localStorage in browser dev tools if needed
```javascript
localStorage.clear();
// Or specific keys:
localStorage.removeItem('user');
localStorage.removeItem('viewed_notifications');
```

## Support

For detailed documentation, see:
- `AUTHENTICATION.md` - Full API reference and setup guide
- `AUTH_IMPLEMENTATION_SUMMARY.md` - What was built and how to use it
- Inline code comments in modified files

Questions? Check the code in:
- `components/login-form.tsx` - See example form usage
- `components/question-viewer.tsx` - See example feature gating
- `hooks/use-can-save-questions.ts` - See how to check permissions
