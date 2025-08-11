'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wand2, 
  Video, 
  Download, 
  Share2, 
  Play,
  RefreshCw,
  Sparkles,
  Clock,
  Image as ImageIcon
} from "lucide-react";

interface ReelTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  duration: string;
  thumbnail: string;
}

const reelTemplates: ReelTemplate[] = [
  {
    id: '1',
    name: 'Property Showcase',
    description: 'Dynamic property tour with smooth transitions',
    style: 'Modern',
    duration: '30s',
    thumbnail: '/api/placeholder/150/200'
  },
  {
    id: '2',
    name: 'Quick Tour',
    description: 'Fast-paced room-by-room walkthrough',
    style: 'Energetic',
    duration: '15s',
    thumbnail: '/api/placeholder/150/200'
  },
  {
    id: '3',
    name: 'Luxury Lifestyle',
    description: 'Elegant showcase with luxury feel',
    style: 'Premium',
    duration: '45s',
    thumbnail: '/api/placeholder/150/200'
  },
  {
    id: '4',
    name: 'Before & After',
    description: 'Transformation showcase',
    style: 'Documentary',
    duration: '30s',
    thumbnail: '/api/placeholder/150/200'
  }
];

export function ReelGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReel, setGeneratedReel] = useState<any>(null);
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    highlights: '',
    tone: '',
    duration: '30'
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation process
    setTimeout(() => {
      setGeneratedReel({
        id: Date.now().toString(),
        title: `AI-Generated Reel: ${formData.propertyType} in ${formData.location}`,
        thumbnail: '/api/placeholder/300/400',
        duration: `${formData.duration}s`,
        style: selectedTemplate,
        generatedAt: new Date().toISOString()
      });
      setIsGenerating(false);
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">AI Reel Generator</h3>
        <p className="text-sm text-gray-500">
          Create engaging property reels using AI-powered video generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generate New Reel
            </CardTitle>
            <CardDescription>
              Provide property details to generate a custom reel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property-type">Property Type</Label>
              <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Downtown Manhattan, NYC"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights">Key Highlights</Label>
              <Textarea
                id="highlights"
                placeholder="e.g., Ocean view, Modern kitchen, Rooftop terrace..."
                value={formData.highlights}
                onChange={(e) => handleInputChange('highlights', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone & Style</Label>
              <Select onValueChange={(value) => handleInputChange('tone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select onValueChange={(value) => handleInputChange('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Template</CardTitle>
            <CardDescription>
              Select a template style for your reel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {reelTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {template.style}
                    </Badge>
                    <span className="text-xs text-gray-500">{template.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedTemplate || !formData.propertyType}
          className="px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Generating Reel...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate AI Reel
            </>
          )}
        </Button>
      </div>

      {/* Generated Reel Preview */}
      {generatedReel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Generated Reel
            </CardTitle>
            <CardDescription>
              Your AI-generated reel is ready!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="relative">
                <img
                  src={generatedReel.thumbnail}
                  alt={generatedReel.title}
                  className="w-48 h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                  <Button size="sm" variant="secondary">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {generatedReel.duration}
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {generatedReel.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Generated just now
                    </div>
                    <Badge variant="outline">
                      {generatedReel.style}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share to Social
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Generated Features:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• AI-optimized transitions and pacing</li>
                    <li>• Auto-generated captions and text overlays</li>
                    <li>• Background music matching your tone</li>
                    <li>• Platform-optimized aspect ratios</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
