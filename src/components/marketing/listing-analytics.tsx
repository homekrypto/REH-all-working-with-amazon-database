'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, 
  Eye, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Star,
  Filter
} from "lucide-react";

const listingMetrics = {
  totalListings: 18,
  activeListings: 15,
  soldThisMonth: 3,
  avgViewsPerListing: 2340,
  avgTimeOnMarket: 28,
  listingToSaleRatio: 85.7
};

const topListings = [
  {
    id: '1',
    title: 'Luxury Penthouse - Downtown',
    price: 1250000,
    views: 12400,
    inquiries: 45,
    favorites: 89,
    daysOnMarket: 12,
    status: 'active',
    performance: 'excellent',
    location: 'Manhattan, NY'
  },
  {
    id: '2',
    title: 'Modern Family Home',
    price: 850000,
    views: 8920,
    inquiries: 32,
    favorites: 67,
    daysOnMarket: 18,
    status: 'active',
    performance: 'good',
    location: 'Brooklyn, NY'
  },
  {
    id: '3',
    title: 'Waterfront Villa',
    price: 2100000,
    views: 15600,
    inquiries: 23,
    favorites: 156,
    daysOnMarket: 35,
    status: 'active',
    performance: 'average',
    location: 'Hamptons, NY'
  },
  {
    id: '4',
    title: 'Studio Apartment',
    price: 425000,
    views: 5670,
    inquiries: 67,
    favorites: 34,
    daysOnMarket: 8,
    status: 'sold',
    performance: 'excellent',
    location: 'Queens, NY'
  }
];

const marketData = [
  {
    location: 'Manhattan',
    avgPrice: 1850000,
    priceChange: 5.2,
    inventory: 234,
    daysOnMarket: 45,
    trend: 'up'
  },
  {
    location: 'Brooklyn',
    avgPrice: 965000,
    priceChange: 3.8,
    inventory: 187,
    daysOnMarket: 32,
    trend: 'up'
  },
  {
    location: 'Queens',
    avgPrice: 675000,
    priceChange: -1.2,
    inventory: 298,
    daysOnMarket: 28,
    trend: 'down'
  },
  {
    location: 'Bronx',
    avgPrice: 485000,
    priceChange: 2.1,
    inventory: 156,
    daysOnMarket: 22,
    trend: 'up'
  }
];

export function ListingAnalytics() {
  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      average: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return variants[performance as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-blue-100 text-blue-800',
      withdrawn: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Listing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listingMetrics.activeListings}
                </p>
              </div>
              <Home className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500">of {listingMetrics.totalListings} total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listingMetrics.avgViewsPerListing.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.3%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sold This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listingMetrics.soldThisMonth}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500">
                {listingMetrics.listingToSaleRatio}% conversion rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Time on Market</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listingMetrics.avgTimeOnMarket}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">-5 days</span>
              <span className="text-gray-500 ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Listings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listing Performance</CardTitle>
              <CardDescription>Your properties and their engagement metrics</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topListings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{listing.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{listing.location}</span>
                      <span>•</span>
                      <span>${listing.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusBadge(listing.status)}>
                        {listing.status}
                      </Badge>
                      <Badge className={getPerformanceBadge(listing.performance)}>
                        {listing.performance}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{listing.views.toLocaleString()}</p>
                    <p className="text-gray-600">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{listing.inquiries}</p>
                    <p className="text-gray-600">Inquiries</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{listing.favorites}</p>
                    <p className="text-gray-600">Favorites</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{listing.daysOnMarket}</p>
                    <p className="text-gray-600">Days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>Local market trends and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.map((market) => (
              <div key={market.location} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{market.location}</h4>
                  {market.trend === 'up' ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Price</span>
                    <span className="font-medium">${market.avgPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price Change</span>
                    <span className={`font-medium ${
                      market.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {market.priceChange > 0 ? '+' : ''}{market.priceChange}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Inventory</span>
                    <span className="font-medium">{market.inventory}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Days on Market</span>
                    <span className="font-medium">{market.daysOnMarket}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Listing Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key factors driving your listing success</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Top Performance Factor</h4>
              </div>
              <p className="text-sm text-green-800">
                Properties with professional photography get 67% more views
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-gray-600">Virtual Tours</span>
                <span className="font-medium">+45% engagement</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-gray-600">Video Content</span>
                <span className="font-medium">+32% inquiries</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-gray-600">Social Media Promotion</span>
                <span className="font-medium">+28% views</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-gray-600">Staging</span>
                <span className="font-medium">-15% time on market</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Recommendations</CardTitle>
            <CardDescription>AI-powered pricing insights for your listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topListings.slice(0, 3).map((listing) => (
              <div key={listing.id} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{listing.title}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Price</span>
                    <span className="font-medium">${listing.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Market Value</span>
                    <span className="font-medium">${(listing.price * 0.98).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recommendation</span>
                    <span className="text-green-600 font-medium">Optimal pricing</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
