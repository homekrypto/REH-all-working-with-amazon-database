'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Share2, 
  MessageSquare,
  Video,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Download
} from "lucide-react";

const marketingData = {
  totalReach: 45780,
  engagement: 8.2,
  impressions: 123450,
  clicks: 3210,
  socialFollowers: 15678,
  contentPieces: 67,
  campaignROI: 340
};

const platformMetrics = [
  {
    platform: 'Instagram',
    icon: Instagram,
    followers: 8420,
    engagement: 9.1,
    posts: 23,
    reach: 18500,
    color: 'text-pink-600'
  },
  {
    platform: 'YouTube',
    icon: Youtube,
    followers: 4230,
    engagement: 7.8,
    posts: 12,
    reach: 15200,
    color: 'text-red-600'
  },
  {
    platform: 'Facebook',
    icon: Facebook,
    followers: 2180,
    engagement: 6.4,
    posts: 18,
    reach: 8900,
    color: 'text-blue-600'
  },
  {
    platform: 'LinkedIn',
    icon: Linkedin,
    followers: 848,
    engagement: 8.9,
    posts: 14,
    reach: 3180,
    color: 'text-blue-700'
  }
];

const contentPerformance = [
  {
    id: '1',
    title: 'Luxury Penthouse Virtual Tour',
    type: 'Video',
    platform: 'Instagram',
    views: 12400,
    likes: 890,
    shares: 156,
    comments: 67,
    performance: 'excellent'
  },
  {
    id: '2',
    title: 'Market Trends 2024 Analysis',
    type: 'Blog Post',
    platform: 'LinkedIn',
    views: 8920,
    likes: 234,
    shares: 89,
    comments: 45,
    performance: 'good'
  },
  {
    id: '3',
    title: 'Property Investment Tips',
    type: 'Reel',
    platform: 'Instagram',
    views: 24680,
    likes: 1840,
    shares: 320,
    comments: 128,
    performance: 'excellent'
  }
];

export function MarketingMetrics() {
  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      average: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return variants[performance as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Marketing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketingData.totalReach.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+18.2%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketingData.engagement}%
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+1.3%</span>
              <span className="text-gray-500 ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketingData.clicks.toLocaleString()}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+24.7%</span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campaign ROI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketingData.campaignROI}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+45%</span>
              <span className="text-gray-500 ml-1">vs industry avg</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Your social media metrics across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformMetrics.map((platform) => (
              <div key={platform.platform} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <platform.icon className={`h-6 w-6 ${platform.color}`} />
                  <h4 className="font-medium text-gray-900">{platform.platform}</h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-medium">{platform.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium">{platform.engagement}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Posts</span>
                    <span className="font-medium">{platform.posts}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reach</span>
                    <span className="font-medium">{platform.reach.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your best content from the last 30 days</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentPerformance.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                    <Video className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{content.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{content.type}</span>
                      <span>•</span>
                      <span>{content.platform}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{content.views.toLocaleString()}</p>
                    <p className="text-gray-600">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{content.likes.toLocaleString()}</p>
                    <p className="text-gray-600">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{content.shares}</p>
                    <p className="text-gray-600">Shares</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{content.comments}</p>
                    <p className="text-gray-600">Comments</p>
                  </div>
                  <Badge className={getPerformanceBadge(content.performance)}>
                    {content.performance}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Current active campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: 'Luxury Properties Q1',
                budget: 5000,
                spent: 3200,
                leads: 45,
                conversion: 18.2,
                status: 'active'
              },
              {
                name: 'First-Time Buyers',
                budget: 3000,
                spent: 2850,
                leads: 67,
                conversion: 24.1,
                status: 'active'
              },
              {
                name: 'Investment Properties',
                budget: 4000,
                spent: 4000,
                leads: 32,
                conversion: 15.6,
                status: 'completed'
              }
            ].map((campaign, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Budget Used</p>
                    <p className="font-medium">
                      ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Leads Generated</p>
                    <p className="font-medium">{campaign.leads}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conversion Rate</p>
                    <p className="font-medium">{campaign.conversion}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cost per Lead</p>
                    <p className="font-medium">${Math.round(campaign.spent / campaign.leads)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Calendar</CardTitle>
            <CardDescription>Upcoming scheduled posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                date: 'Today, 2:00 PM',
                title: 'New Listing: Modern Condo',
                platform: 'Instagram',
                type: 'Post + Story'
              },
              {
                date: 'Tomorrow, 10:00 AM',
                title: 'Market Update Video',
                platform: 'YouTube',
                type: 'Video'
              },
              {
                date: 'Jan 18, 3:00 PM',
                title: 'Property Tips Blog',
                platform: 'LinkedIn',
                type: 'Article'
              },
              {
                date: 'Jan 19, 11:00 AM',
                title: 'Client Testimonial',
                platform: 'Facebook',
                type: 'Post'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{item.platform}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
