
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Wrench, Car } from 'lucide-react';

interface CalendarProps {
  onBack: () => void;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'maintenance' | 'inspection' | 'service';
  vehicleNumber: string;
  description?: string;
}

const Calendar: React.FC<CalendarProps> = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'בדיקת שמן',
      date: new Date(2025, 0, 15), // January 15, 2025
      type: 'maintenance',
      vehicleNumber: 'V001',
      description: 'החלפת שמן מנוע וסינון'
    },
    {
      id: '2',
      title: 'טסט שנתי',
      date: new Date(2025, 0, 20), // January 20, 2025
      type: 'inspection',
      vehicleNumber: 'V002',
      description: 'בדיקה שנתית חובה'
    },
    {
      id: '3',
      title: 'החלפת צמיגים',
      date: new Date(2025, 0, 25), // January 25, 2025
      type: 'service',
      vehicleNumber: 'V003',
      description: 'החלפת צמיגים חורף'
    }
  ]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-red-100 text-red-800';
      case 'service': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return Wrench;
      case 'inspection': return Car;
      case 'service': return CalendarIcon;
      default: return CalendarIcon;
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div key={day} className={`h-24 border border-gray-100 p-1 ${isToday ? 'bg-blue-50' : 'bg-white'}`}>
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => {
              const IconComponent = getTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  className={`text-xs p-1 rounded flex items-center gap-1 ${getTypeColor(event.type)}`}
                  title={event.description}
                >
                  <IconComponent className="w-3 h-3" />
                  <span className="truncate">{event.title}</span>
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} נוספים</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
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
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">לוח שנה</h1>
            </div>
            <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4" />
              הוסף אירוע
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            {/* Day headers */}
            <div className="grid grid-cols-7 bg-gray-50">
              {dayNames.map(day => (
                <div key={day} className="p-4 text-center font-medium text-gray-600 border-b">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>אירועים קרובים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter(event => event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map(event => {
                  const IconComponent = getTypeIcon(event.type);
                  return (
                    <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(event.type)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{event.vehicleNumber}</Badge>
                          <span className="text-sm text-gray-500">
                            {event.date.toLocaleDateString('he-IL')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
