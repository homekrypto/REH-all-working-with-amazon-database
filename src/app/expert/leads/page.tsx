'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadFormBuilder } from "@/components/marketing/lead-form-builder";
import { BookingCalendar } from "@/components/marketing/booking-calendar";
import { LeadAnalytics } from "@/components/marketing/lead-analytics";
import { ClipboardList, Calendar, BarChart3, Users } from "lucide-react";

export default function ExpertLeadsPage() {
  const [activeTab, setActiveTab] = useState('forms');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Pro Tools
            </Badge>
          </div>
          <p className="text-gray-600">
            Create custom forms, manage bookings, and track your lead generation performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Form Builder
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Booking Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Lead Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forms">
            <LeadFormBuilder />
          </TabsContent>

          <TabsContent value="calendar">
            <BookingCalendar />
          </TabsContent>

          <TabsContent value="analytics">
            <LeadAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
