'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Edit3, 
  Trash2,
  Plus,
  Clock,
  Eye,
  Heart
} from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  createdAt: string;
  status: 'processing' | 'ready' | 'published';
  platform?: string[];
}

const mockVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Luxury Penthouse Tour - Downtown Manhattan',
    description: 'Stunning 3-bedroom penthouse with panoramic city views',
    thumbnail: '/api/placeholder/300/200',
    duration: '3:45',
    views: 1250,
    likes: 89,
    createdAt: '2024-01-15',
    status: 'published',
    platform: ['Instagram', 'YouTube']
  },
  {
    id: '2',
    title: 'Modern Family Home - Suburban Paradise',
    description: 'Perfect family home with spacious backyard and modern amenities',
    thumbnail: '/api/placeholder/300/200',
    duration: '2:30',
    views: 892,
    likes: 67,
    createdAt: '2024-01-12',
    status: 'ready'
  },
  {
    id: '3',
    title: 'Cozy Studio Apartment - City Center',
    description: 'AI-generated walkthrough of a charming studio apartment',
    thumbnail: '/api/placeholder/300/200',
    duration: '1:45',
    views: 0,
    likes: 0,
    createdAt: '2024-01-10',
    status: 'processing'
  }
];

export function VideoManager() {
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadForm(false);
      // Add new video to list
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      processing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Video Library</h3>
          <p className="text-sm text-gray-500">Manage your property videos and tours</p>
        </div>
        <Button onClick={() => setShowUploadForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Video</CardTitle>
            <CardDescription>
              Upload a property video or generate one using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-title">Video Title</Label>
              <Input id="video-title" placeholder="Enter video title..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-description">Description</Label>
              <Textarea id="video-description" placeholder="Describe your property..." />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Drag and drop your video file here, or click to browse
                </p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Video'}
              </Button>
              <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary">
                  <Play className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
              <Badge className={`absolute top-2 right-2 ${getStatusBadge(video.status)}`}>
                {video.status}
              </Badge>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                {video.duration}
              </div>
            </div>
            
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                {video.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {video.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {video.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {video.likes}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {video.createdAt}
                </div>
              </div>

              {video.platform && (
                <div className="flex gap-1 mb-3">
                  {video.platform.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
