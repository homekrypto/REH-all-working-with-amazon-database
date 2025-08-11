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
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  booked?: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    purpose: string;
  };
}

interface CalendarDay {
  date: string;
  dayName: string;
  isToday: boolean;
  isSelected: boolean;
  timeSlots: TimeSlot[];
}

const mockTimeSlots: TimeSlot[] = [
  { id: '1', time: '09:00', available: true },
  { id: '2', time: '10:00', available: false, booked: { clientName: 'John Smith', clientEmail: 'john@example.com', clientPhone: '+1234567890', purpose: 'Property viewing' } },
  { id: '3', time: '11:00', available: true },
  { id: '4', time: '14:00', available: true },
  { id: '5', time: '15:00', available: true },
  { id: '6', time: '16:00', available: false, booked: { clientName: 'Sarah Johnson', clientEmail: 'sarah@example.com', clientPhone: '+1234567890', purpose: 'Consultation' } },
];

export function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Generate calendar days (simplified for demo)
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0,
        isSelected: date.toDateString() === selectedDate.toDateString(),
        timeSlots: mockTimeSlots
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleBooking = () => {
    // Handle booking logic
    setShowBookingForm(false);
    setSelectedTimeSlot(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Booking Calendar</h3>
          <p className="text-sm text-gray-500">Manage your appointment bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Availability
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week View */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {calendarDays.map((day) => (
                <div
                  key={day.date}
                  className={`p-2 text-center rounded-lg cursor-pointer transition-all ${
                    day.isSelected
                      ? 'bg-blue-500 text-white'
                      : day.isToday
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDate(new Date(day.date))}
                >
                  <div className="text-xs font-medium">{day.dayName}</div>
                  <div className="text-sm">{new Date(day.date).getDate()}</div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">
                Available Times - {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {mockTimeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={slot.available ? "outline" : "secondary"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => slot.available && setSelectedTimeSlot(slot)}
                    className={`${
                      selectedTimeSlot?.id === slot.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
              
              {selectedTimeSlot && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">
                        Selected: {selectedTimeSlot.time}
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedDate.toLocaleDateString()}
                      </p>
                    </div>
                    <Button onClick={() => setShowBookingForm(true)}>
                      Book Appointment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTimeSlots
              .filter(slot => !slot.available && slot.booked)
              .map((slot) => (
                <div key={slot.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{slot.time}</span>
                    <Badge variant="outline">Today</Badge>
                  </div>
                  
                  {slot.booked && (
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {slot.booked.clientName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {slot.booked.clientEmail}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {slot.booked.clientPhone}
                      </div>
                      <p className="mt-2 text-xs bg-gray-50 p-2 rounded">
                        {slot.booked.purpose}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            
            <div className="text-center py-4">
              <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No more bookings today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>
                {selectedDate.toLocaleDateString()} at {selectedTimeSlot?.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input placeholder="Enter client name" />
              </div>
              
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="client@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input type="tel" placeholder="+1 (555) 123-4567" />
              </div>
              
              <div className="space-y-2">
                <Label>Meeting Purpose</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewing">Property Viewing</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="listing">Listing Discussion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea placeholder="Additional notes..." />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleBooking} className="flex-1">
                  Confirm Booking
                </Button>
                <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Calendar Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Working Hours</Label>
                <div className="flex gap-2">
                  <Select defaultValue="09:00">
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="self-center">to</span>
                  <Select defaultValue="17:00">
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Appointment Duration</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Buffer Time</Label>
                <Select defaultValue="15">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => setShowSettings(false)} className="flex-1">
                  Save Settings
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
