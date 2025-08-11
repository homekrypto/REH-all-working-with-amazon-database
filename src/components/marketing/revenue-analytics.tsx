'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar, 
  Target,
  CreditCard,
  Banknote,
  Calculator,
  Award,
  Download
} from "lucide-react";

const revenueMetrics = {
  totalRevenue: 245780,
  monthlyRecurring: 18500,
  commission: 167230,
  oneTime: 60050,
  growthRate: 23.5,
  projectedAnnual: 2950000,
  avgDealSize: 485000,
  totalDeals: 12
};

const monthlyData = [
  { month: 'Jan', revenue: 185000, deals: 3, commission: 9250 },
  { month: 'Feb', revenue: 220000, deals: 4, commission: 11000 },
  { month: 'Mar', revenue: 195000, deals: 2, commission: 9750 },
  { month: 'Apr', revenue: 280000, deals: 5, commission: 14000 },
  { month: 'May', revenue: 245000, deals: 3, commission: 12250 },
  { month: 'Jun', revenue: 315000, deals: 6, commission: 15750 }
];

const revenueStreams = [
  {
    source: 'Sales Commissions',
    amount: 167230,
    percentage: 68.1,
    growth: 15.2,
    color: 'bg-blue-500'
  },
  {
    source: 'Listing Fees',
    amount: 32500,
    percentage: 13.2,
    growth: 8.7,
    color: 'bg-green-500'
  },
  {
    source: 'Consultation Services',
    amount: 28450,
    percentage: 11.6,
    growth: 32.4,
    color: 'bg-purple-500'
  },
  {
    source: 'Marketing Services',
    amount: 17600,
    percentage: 7.1,
    growth: 45.1,
    color: 'bg-yellow-500'
  }
];

const upcomingCommissions = [
  {
    id: '1',
    property: 'Luxury Penthouse',
    client: 'Sarah Johnson',
    salePrice: 1250000,
    commission: 62500,
    expectedClose: '2024-01-25',
    probability: 85,
    status: 'pending'
  },
  {
    id: '2',
    property: 'Family Home',
    client: 'Michael Brown',
    salePrice: 850000,
    commission: 42500,
    expectedClose: '2024-02-01',
    probability: 70,
    status: 'negotiating'
  },
  {
    id: '3',
    property: 'Investment Property',
    client: 'Emma Wilson',
    salePrice: 675000,
    commission: 33750,
    expectedClose: '2024-02-15',
    probability: 60,
    status: 'under_review'
  }
];

export function RevenueAnalytics() {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      negotiating: 'bg-blue-100 text-blue-800',
      under_review: 'bg-purple-100 text-purple-800',
      closed: 'bg-green-100 text-green-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${revenueMetrics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+{revenueMetrics.growthRate}%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${revenueMetrics.avgDealSize.toLocaleString()}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.3%</span>
              <span className="text-gray-500 ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {revenueMetrics.totalDeals}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500">This year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projected Annual</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(revenueMetrics.projectedAnnual / 1000000).toFixed(1)}M
                </p>
              </div>
              <Target className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500">Based on current trends</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Streams</CardTitle>
            <CardDescription>Breakdown of your income sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueStreams.map((stream) => (
              <div key={stream.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stream.color}`}></div>
                  <span className="font-medium text-gray-900">{stream.source}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${stream.color}`}
                      style={{ width: `${stream.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${stream.amount.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+{stream.growth}%</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Revenue performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{month.month}</p>
                      <p className="text-sm text-gray-600">{month.deals} deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${month.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">${month.commission.toLocaleString()} commission</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Commissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pipeline & Upcoming Commissions</CardTitle>
              <CardDescription>Potential revenue from active deals</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingCommissions.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{deal.property}</h4>
                    <p className="text-sm text-gray-600">Client: {deal.client}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusBadge(deal.status)}>
                        {deal.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Expected: {deal.expectedClose}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">${deal.salePrice.toLocaleString()}</p>
                    <p className="text-gray-600">Sale Price</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">${deal.commission.toLocaleString()}</p>
                    <p className="text-gray-600">Commission</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getProbabilityColor(deal.probability)}`}>
                      {deal.probability}%
                    </p>
                    <p className="text-gray-600">Probability</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Projected Pipeline Value</p>
                <p className="text-sm text-blue-700">Based on probability-weighted commissions</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">
                  ${Math.round(upcomingCommissions.reduce((sum, deal) => 
                    sum + (deal.commission * deal.probability / 100), 0
                  )).toLocaleString()}
                </p>
                <p className="text-sm text-blue-700">Expected commission</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Annual Goals</CardTitle>
            <CardDescription>Track your progress toward yearly targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                goal: 'Revenue Target',
                target: 3000000,
                current: 2450000,
                unit: '$'
              },
              {
                goal: 'Deals Target',
                target: 20,
                current: 12,
                unit: ''
              },
              {
                goal: 'Commission Rate',
                target: 5.0,
                current: 4.8,
                unit: '%'
              }
            ].map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={goal.goal} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{goal.goal}</span>
                    <span className="text-gray-600">
                      {goal.unit}{goal.current.toLocaleString()} / {goal.unit}{goal.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>{Math.round(goal.target - goal.current)} to go</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Planning</CardTitle>
            <CardDescription>Estimated tax obligations and deductions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Gross Income</p>
                <p className="font-medium">${revenueMetrics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Business Expenses</p>
                <p className="font-medium">$34,500</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Estimated Tax</p>
                <p className="font-medium text-red-600">$52,800</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Net Income</p>
                <p className="font-medium text-green-600">$158,480</p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Tax Tip</p>
              <p className="text-sm text-blue-700">
                Consider increasing business expense deductions by 15% to optimize your tax position.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
