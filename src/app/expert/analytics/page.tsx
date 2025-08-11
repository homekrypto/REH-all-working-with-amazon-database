'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceOverview } from "@/components/marketing/performance-overview";
import { MarketingMetrics } from "@/components/marketing/marketing-metrics";
import { ListingAnalytics } from "@/components/marketing/listing-analytics";
import { RevenueAnalytics } from "@/components/marketing/revenue-analytics";
import { BarChart3, TrendingUp, DollarSign, Home } from "lucide-react";

export default function ExpertAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Expert Dashboard
            </Badge>
          </div>
          <p className="text-gray-600">
            Comprehensive insights into your marketing performance, leads, and revenue
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PerformanceOverview />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingMetrics />
          </TabsContent>

          <TabsContent value="listings">
            <ListingAnalytics />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
