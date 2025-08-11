'use client';

import { ReactNode } from 'react';
import { useUser } from '@/contexts/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowUp } from 'lucide-react';
import Link from 'next/link';

interface FeatureGateProps {
  requiredRole?: 'USER' | 'AGENT' | 'EXPERT';
  requiredSubscription?: 'FREE' | 'BASIC' | 'PREMIUM' | 'EXPERT';
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function FeatureGate({
  requiredRole,
  requiredSubscription,
  feature,
  children,
  fallback
}: FeatureGateProps) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-yellow-600" />
            Authentication Required
          </CardTitle>
          <CardDescription>
            Please sign in to access {feature}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check role requirement
  if (requiredRole && !hasRequiredRole(user.role, requiredRole)) {
    return fallback || (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            Role Access Required
          </CardTitle>
          <CardDescription>
            {feature} requires {requiredRole.toLowerCase()} access or higher.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Your current role:</span>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Required role:</span>
            <Badge>{requiredRole}</Badge>
          </div>
          <Button asChild>
            <Link href="/pricing">
              <ArrowUp className="h-4 w-4 mr-2" />
              Upgrade Account
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check subscription requirement
  if (requiredSubscription && !hasRequiredSubscription(user.subscriptionStatus, requiredSubscription)) {
    return fallback || (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-600" />
            Subscription Required
          </CardTitle>
          <CardDescription>
            {feature} requires a {requiredSubscription.toLowerCase()} subscription or higher.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Your current plan:</span>
            <Badge variant="outline">{user.subscriptionStatus}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Required plan:</span>
            <Badge>{requiredSubscription}</Badge>
          </div>
          <Button asChild>
            <Link href="/pricing">
              <ArrowUp className="h-4 w-4 mr-2" />
              Upgrade Subscription
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'USER': 1,
    'AGENT': 2,
    'EXPERT': 3
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

function hasRequiredSubscription(userSubscription: string, requiredSubscription: string): boolean {
  const subscriptionHierarchy = {
    'FREE': 1,
    'BASIC': 2,
    'PREMIUM': 3,
    'EXPERT': 4
  };

  const userLevel = subscriptionHierarchy[userSubscription as keyof typeof subscriptionHierarchy] || 0;
  const requiredLevel = subscriptionHierarchy[requiredSubscription as keyof typeof subscriptionHierarchy] || 0;

  return userLevel >= requiredLevel;
}
