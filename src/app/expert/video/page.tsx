'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoManager } from "@/components/marketing/video-manager";
import { ReelGenerator } from "@/components/marketing/reel-generator";
import { VideoAnalytics } from "@/components/marketing/video-analytics";
import { Video, TrendingUp, Zap, BarChart3 } from "lucide-react";

export default function ExpertVideoPage() {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Video & Reel Studio</h1>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI-Powered
            </Badge>
          </div>
          <p className="text-gray-600">
            Create engaging property videos and reels with AI-powered content generation
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video Manager
            </TabsTrigger>
            <TabsTrigger value="reels" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Reel Generator
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <VideoManager />
          </TabsContent>

          <TabsContent value="reels">
            <ReelGenerator />
          </TabsContent>

          <TabsContent value="analytics">
            <VideoAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
