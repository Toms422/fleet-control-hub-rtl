
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Car, Wrench, TrendingUp, Calendar, FileText, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ReportsProps {
  onBack: () => void;
}

const Reports: React.FC<ReportsProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample data for charts
  const vehicleStatusData = [
    { name: 'תקין', value: 3, color: '#10b981' },
    { name: 'דורש טיפול', value: 1, color: '#f59e0b' },
  ];

  const maintenanceByMonth = [
    { month: 'ינואר', count: 5 },
    { month: 'פברואר', count: 3 },
    { month: 'מרץ', count: 8 },
    { month: 'אפריל', count: 6 },
    { month: 'מאי', count: 4 },
    { month: 'יוני', count: 7 },
  ];

  const vehicleUsage = [
    { vehicle: 'V001', kilometers: 15000 },
    { vehicle: 'V002', kilometers: 12500 },
    { vehicle: 'V003', kilometers: 18000 },
    { vehicle: 'V004', kilometers: 9800 },
  ];

  const costAnalysis = [
    { month: 'ינואר', maintenance: 2500, fuel: 4800 },
    { month: 'פברואר', maintenance: 1800, fuel: 4200 },
    { month: 'מרץ', maintenance: 3200, fuel: 5100 },
    { month: 'אפריל', maintenance: 2100, fuel: 4600 },
    { month: 'מאי', maintenance: 1500, fuel: 4300 },
    { month: 'יוני', maintenance: 2800, fuel: 4900 },
  ];

  const quickStats = [
    {
      title: 'סה"כ רכבים',
      value: '4',
      change: '+0%',
      icon: Car,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'תחזוקות החודש',
      value: '12',
      change: '+25%',
      icon: Wrench,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'סה"כ ק"מ',
      value: '55,300',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'עלות חודשית',
      value: '₪7,700',
      change: '-8%',
      icon: BarChart3,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
  ];

  const recentReports = [
    {
      id: '1',
      title: 'דוח תחזוקה חודשי',
      date: '2025-01-01',
      type: 'maintenance',
      status: 'completed'
    },
    {
      id: '2',
      title: 'דוח שימוש ברכבים',
      date: '2025-01-01',
      type: 'usage',
      status: 'completed'
    },
    {
      id: '3',
      title: 'דוח עלויות',
      date: '2024-12-31',
      type: 'financial',
      status: 'completed'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                חזרה
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">דוחות ונתונים</h1>
            </div>
            <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4" />
              יצוא דוח
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} מהחודש הקודם
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for different report sections */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="maintenance">תחזוקה</TabsTrigger>
            <TabsTrigger value="usage">שימוש</TabsTrigger>
            <TabsTrigger value="financial">כספים</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>סטטוס רכבים</CardTitle>
                  <CardDescription>התפלגות מצב הרכבים בצי</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={vehicleStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {vehicleStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>דוחות אחרונים</CardTitle>
                  <CardDescription>דוחות שנוצרו לאחרונה</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map(report => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900">{report.title}</p>
                            <p className="text-sm text-gray-500">{report.date}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          הושלם
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>תחזוקות לפי חודש</CardTitle>
                <CardDescription>מספר פעולות התחזוקה שבוצעו בכל חודש</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={maintenanceByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>שימוש ברכבים</CardTitle>
                <CardDescription>מספר הקילומטרים שנסעו עם כל רכב</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={vehicleUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="vehicle" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="kilometers" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ניתוח עלויות</CardTitle>
                <CardDescription>השוואת עלויות תחזוקה ודלק לפי חודשים</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={costAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="maintenance" stroke="#8884d8" name="תחזוקה" />
                    <Line type="monotone" dataKey="fuel" stroke="#82ca9d" name="דלק" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
