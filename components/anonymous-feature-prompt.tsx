'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface AnonymousFeaturePromptProps {
  feature: 'save questions' | 'bookmarks' | 'progress tracking' | 'view saved';
  onDismiss?: () => void;
}

export function AnonymousFeaturePrompt({
  feature,
  onDismiss,
}: AnonymousFeaturePromptProps) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  const getFeatureMessage = () => {
    switch (feature) {
      case 'save questions':
        return 'Save questions for later review';
      case 'bookmarks':
        return 'Bookmark important questions';
      case 'progress tracking':
        return 'Track your test progress and performance';
      case 'view saved':
        return 'View your saved questions';
      default:
        return 'Access this feature';
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200 p-4">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">
            Sign In to {getFeatureMessage()}
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            Anonymous users cannot {feature}. Create an account or sign in to unlock
            this feature and more.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleSignIn}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
            {onDismiss && (
              <Button
                onClick={onDismiss}
                size="sm"
                variant="ghost"
                className="text-blue-600 hover:bg-blue-100"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
