
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Car, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportsFilterProps {
  onBack: () => void;
}

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehiclePlateNumber: string;
  serviceType: string;
  date: string;
  cost?: number;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  maintenanceStatus: string;
}

const ReportsFilter: React.FC<ReportsFilterProps> = ({ onBack }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  useEffect(() => {
    // Load data from localStorage
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }

    const savedRecords = localStorage.getItem('maintenanceRecords');
    if (savedRecords) {
      setMaintenanceRecords(JSON.parse(savedRecords));
    }
  }, []);

  const filteredRecords = selectedVehicle === 'all' 
    ? maintenanceRecords 
    : maintenanceRecords.filter(record => record.vehicleId === selectedVehicle);

  const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);

  // Calculate statistics
  const totalCost = filteredRecords
    .filter(record => record.cost)
    .reduce((sum, record) => sum + (record.cost || 0), 0);

  const thisMonthRecords = filteredRecords.filter(record => {
    const recordDate = new Date(record.date);
    const currentDate = new Date();
    return recordDate.getMonth() === currentDate.getMonth() && 
           recordDate.getFullYear() === currentDate.getFullYear();
  });

  const thisMonthCost = thisMonthRecords
    .filter(record => record.cost)
    .reduce((sum, record) => sum + (record.cost || 0), 0);

  // Prepare chart data
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('he-IL', { month: 'short', year: '2-digit' });
    
    const monthRecords = filteredRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === date.getMonth() && 
             recordDate.getFullYear() === date.getFullYear();
    });

    const monthCost = monthRecords
      .filter(record => record.cost)
      .reduce((sum, record) => sum + (record.cost || 0), 0);

    monthlyData.push({
      month: monthName,
      cost: monthCost,
      count: monthRecords.length
    });
  }

  // Service type distribution
  const serviceTypeData = filteredRecords.reduce((acc, record) => {
    acc[record.serviceType] = (acc[record.serviceType] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const pieData = Object.entries(serviceTypeData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                חזרה לדף הבית
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">דוחות ונתונים</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vehicle Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              סינון לפי רכב
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="בחר רכב" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הרכבים</SelectItem>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.plateNumber} - {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedVehicleInfo && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {selectedVehicleInfo.plateNumber}
                  </Badge>
                  <Badge className={selectedVehicleInfo.maintenanceStatus === 'תקין' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedVehicleInfo.maintenanceStatus}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {selectedVehicle === 'all' ? 'סה"כ רכבים' : 'רכב נבחר'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedVehicle === 'all' ? vehicles.length : '1'}
                  </p>
                </div>
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">סה"כ תחזוקות</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">עלות כוללת</p>
                  <p className="text-2xl font-bold text-gray-900">₪{totalCost.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">החודש</p>
                  <p className="text-2xl font-bold text-gray-900">{thisMonthRecords.length}</p>
                  <p className="text-xs text-gray-500">₪{thisMonthCost.toLocaleString()}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Costs Chart */}
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle>עלויות תחזוקה חודשיות</CardTitle>
              <CardDescription>
                מגמת עלויות ב-12 החודשים האחרונים
                {selectedVehicleInfo && ` עבור ${selectedVehicleInfo.plateNumber}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`₪${value.toLocaleString()}`, 'עלות']}
                      labelFormatter={(label) => `חודש: ${label}`}
                    />
                    <Bar dataKey="cost" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Types Distribution */}
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle>התפלגות סוגי שירותים</CardTitle>
              <CardDescription>
                חלוקה לפי סוג פעולת התחזוקה
                {selectedVehicleInfo && ` עבור ${selectedVehicleInfo.plateNumber}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Maintenance */}
        <Card className="fleet-card">
          <CardHeader>
            <CardTitle>תחזוקות אחרונות</CardTitle>
            <CardDescription>
              פעולות התחזוקה האחרונות
              {selectedVehicleInfo && ` עבור ${selectedVehicleInfo.plateNumber}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">אין נתוני תחזוקה להצגה</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map(record => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{record.vehiclePlateNumber}</p>
                          <p className="text-sm text-gray-600">{record.serviceType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{record.date}</p>
                        {record.cost && (
                          <p className="text-sm font-medium text-green-600">
                            ₪{record.cost.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsFilter;
