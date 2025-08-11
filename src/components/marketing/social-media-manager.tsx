'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  Linkedin,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Video,
  Plus,
  Send,
  Edit,
  Trash2,
  Settings,
  TrendingUp,
  Users
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor?: Date;
  publishedAt?: Date;
  mediaType: 'text' | 'image' | 'video' | 'carousel';
  mediaUrls: string[];
  hashtags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PlatformStats {
  platform: string;
  connected: boolean;
  followers: number;
  posts: number;
  engagement: number;
  icon: any;
  color: string;
}

interface SocialMediaManagerProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function SocialMediaManager({ user }: SocialMediaManagerProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    platforms: [] as string[],
    mediaType: 'text' as 'text' | 'image' | 'video' | 'carousel',
    scheduledFor: '',
    hashtags: ''
  });

  const platformStats: PlatformStats[] = [
    {
      platform: 'Instagram',
      connected: true,
      followers: 12500,
      posts: 234,
      engagement: 4.2,
      icon: Instagram,
      color: 'text-pink-600'
    },
    {
      platform: 'Facebook',
      connected: true,
      followers: 8900,
      posts: 156,
      engagement: 3.8,
      icon: Facebook,
      color: 'text-blue-600'
    },
    {
      platform: 'LinkedIn',
      connected: true,
      followers: 2100,
      posts: 89,
      engagement: 5.1,
      icon: Linkedin,
      color: 'text-blue-700'
    },
    {
      platform: 'YouTube',
      connected: false,
      followers: 3200,
      posts: 24,
      engagement: 6.8,
      icon: Youtube,
      color: 'text-red-600'
    }
  ];

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        content: 'Just listed! Beautiful 3BR/2BA home in downtown with stunning city views. Perfect for first-time buyers! 🏠✨',
        platforms: ['Instagram', 'Facebook'],
        status: 'published',
        publishedAt: new Date('2025-08-08T10:00:00'),
        mediaType: 'image',
        mediaUrls: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500'],
        hashtags: ['realestate', 'newlisting', 'dreamhome', 'firsttimebuyer'],
        engagement: {
          likes: 245,
          comments: 18,
          shares: 12,
          views: 1250
        },
        createdAt: new Date('2025-08-08T09:00:00'),
        updatedAt: new Date('2025-08-08T09:00:00')
      },
      {
        id: '2',
        content: 'Market Update: Interest rates are showing positive trends for buyers this quarter. Great time to make a move! 📈',
        platforms: ['LinkedIn', 'Facebook'],
        status: 'scheduled',
        scheduledFor: new Date('2025-08-10T14:00:00'),
        mediaType: 'text',
        mediaUrls: [],
        hashtags: ['marketupdate', 'realestate', 'interestrates', 'buyersmarket'],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        createdAt: new Date('2025-08-09T11:00:00'),
        updatedAt: new Date('2025-08-09T11:00:00')
      },
      {
        id: '3',
        content: 'Top 5 home staging tips that sell houses faster. Swipe to see amazing before/after transformations! 🏡➡️✨',
        platforms: ['Instagram'],
        status: 'draft',
        mediaType: 'carousel',
        mediaUrls: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'
        ],
        hashtags: ['homestaging', 'sellfaster', 'beforeandafter', 'realestatetips'],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        createdAt: new Date('2025-08-09T15:00:00'),
        updatedAt: new Date('2025-08-09T15:00:00')
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handlePlatformToggle = (platform: string) => {
    const updatedPlatforms = formData.platforms.includes(platform)
      ? formData.platforms.filter(p => p !== platform)
      : [...formData.platforms, platform];
    
    setFormData({ ...formData, platforms: updatedPlatforms });
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiPrompts = [
        "🏠 New week, new opportunities! The real estate market is buzzing with activity. Whether you're buying, selling, or investing, now is the perfect time to explore your options. Let's make your property dreams a reality! #RealEstate #PropertyMarket #DreamHome",
        "✨ Just closed another successful deal! There's nothing more rewarding than helping families find their perfect home. From first consultation to keys in hand, every step of the journey matters. #RealEstateSuccess #HappyClients #PropertyExpert",
        "📈 Market Insight: Properties with professional staging sell 73% faster than non-staged homes. Small investments in presentation can yield significant returns. Ready to maximize your home's potential? #HomStaging #PropertyValue #SellingTips",
        "🔑 First-time buyer tip: Get pre-approved for your mortgage before house hunting. It shows sellers you're serious and gives you a clear budget to work with. Knowledge is power in real estate! #FirstTimeBuyer #MortgageTips #BuyingAdvice"
      ];
      
      const randomPrompt = aiPrompts[Math.floor(Math.random() * aiPrompts.length)];
      const hashtags = randomPrompt.match(/#\w+/g)?.join(' ').replace(/#/g, '') || 'realestate property expert';
      
      setFormData({
        ...formData,
        content: randomPrompt.replace(/#\w+/g, '').trim(),
        hashtags: hashtags
      });

      toast({
        title: "Content Generated!",
        description: "AI has created engaging social media content for you.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Content is required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newPost: SocialPost = {
        id: selectedPost?.id || Date.now().toString(),
        content: formData.content,
        platforms: formData.platforms,
        status: formData.scheduledFor ? 'scheduled' : 'published',
        scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor) : undefined,
        publishedAt: !formData.scheduledFor ? new Date() : undefined,
        mediaType: formData.mediaType,
        mediaUrls: [],
        hashtags: formData.hashtags.split(' ').filter(Boolean),
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        createdAt: selectedPost?.createdAt || new Date(),
        updatedAt: new Date()
      };

      if (selectedPost) {
        setPosts(posts.map(post => post.id === selectedPost.id ? newPost : post));
      } else {
        setPosts([newPost, ...posts]);
      }

      setIsCreating(false);
      setSelectedPost(null);
      setFormData({
        content: '',
        platforms: [],
        mediaType: 'text',
        scheduledFor: '',
        hashtags: ''
      });

      toast({
        title: "Success!",
        description: `Post ${formData.scheduledFor ? 'scheduled' : 'published'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: SocialPost) => {
    setSelectedPost(post);
    setFormData({
      content: post.content,
      platforms: post.platforms,
      mediaType: post.mediaType,
      scheduledFor: post.scheduledFor ? post.scheduledFor.toISOString().slice(0, 16) : '',
      hashtags: post.hashtags.join(' ')
    });
    setIsCreating(true);
  };

  const handleDelete = async (postId: string) => {
    try {
      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "Success!",
        description: "Post deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEngagement = posts.reduce((sum, post) => 
    sum + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0
  );

  const totalReach = posts.reduce((sum, post) => sum + post.engagement.views, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Media Manager</h1>
            <p className="text-gray-600 mt-1">
              Create, schedule, and track your social media presence
            </p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformStats.map((platform) => {
            const Icon = platform.icon;
            return (
              <Card key={platform.platform}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`h-8 w-8 ${platform.color}`} />
                    <Badge variant={platform.connected ? "default" : "secondary"}>
                      {platform.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{platform.platform}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Followers:</span>
                      <span className="font-medium">{platform.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Posts:</span>
                      <span className="font-medium">{platform.posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement:</span>
                      <span className="font-medium">{platform.engagement}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
                <Send className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reach</p>
                  <p className="text-2xl font-bold">{totalReach.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold">{totalEngagement}</p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold">{posts.filter(p => p.status === 'scheduled').length}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        {!isCreating ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>
                Manage your published, scheduled, and draft social media posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                        <div className="flex gap-1">
                          {post.platforms.map((platform) => {
                            const platformData = platformStats.find(p => p.platform === platform);
                            if (!platformData) return null;
                            const Icon = platformData.icon;
                            return (
                              <Icon key={platform} className={`h-4 w-4 ${platformData.color}`} />
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-gray-900 mb-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.engagement.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          {post.engagement.shares}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.engagement.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.status === 'published' && post.publishedAt 
                            ? `Published ${post.publishedAt.toLocaleDateString()}`
                            : post.status === 'scheduled' && post.scheduledFor
                            ? `Scheduled for ${post.scheduledFor.toLocaleDateString()}`
                            : `Updated ${post.updatedAt.toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.hashtags.map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-8">
                    <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-4">Create your first social media post</p>
                    <Button onClick={() => setIsCreating(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Post Creator */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  AI Content Generator
                </CardTitle>
                <CardDescription>
                  Generate engaging social media content with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
                <div className="text-xs text-gray-500">
                  AI will create engaging real estate content with relevant hashtags
                </div>
              </CardContent>
            </Card>

            {/* Post Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedPost ? 'Edit Post' : 'Create New Post'}
                </CardTitle>
                <CardDescription>
                  Write engaging content for your social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="What would you like to share with your audience?"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="mt-1 min-h-[120px]"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.content.length}/280 characters
                  </div>
                </div>

                <div>
                  <Label>Platforms</Label>
                  <div className="flex gap-3 mt-2">
                    {platformStats.filter(p => p.connected).map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = formData.platforms.includes(platform.platform);
                      return (
                        <button
                          key={platform.platform}
                          onClick={() => handlePlatformToggle(platform.platform)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-50 text-purple-700' 
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${platform.color}`} />
                          {platform.platform}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mediaType">Media Type</Label>
                    <Select value={formData.mediaType} onValueChange={(value: any) => setFormData({...formData, mediaType: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Only</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduled">Schedule (optional)</Label>
                    <Input
                      id="scheduled"
                      type="datetime-local"
                      value={formData.scheduledFor}
                      onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hashtags">Hashtags (space-separated)</Label>
                  <Input
                    id="hashtags"
                    placeholder="realestate property investment tips"
                    value={formData.hashtags}
                    onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setSelectedPost(null);
                      setFormData({
                        content: '',
                        platforms: [],
                        mediaType: 'text',
                        scheduledFor: '',
                        hashtags: ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSchedulePost}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {formData.scheduledFor ? (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Post
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Publish Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
