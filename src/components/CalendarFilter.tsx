
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Calendar as CalendarIcon, Car, Wrench, Filter } from 'lucide-react';

interface CalendarFilterProps {
  onBack: () => void;
}

interface MaintenanceEvent {
  id: string;
  vehicleId: string;
  vehiclePlateNumber: string;
  serviceType: string;
  date: string;
  notes: string;
  cost?: number;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
}

const CalendarFilter: React.FC<CalendarFilterProps> = ({ onBack }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  useEffect(() => {
    // Load maintenance records
    const savedRecords = localStorage.getItem('maintenanceRecords');
    if (savedRecords) {
      setEvents(JSON.parse(savedRecords));
    }

    // Load vehicles
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }
  }, []);

  const filteredEvents = events.filter(event => {
    if (selectedVehicle === 'all') return true;
    return event.vehicleId === selectedVehicle;
  });

  const getEventsForDate = (targetDate: Date) => {
    const dateStr = targetDate.toISOString().split('T')[0];
    return filteredEvents.filter(event => event.date === dateStr);
  };

  const selectedDateEvents = date ? getEventsForDate(date) : [];

  const getEventTypeColor = (serviceType: string) => {
    const colors: { [key: string]: string } = {
      'שירות שמן': 'bg-blue-100 text-blue-800',
      'בדיקת צמיגים': 'bg-green-100 text-green-800',
      'בדיקת בלמים': 'bg-red-100 text-red-800',
      'בדיקת מזגן': 'bg-purple-100 text-purple-800',
      'בדיקת רדיאטור': 'bg-orange-100 text-orange-800',
    };
    return colors[serviceType] || 'bg-gray-100 text-gray-800';
  };

  // Calculate total maintenance costs for filtered vehicle
  const totalCost = filteredEvents
    .filter(event => event.cost)
    .reduce((sum, event) => sum + (event.cost || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">לוח שנה - תכנון תחזוקה</h1>
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
              
              {selectedVehicle !== 'all' && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {filteredEvents.length} אירועי תחזוקה
                  </Badge>
                  {totalCost > 0 && (
                    <Badge variant="secondary">
                      עלות כוללת: ₪{totalCost.toLocaleString()}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                לוח שנה
              </CardTitle>
              <CardDescription>
                לחצו על תאריך כדי לראות את אירועי התחזוקה
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasEvents: (date) => getEventsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasEvents: { 
                    backgroundColor: '#3b82f6', 
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Events for Selected Date */}
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                אירועי תחזוקה
              </CardTitle>
              <CardDescription>
                {date ? `תאריך: ${date.toLocaleDateString('he-IL')}` : 'בחרו תאריך'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">אין אירועי תחזוקה בתאריך זה</p>
                  {selectedVehicle !== 'all' && (
                    <p className="text-sm text-gray-500 mt-2">
                      עבור הרכב הנבחר
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{event.vehiclePlateNumber}</span>
                        </div>
                        <Badge className={getEventTypeColor(event.serviceType)}>
                          {event.serviceType}
                        </Badge>
                      </div>
                      
                      {event.notes && (
                        <p className="text-sm text-gray-600 mb-2">{event.notes}</p>
                      )}
                      
                      {event.cost && (
                        <div className="text-sm text-green-600 font-medium">
                          עלות: ₪{event.cost.toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Overview */}
        <Card className="mt-8 fleet-card">
          <CardHeader>
            <CardTitle>סקירת חודש</CardTitle>
            <CardDescription>
              סיכום אירועי התחזוקה החודש
              {selectedVehicle !== 'all' && ' עבור הרכב הנבחר'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredEvents.filter(e => {
                    const eventDate = new Date(e.date);
                    const currentDate = new Date();
                    return eventDate.getMonth() === currentDate.getMonth() && 
                           eventDate.getFullYear() === currentDate.getFullYear();
                  }).length}
                </div>
                <div className="text-sm text-gray-600">אירועים החודש</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ₪{filteredEvents
                    .filter(e => {
                      const eventDate = new Date(e.date);
                      const currentDate = new Date();
                      return eventDate.getMonth() === currentDate.getMonth() && 
                             eventDate.getFullYear() === currentDate.getFullYear() &&
                             e.cost;
                    })
                    .reduce((sum, e) => sum + (e.cost || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">עלות החודש</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredEvents.length}
                </div>
                <div className="text-sm text-gray-600">סה"כ אירועים</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarFilter;
