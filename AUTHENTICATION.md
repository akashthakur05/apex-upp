# Authentication System Documentation

## Overview

This application supports multiple authentication methods:
- **Email/Password** - Traditional account creation and sign-in
- **Anonymous** - Guest access without account creation
- **Google** - Sign in with Google account
- **GitHub** - Sign in with GitHub account (configurable)
- **Apple** - Sign in with Apple account (configurable)

All authentication methods are **configurable via environment variables**, allowing you to enable/disable specific methods based on your needs.

## Environment Variables

### Firebase Configuration
These are required for Firebase to work:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Authentication Methods Configuration

Control which authentication methods are available:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_AUTH_EMAIL_ENABLED` | `true` | Enable/disable email/password authentication |
| `NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED` | `false` | Enable/disable anonymous (guest) login |
| `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` | `true` | Enable/disable Google authentication |
| `NEXT_PUBLIC_AUTH_GITHUB_ENABLED` | `false` | Enable/disable GitHub authentication |
| `NEXT_PUBLIC_AUTH_APPLE_ENABLED` | `false` | Enable/disable Apple authentication |

### Example Configurations

**Email & Anonymous Only:**
```env
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=true
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=false
NEXT_PUBLIC_AUTH_GITHUB_ENABLED=false
NEXT_PUBLIC_AUTH_APPLE_ENABLED=false
```

**All Methods Enabled:**
```env
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=true
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true
NEXT_PUBLIC_AUTH_APPLE_ENABLED=true
```

**Google Only (No Registration):**
```env
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=false
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=false
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
```

## Authentication Flow

### Sign In Page (`/login`)

The login page automatically adjusts based on enabled authentication methods:

1. **Tabs appear for enabled methods:**
   - "Sign In" (if email enabled)
   - "Sign Up" (if email enabled)
   - "Continue as Guest" (if anonymous enabled)

2. **Social buttons appear** for all enabled social providers (Google, GitHub, Apple)

### Anonymous Users

Users can log in anonymously without creating an account. Anonymous users have restricted access to certain features:

#### Restricted Features (Anonymous Users):
- ❌ Cannot save questions
- ❌ Cannot access bookmarks
- ❌ Cannot track progress
- ❌ Cannot view saved questions

#### Available Features (All Users):
- ✅ Browse and view questions
- ✅ Explore test series
- ✅ View solutions

### Account Upgrade

Anonymous users see prompts when trying to access restricted features, encouraging them to sign in or create an account.

## Key Files & Components

### Configuration
- `lib/auth-config.ts` - Authentication configuration and feature gating utilities

### Components
- `components/auth-provider.tsx` - Auth context provider with all auth methods
- `components/login-form.tsx` - Multi-tab login form
- `components/social-auth-buttons.tsx` - Reusable social auth buttons
- `components/anonymous-feature-prompt.tsx` - Upgrade prompt for anonymous users
- `components/protected-layout.tsx` - Wrapper for pages requiring authentication

### Hooks
- `hooks/use-can-save-questions.ts` - Hook to check feature access for current user

### Utilities
- `lib/firebase.ts` - Firebase initialization

## Using the Authentication System

### Checking User Authentication

```typescript
import { useAuth } from '@/components/auth-provider';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Welcome, {user.displayName}!</div>;
}
```

### Checking if User Can Save Questions

```typescript
import { useCanSaveQuestions } from '@/hooks/use-can-save-questions';

function SaveButton() {
  const canSave = useCanSaveQuestions();
  
  if (!canSave) {
    return <div>Sign in to save questions</div>;
  }
  
  return <button onClick={handleSave}>Save Question</button>;
}
```

### Getting Full Account Status

```typescript
import { useAccountStatus } from '@/hooks/use-can-save-questions';

function AccountInfo() {
  const {
    isAuthenticated,
    isAnonymous,
    canSaveQuestions,
    canAccessBookmarks,
    canTrackProgress,
  } = useAccountStatus();
  
  return (
    <div>
      <p>Authenticated: {isAuthenticated}</p>
      <p>Anonymous: {isAnonymous}</p>
      <p>Can Save: {canSaveQuestions}</p>
    </div>
  );
}
```

### Programmatic Sign In/Out

```typescript
import { useAuth } from '@/components/auth-provider';

function AuthControls() {
  const { loginWithEmail, signupWithEmail, loginAnonymously, logout } = useAuth();
  
  const handleEmailSignIn = async () => {
    try {
      await loginWithEmail('user@example.com', 'password');
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };
  
  const handleSignUp = async () => {
    try {
      await signupWithEmail('user@example.com', 'password', 'John Doe');
    } catch (err) {
      console.error('Sign up failed:', err);
    }
  };
  
  const handleGuestLogin = async () => {
    try {
      await loginAnonymously();
    } catch (err) {
      console.error('Guest login failed:', err);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  
  return (
    <div>
      <button onClick={handleEmailSignIn}>Email Sign In</button>
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleGuestLogin}>Guest Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

## Firebase Setup

### Google Authentication
Google authentication is enabled by default. No additional setup required if Firebase credentials are configured.

### GitHub Authentication
To enable GitHub sign-in:

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable GitHub provider
3. Add your GitHub OAuth app credentials:
   - Client ID
   - Client Secret
4. Set `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true`

### Apple Authentication
To enable Apple sign-in:

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Apple provider
3. Configure Apple OAuth credentials
4. Set `NEXT_PUBLIC_AUTH_APPLE_ENABLED=true`

## Feature Gating Logic

The application uses the `isAnonymousUser()` and `canUserSaveQuestions()` functions to determine feature access:

```typescript
// Anonymous user check
function isAnonymousUser(user: any): boolean {
  return user?.isAnonymous === true;
}

// Can save questions check
function canUserSaveQuestions(user: any): boolean {
  return user && !isAnonymousUser(user);
}
```

Authenticated users who are NOT anonymous can:
- Save questions
- Access bookmarks
- Track progress

Anonymous users can only browse and view content.

## Security Considerations

1. **No localStorage for auth** - Auth state is managed through Firebase and context
2. **Server-side validation** - Always validate user permissions on the backend
3. **Anonymous data isolation** - Anonymous user data should not persist between sessions
4. **RLS Protection** - Use Firebase Security Rules to protect sensitive data

## Troubleshooting

### Login form not showing all tabs
- Check environment variables are set correctly
- Verify `getAuthConfig()` is returning expected values
- Check browser console for errors

### Anonymous login not working
- Verify `NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=true`
- Check Firebase project has Anonymous auth enabled
- Check Firebase Security Rules allow anonymous access

### Social auth buttons not appearing
- Verify respective `NEXT_PUBLIC_AUTH_*_ENABLED` variables are set to `true`
- Check Firebase project has providers configured
- Check browser console for authentication errors

### Feature gating not working
- Ensure `useCanSaveQuestions()` hook is used correctly
- Verify `isAnonymousUser()` returns correct value
- Check `useAuth()` is providing correct user object

## Future Enhancements

Consider implementing:
- Email verification for email/password auth
- Two-factor authentication
- Social account linking
- Account recovery/password reset
- Profile management for authenticated users
