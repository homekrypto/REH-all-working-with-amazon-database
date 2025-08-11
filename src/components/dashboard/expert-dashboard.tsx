'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Home, 
  Calendar,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  PenTool,
  BarChart3,
  Camera,
  Mail,
  Settings,
  Plus,
  Eye,
  MessageSquare,
  Phone
} from 'lucide-react';
import Link from 'next/link';

interface ExpertDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'AGENT' | 'EXPERT';
    subscriptionStatus: 'FREE' | 'PENDING' | 'ACTIVE' | 'CANCELED' | 'EXPIRED';
    packageId?: string;
    subscriptionEnd?: Date;
    package?: {
      name: string;
      listingsMax: number;
      features: any;
    };
  };
}

export default function ExpertDashboard({ user }: ExpertDashboardProps) {
  // Mock data - in real app, fetch from APIs
  const stats = {
    totalListings: 32,
    activeListings: 28,
    totalLeads: 156,
    monthlyLeads: 42,
    blogPosts: 18,
    socialPosts: 85,
    videosGenerated: 24,
    bookings: 12
  };

  const recentActivity = [
    { type: 'listing', title: 'New luxury condo listing added', time: '2 hours ago' },
    { type: 'lead', title: 'New lead from Instagram campaign', time: '4 hours ago' },
    { type: 'blog', title: 'AI blog post published', time: '1 day ago' },
    { type: 'video', title: 'Property reel generated', time: '2 days ago' },
  ];

  const socialStats = [
    { platform: 'Instagram', followers: '12.5K', posts: 34, icon: Instagram },
    { platform: 'YouTube', subscribers: '3.2K', videos: 18, icon: Youtube },
    { platform: 'Facebook', likes: '8.9K', posts: 22, icon: Facebook },
    { platform: 'LinkedIn', connections: '2.1K', articles: 12, icon: Linkedin },
  ];

  const maxListings = user.package?.listingsMax || 50;
  const listingUsage = (stats.totalListings / maxListings) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-16">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expert Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user.name}! Manage your premium real estate business.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {user.package?.name || 'Expert Plan'}
            </Badge>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalListings - stats.activeListings} pending
              </p>
              <Progress value={listingUsage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalListings} of {maxListings} used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyLeads}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blogPosts}</div>
              <p className="text-xs text-muted-foreground">
                AI-generated content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Video Content</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.videosGenerated}</div>
              <p className="text-xs text-muted-foreground">
                Reels & short videos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Marketing Tools */}
          <div className="lg:col-span-2 space-y-6">
            {/* Marketing Toolkit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Marketing Toolkit
                </CardTitle>
                <CardDescription>
                  AI-powered marketing tools to grow your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/expert/blog">
                      <PenTool className="h-6 w-6 mb-2" />
                      AI Blog Writer
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/expert/social">
                      <Instagram className="h-6 w-6 mb-2" />
                      Social Scheduler
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/expert/video">
                      <Camera className="h-6 w-6 mb-2" />
                      Video Generator
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/expert/analytics">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Performance</CardTitle>
                <CardDescription>
                  Track your social media presence across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialStats.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div key={platform.platform} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-medium">{platform.platform}</p>
                            <p className="text-sm text-gray-600">
                              {platform.followers || platform.subscribers || platform.likes || platform.connections}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {platform.posts || platform.videos || platform.articles}
                          </p>
                          <p className="text-sm text-gray-600">posts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Lead Capture & Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Lead Capture & Booking
                </CardTitle>
                <CardDescription>
                  Manage your lead capture forms and booking calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Lead Capture Forms</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active forms</span>
                      <Badge>3</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href="/expert/leads">
                        <Mail className="h-4 w-4 mr-2" />
                        Manage Forms
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Booking Calendar</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This month</span>
                      <Badge>{stats.bookings} bookings</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href="/expert/leads">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Calendar
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest business activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/add-listing">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Listing
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/expert/blog/new">
                    <PenTool className="h-4 w-4 mr-2" />
                    Write Blog Post
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/expert/social/schedule">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/expert/videos/generate">
                    <Camera className="h-4 w-4 mr-2" />
                    Generate Video
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>Expert Plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      {user.subscriptionStatus}
                    </Badge>
                  </div>
                  {user.subscriptionEnd && (
                    <div className="flex justify-between">
                      <span className="text-sm">Next billing</span>
                      <span className="text-sm font-medium">
                        {new Date(user.subscriptionEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/settings/subscription">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
