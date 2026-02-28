# Authentication Quick Start

Get the new authentication system up and running in 5 minutes.

## 1. Configure Environment Variables

Copy and paste into your `.env.local`:

```env
# Firebase (get these from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Authentication Methods (toggle as needed)
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true          # Email/password registration
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=true      # Guest access
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true         # Google sign-in
NEXT_PUBLIC_AUTH_GITHUB_ENABLED=false        # GitHub (optional)
NEXT_PUBLIC_AUTH_APPLE_ENABLED=false         # Apple (optional)
```

## 2. Enable Auth Methods in Firebase

Go to Firebase Console → Authentication → Sign-in method:
- ✅ Enable "Email/Password"
- ✅ Enable "Anonymous"
- ✅ Enable "Google" (should be default)

## 3. That's It!

The login page now automatically:
- Shows email sign-up/sign-in tabs
- Shows "Continue as Guest" option
- Shows Google login button
- Handles all authentication

## Testing Different Configurations

### Want email + anonymous only?
```env
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=true
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=false
```

### Want all social logins?
```env
NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true
NEXT_PUBLIC_AUTH_APPLE_ENABLED=true
# Keep others enabled too
```

### Want Google only?
```env
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=false
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=false
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
```

## Using in Your Code

### Check if user is logged in
```typescript
import { useAuth } from '@/components/auth-provider';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.displayName}!</div>;
}
```

### Check if user can save questions
```typescript
import { useCanSaveQuestions } from '@/hooks/use-can-save-questions';

function SaveButton() {
  const canSave = useCanSaveQuestions();
  
  return (
    <button disabled={!canSave}>
      {canSave ? 'Save Question' : 'Sign in to save'}
    </button>
  );
}
```

### Sign in/out programmatically
```typescript
import { useAuth } from '@/components/auth-provider';

function AuthButtons() {
  const { loginWithEmail, logout } = useAuth();
  
  return (
    <>
      <button onClick={() => loginWithEmail('user@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={logout}>Sign Out</button>
    </>
  );
}
```

## Feature Restrictions for Anonymous Users

Anonymous users can't:
- Save questions
- Bookmark questions
- Track progress
- View saved questions

They'll see a prompt encouraging them to sign in.

## Common Env Configurations

**Recommended (Flexible):**
```env
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=true
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
```

**Simple (Email Only):**
```env
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=false
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=false
```

**Enterprise (OAuth Only):**
```env
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=false
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true
NEXT_PUBLIC_AUTH_APPLE_ENABLED=true
NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=false
```

## Available Auth Methods

| Method | Default | Implementation |
|--------|---------|-----------------|
| Email/Password | ✅ Enabled | Full signup + login forms |
| Anonymous | ❌ Disabled | One-click guest access |
| Google | ✅ Enabled | OAuth via Firebase |
| GitHub | ❌ Disabled | OAuth via Firebase |
| Apple | ❌ Disabled | OAuth via Firebase |

## Files You Need to Know

- **`components/login-form.tsx`** - Multi-tab login interface (auto-configures)
- **`components/auth-provider.tsx`** - Auth context providing user & methods
- **`lib/auth-config.ts`** - Configuration reader from env variables
- **`hooks/use-can-save-questions.ts`** - Feature gating hook
- **`.env.example`** - Reference for all env variables

## Troubleshooting

**No login tabs showing?**
- Check env variables are set (at least one `NEXT_PUBLIC_AUTH_*_ENABLED=true`)
- Check `.env.local` is saved

**Anonymous login failing?**
- Ensure `NEXT_PUBLIC_AUTH_ANONYMOUS_ENABLED=true`
- Check Firebase has Anonymous auth enabled

**Email signup not working?**
- Ensure `NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true`
- Check Firebase has Email/Password enabled

**Google sign-in failing?**
- Ensure `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`
- Check Firebase Google OAuth is configured

## Full Documentation

For more details, see:
- `AUTHENTICATION.md` - Complete API reference & setup guide
- `AUTH_IMPLEMENTATION_SUMMARY.md` - What was built
- `AUTH_MIGRATION_GUIDE.md` - Upgrading from old auth system

## Next Steps

1. ✅ Set env variables
2. ✅ Enable auth methods in Firebase Console
3. ✅ Test sign-up and login
4. ✅ Test anonymous access
5. ✅ Test feature gating (try saving as anonymous)
6. 📖 Read full documentation for advanced features

Enjoy! 🚀
