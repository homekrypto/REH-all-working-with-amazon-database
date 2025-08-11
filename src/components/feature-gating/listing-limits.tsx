'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Home, Plus, ArrowUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ListingLimitsProps {
  currentListings?: number;
  showAddButton?: boolean;
  onAddListing?: () => void;
}

export default function ListingLimits({
  currentListings = 0,
  showAddButton = true,
  onAddListing
}: ListingLimitsProps) {
  const { user, loading } = useUser();
  const [listingCount, setListingCount] = useState(currentListings);

  useEffect(() => {
    // In a real app, fetch current listing count from API
    setListingCount(currentListings);
  }, [currentListings]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-yellow-600" />
            Listing Management
          </CardTitle>
          <CardDescription>
            Sign in to manage your property listings.
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

  // Get package limits
  const getPackageLimits = () => {
    if (user.role === 'USER') {
      return { max: 0, canList: false, packageName: 'Free User' };
    }
    
    if (user.role === 'AGENT') {
      const packageLimits = {
        'basic': { max: 5, packageName: 'Basic Agent' },
        'standard': { max: 10, packageName: 'Standard Agent' },
        'professional': { max: 20, packageName: 'Professional Agent' }
      };
      
      const packageType = user.package?.name?.toLowerCase() || 'basic';
      return {
        ...packageLimits[packageType as keyof typeof packageLimits] || packageLimits.basic,
        canList: true
      };
    }
    
    if (user.role === 'EXPERT') {
      return { max: 50, canList: true, packageName: 'Expert' };
    }
    
    return { max: 0, canList: false, packageName: 'Unknown' };
  };

  const limits = getPackageLimits();
  const usagePercentage = limits.max > 0 ? (listingCount / limits.max) * 100 : 0;
  const isAtLimit = listingCount >= limits.max;
  const isNearLimit = usagePercentage >= 80;

  // Free users can't list properties
  if (!limits.canList) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            Property Listings
          </CardTitle>
          <CardDescription>
            Upgrade to an Agent or Expert plan to list properties.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">
            Free users can browse and contact agents but cannot list properties.
          </div>
          <Button asChild>
            <Link href="/pricing">
              <ArrowUp className="h-4 w-4 mr-2" />
              Upgrade to List Properties
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${isAtLimit ? 'border-red-200 bg-red-50' : isNearLimit ? 'border-yellow-200 bg-yellow-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Listings
          </div>
          <Badge variant="outline">{limits.packageName}</Badge>
        </CardTitle>
        <CardDescription>
          Manage your property listings and track usage limits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usage Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Listings Used</span>
            <span className="text-sm font-bold">
              {listingCount} of {limits.max}
            </span>
          </div>
          <Progress 
            value={usagePercentage} 
            className={`${isAtLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-green-100'}`}
          />
          {isAtLimit && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              You've reached your listing limit
            </div>
          )}
          {isNearLimit && !isAtLimit && (
            <div className="flex items-center gap-2 text-yellow-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              You're approaching your listing limit
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {showAddButton && (
            <Button 
              disabled={isAtLimit} 
              onClick={onAddListing}
              className="flex-1"
              asChild={!onAddListing}
            >
              {onAddListing ? (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Listing
                </>
              ) : (
                <Link href="/add-listing">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Listing
                </Link>
              )}
            </Button>
          )}
          
          <Button variant="outline" asChild>
            <Link href="/properties">
              <Home className="h-4 w-4 mr-2" />
              Manage All
            </Link>
          </Button>
        </div>

        {/* Upgrade Prompt */}
        {(isAtLimit || isNearLimit) && (
          <div className="pt-3 border-t">
            <div className="text-sm text-gray-600 mb-2">
              Need more listings? Upgrade your plan for higher limits.
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href="/pricing">
                <ArrowUp className="h-4 w-4 mr-2" />
                View Plans
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
