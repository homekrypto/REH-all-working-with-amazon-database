'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Share2, 
  Play,
  Download,
  Calendar,
  Clock
} from "lucide-react";

interface VideoMetrics {
  id: string;
  title: string;
  platform: string;
  views: number;
  likes: number;
  shares: number;
  duration: string;
  publishedAt: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
  engagement: number;
}

const mockMetrics: VideoMetrics[] = [
  {
    id: '1',
    title: 'Luxury Penthouse Tour',
    platform: 'Instagram',
    views: 12500,
    likes: 890,
    shares: 156,
    duration: '3:45',
    publishedAt: '2024-01-15',
    performance: 'excellent',
    engagement: 8.2
  },
  {
    id: '2',
    title: 'Modern Family Home',
    platform: 'YouTube',
    views: 8920,
    likes: 567,
    shares: 89,
    duration: '2:30',
    publishedAt: '2024-01-12',
    performance: 'good',
    engagement: 6.8
  },
  {
    id: '3',
    title: 'Studio Apartment Reel',
    platform: 'TikTok',
    views: 24680,
    likes: 1840,
    shares: 320,
    duration: '0:45',
    publishedAt: '2024-01-10',
    performance: 'excellent',
    engagement: 9.1
  },
  {
    id: '4',
    title: 'Property Investment Tips',
    platform: 'LinkedIn',
    views: 3450,
    likes: 234,
    shares: 67,
    duration: '1:20',
    publishedAt: '2024-01-08',
    performance: 'average',
    engagement: 5.2
  }
];

const totalMetrics = {
  totalViews: 49550,
  totalLikes: 3531,
  totalShares: 632,
  avgEngagement: 7.3,
  topPerformer: 'Studio Apartment Reel',
  growthRate: 23.5
};

export function VideoAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [platform, setPlatform] = useState('all');

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      average: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return variants[performance as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getPlatformIcon = (platform: string) => {
    // In a real app, you'd use actual platform icons
    return <div className="w-6 h-6 bg-gray-300 rounded"></div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Video Analytics</h3>
          <p className="text-sm text-gray-500">Track your video performance across platforms</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalMetrics.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+{totalMetrics.growthRate}%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalMetrics.totalLikes.toLocaleString()}
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+15.2%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shares</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalMetrics.totalShares.toLocaleString()}
                </p>
              </div>
              <Share2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+28.7%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalMetrics.avgEngagement}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+5.3%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{totalMetrics.topPerformer}</h4>
              <p className="text-sm text-gray-600">Published on TikTok • 24.6K views</p>
              <Badge className="mt-1 bg-green-100 text-green-800">Excellent Performance</Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">9.1%</p>
              <p className="text-sm text-gray-600">Engagement Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Video Performance</CardTitle>
          <CardDescription>
            Detailed metrics for all your published videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMetrics.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                    <Play className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getPlatformIcon(video.platform)}
                      <span>{video.platform}</span>
                      <span>•</span>
                      <span>{video.duration}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>{video.publishedAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{video.views.toLocaleString()}</p>
                    <p className="text-gray-600">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{video.likes.toLocaleString()}</p>
                    <p className="text-gray-600">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{video.shares}</p>
                    <p className="text-gray-600">Shares</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{video.engagement}%</p>
                    <p className="text-gray-600">Engagement</p>
                  </div>
                  <Badge className={getPerformanceBadge(video.performance)}>
                    {video.performance}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
