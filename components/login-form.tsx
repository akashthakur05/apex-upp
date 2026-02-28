'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SocialAuthButtons } from '@/components/social-auth-buttons';
import { useAuth } from '@/components/auth-provider';
import { getAuthConfig } from '@/lib/auth-config';

export default function LoginForm() {
  const router = useRouter();
  const { loginWithEmail, signupWithEmail, loginAnonymously } = useAuth();
  const config = getAuthConfig();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('signin');

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!loginWithEmail) {
        throw new Error('Email authentication is not available');
      }

      await loginWithEmail(signInEmail, signInPassword);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!signupWithEmail) {
        throw new Error('Sign up is not available');
      }

      if (signUpPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await signupWithEmail(signUpEmail, signUpPassword, signUpName);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!loginAnonymously) {
        throw new Error('Anonymous login is not available');
      }

      await loginAnonymously();
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to continue as guest');
      console.error('Anonymous login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { value: 'signin', label: 'Sign In', enabled: config.emailPassword },
    { value: 'signup', label: 'Sign Up', enabled: config.emailPassword },
    { value: 'guest', label: 'Continue as Guest', enabled: config.anonymous },
  ].filter(tab => tab.enabled);

  return (
    <Card className="w-full max-w-md p-8 shadow-lg">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">
            Sign in to access MCQ test series and track your progress
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        {tabs.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
              {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Sign In Tab */}
            {config.emailPassword && (
              <TabsContent value="signin" className="space-y-4 mt-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={e => setSignInEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm">
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={e => setSignInPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
            )}

            {/* Sign Up Tab */}
            {config.emailPassword && (
              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signUpName}
                      onChange={e => setSignUpName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={e => setSignUpEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={e => setSignUpPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 6 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            )}

            {/* Guest Tab */}
            {config.anonymous && (
              <TabsContent value="guest" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Continue as a guest to explore the MCQ test series. You can create an account later to save your progress.
                </p>
                <Button
                  onClick={handleAnonymousLogin}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                      Continuing...
                    </span>
                  ) : (
                    'Continue as Guest'
                  )}
                </Button>
              </TabsContent>
            )}
          </Tabs>
        )}

        {/* Social Auth Buttons */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted-foreground/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SocialAuthButtons
          disabled={loading}
          onLoading={setLoading}
          onError={setError}
        />

        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </Card>
  );
}
