import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Wrench, Calendar, TrendingUp } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    maintenanceThisMonth: 0,
    totalReports: 0
  });

  useEffect(() => {
    const updateStats = () => {
      // Load vehicles
      const savedVehicles = localStorage.getItem('vehicles');
      const vehicles = savedVehicles ? JSON.parse(savedVehicles) : [];
      
      // Load maintenance records
      const savedMaintenance = localStorage.getItem('maintenanceRecords');
      const maintenance = savedMaintenance ? JSON.parse(savedMaintenance) : [];
      
      // Load public reports
      const savedReports = localStorage.getItem('publicReports');
      const reports = savedReports ? JSON.parse(savedReports) : [];

      // Calculate stats
      const totalVehicles = vehicles.length;
      const availableVehicles = vehicles.filter((v: any) => v.maintenanceStatus === 'תקין').length;
      
      const currentDate = new Date();
      const maintenanceThisMonth = maintenance.filter((m: any) => {
        const maintenanceDate = new Date(m.date);
        return maintenanceDate.getMonth() === currentDate.getMonth() && 
               maintenanceDate.getFullYear() === currentDate.getFullYear();
      }).length;

      setStats({
        totalVehicles,
        availableVehicles,
        maintenanceThisMonth,
        totalReports: reports.length
      });
    };

    updateStats();

    // Listen for storage changes to update stats in real-time
    const handleStorageChange = () => {
      updateStats();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for local storage changes in same tab
    window.addEventListener('localStorageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, []);

  const statsData = [
    {
      title: 'סה"כ רכבים',
      value: stats.totalVehicles,
      icon: Car,
      color: 'text-blue-600'
    },
    {
      title: 'רכבים זמינים',
      value: stats.availableVehicles,
      icon: Car,
      color: 'text-green-600'
    },
    {
      title: 'תחזוקות החודש',
      value: stats.maintenanceThisMonth,
      icon: Wrench,
      color: 'text-orange-600'
    },
    {
      title: 'דיווחים ציבוריים',
      value: stats.totalReports,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <>
      {statsData.map((stat, index) => (
        <Card key={stat.title} className="fleet-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default DashboardStats;