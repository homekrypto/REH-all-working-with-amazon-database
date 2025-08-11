'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  PenTool, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Target,
  Sparkles,
  Save,
  Send,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  scheduledFor?: Date;
  tags: string[];
  category: string;
  readTime: number;
  views: number;
  engagement: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogManagementProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function BlogManagement({ user }: BlogManagementProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    scheduledFor: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Top 10 Real Estate Investment Tips for 2025',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        excerpt: 'Discover the latest strategies for successful real estate investing',
        status: 'published',
        publishedAt: new Date('2025-08-01'),
        tags: ['investment', 'tips', 'real-estate'],
        category: 'Investment',
        readTime: 5,
        views: 1250,
        engagement: 89,
        createdAt: new Date('2025-07-30'),
        updatedAt: new Date('2025-08-01')
      },
      {
        id: '2',
        title: 'Market Trends: What to Expect This Fall',
        content: 'The real estate market is showing interesting patterns...',
        excerpt: 'Analysis of current market conditions and future predictions',
        status: 'scheduled',
        scheduledFor: new Date('2025-08-15'),
        tags: ['market-trends', 'analysis', 'predictions'],
        category: 'Market Analysis',
        readTime: 7,
        views: 0,
        engagement: 0,
        createdAt: new Date('2025-08-05'),
        updatedAt: new Date('2025-08-05')
      },
      {
        id: '3',
        title: 'First-Time Homebuyer Complete Guide',
        content: 'Buying your first home can be overwhelming...',
        excerpt: 'Everything you need to know about purchasing your first property',
        status: 'draft',
        tags: ['homebuying', 'guide', 'first-time'],
        category: 'Homebuying',
        readTime: 10,
        views: 0,
        engagement: 0,
        createdAt: new Date('2025-08-07'),
        updatedAt: new Date('2025-08-08')
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic or prompt for the AI to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI-generated content
      const generatedContent = {
        title: `${aiPrompt} - Expert Real Estate Insights`,
        content: `# ${aiPrompt}

This is AI-generated content based on your prompt: "${aiPrompt}"

## Introduction

In today's dynamic real estate market, understanding ${aiPrompt.toLowerCase()} is crucial for success. As a real estate expert, I've compiled the most important insights to help you navigate this topic effectively.

## Key Points

1. **Market Analysis**: Current trends show that ${aiPrompt.toLowerCase()} plays a significant role in property valuations.

2. **Investment Strategy**: When considering ${aiPrompt.toLowerCase()}, investors should focus on long-term sustainability.

3. **Client Guidance**: Helping clients understand ${aiPrompt.toLowerCase()} can significantly improve their decision-making process.

## Practical Applications

### For Buyers
- Research thoroughly before making decisions
- Consider all factors related to ${aiPrompt.toLowerCase()}
- Work with experienced professionals

### For Sellers
- Timing is crucial when dealing with ${aiPrompt.toLowerCase()}
- Proper preparation can maximize returns
- Market positioning matters

## Conclusion

${aiPrompt} remains a critical factor in real estate success. By staying informed and working with knowledgeable professionals, both buyers and sellers can achieve their goals.

---

*This content was generated with AI assistance to help you create engaging blog posts quickly.*`,
        excerpt: `Comprehensive guide to ${aiPrompt.toLowerCase()} in real estate, covering market analysis, investment strategies, and practical applications for buyers and sellers.`,
        category: 'Expert Insights',
        tags: aiPrompt.toLowerCase().split(' ').join(',') + ',real-estate,expert-tips'
      };

      setFormData({
        ...formData,
        ...generatedContent
      });

      toast({
        title: "Content Generated!",
        description: "AI has created your blog post. Review and edit as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  const handleSave = async (status: 'draft' | 'published' | 'scheduled') => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newPost: BlogPost = {
        id: selectedPost?.id || Date.now().toString(),
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        category: formData.category || 'General',
        readTime: Math.ceil(formData.content.length / 200),
        views: selectedPost?.views || 0,
        engagement: selectedPost?.engagement || 0,
        publishedAt: status === 'published' ? new Date() : selectedPost?.publishedAt,
        scheduledFor: status === 'scheduled' ? new Date(formData.scheduledFor) : undefined,
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
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        scheduledFor: ''
      });

      toast({
        title: "Success!",
        description: `Blog post ${status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'saved as draft'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(', '),
      scheduledFor: post.scheduledFor ? post.scheduledFor.toISOString().split('T')[0] : ''
    });
    setIsCreating(true);
  };

  const handleDelete = async (postId: string) => {
    try {
      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "Success!",
        description: "Blog post deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-1">
              Create and manage your AI-powered blog content
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
                <PenTool className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">{posts.reduce((sum, post) => sum + post.views, 0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Engagement</p>
                  <p className="text-2xl font-bold">
                    {Math.round(posts.reduce((sum, post) => sum + post.engagement, 0) / posts.length || 0)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts List */}
        {!isCreating ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Blog Posts</CardTitle>
              <CardDescription>
                Manage your published, scheduled, and draft blog posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {post.engagement}% engagement
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.status === 'published' && post.publishedAt 
                            ? `Published ${post.publishedAt.toLocaleDateString()}`
                            : post.status === 'scheduled' && post.scheduledFor
                            ? `Scheduled for ${post.scheduledFor.toLocaleDateString()}`
                            : `Updated ${post.updatedAt.toLocaleDateString()}`
                          }
                        </span>
                      </div>
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
                    <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                    <p className="text-gray-600 mb-4">Create your first blog post with AI assistance</p>
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
          /* Blog Post Editor */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Assistant */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Blog Assistant
                </CardTitle>
                <CardDescription>
                  Generate content with AI to speed up your writing process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ai-prompt">Topic or Prompt</Label>
                  <Textarea
                    id="ai-prompt"
                    placeholder="e.g., 'Home staging tips for sellers', 'Real estate market trends 2025', 'Investment property analysis'..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[100px] mt-1"
                  />
                </div>
                <Button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
                <div className="text-xs text-gray-500">
                  AI will create a complete blog post including title, content, and meta information
                </div>
              </CardContent>
            </Card>

            {/* Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </CardTitle>
                <CardDescription>
                  Write and publish engaging content for your audience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your blog post title..."
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Investment">Investment</SelectItem>
                        <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                        <SelectItem value="Homebuying">Homebuying</SelectItem>
                        <SelectItem value="Selling">Selling</SelectItem>
                        <SelectItem value="Expert Insights">Expert Insights</SelectItem>
                        <SelectItem value="Tips & Guides">Tips & Guides</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="real-estate, investment, tips"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description of your blog post..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog post content here... (Supports Markdown)"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="mt-1 min-h-[400px] font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="scheduled">Schedule Publication (optional)</Label>
                  <Input
                    id="scheduled"
                    type="date"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
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
                        title: '',
                        content: '',
                        excerpt: '',
                        category: '',
                        tags: '',
                        scheduledFor: ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSave('draft')}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  {formData.scheduledFor && (
                    <Button
                      onClick={() => handleSave('scheduled')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  )}
                  <Button
                    onClick={() => handleSave('published')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publish Now
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
