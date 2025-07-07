
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Wrench, Plus, Trash2, ArrowRight, Calendar, FileText, Car, CheckCircle, Clock, Upload } from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehiclePlateNumber: string;
  serviceType: string;
  date: string;
  notes: string;
  cost?: number;
  addedDate: string;
  completed: boolean;
  tasks: Array<{
    id: string;
    description: string;
    completed: boolean;
  }>;
  receiptImage?: string;
}

interface MaintenanceProps {
  onBack: () => void;
}

const Maintenance: React.FC<MaintenanceProps> = ({ onBack }) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: '',
    date: '',
    notes: '',
    cost: '',
    tasks: '',
    receiptImage: null as File | null
  });

  const serviceTypes = [
    'שירות שמן',
    'בדיקת צמיגים',
    'בדיקת בלמים',
    'בדיקת מזגן',
    'בדיקת רדיאטור',
    'בדיקת סוללה',
    'בדיקת אורות',
    'בדיקת מגבים',
    'טעינת גז',
    'החלפת פילטרים',
    'בדיקת מנוע',
    'אחר'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load vehicles
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }

    // Load maintenance records
    const savedRecords = localStorage.getItem('maintenanceRecords');
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      // Ensure all records have the new fields
      const updatedRecords = records.map((record: any) => ({
        ...record,
        completed: record.completed ?? false,
        tasks: record.tasks ?? [],
        receiptImage: record.receiptImage ?? null
      }));
      setMaintenanceRecords(updatedRecords);
    }
  };

  const saveMaintenanceRecords = (newRecords: MaintenanceRecord[]) => {
    setMaintenanceRecords(newRecords);
    localStorage.setItem('maintenanceRecords', JSON.stringify(newRecords));
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, receiptImage: file});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    if (!selectedVehicle) {
      setAlert({ type: 'error', message: 'אנא בחרו רכב' });
      return;
    }

    // Parse tasks from text input
    const tasks = formData.tasks
      .split('\n')
      .filter(task => task.trim())
      .map(task => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        description: task.trim(),
        completed: false
      }));

    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(),
      vehicleId: formData.vehicleId,
      vehiclePlateNumber: selectedVehicle.plateNumber,
      serviceType: formData.serviceType,
      date: formData.date,
      notes: formData.notes,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      addedDate: new Date().toISOString().split('T')[0],
      completed: false,
      tasks: tasks,
      receiptImage: formData.receiptImage?.name
    };

    saveMaintenanceRecords([...maintenanceRecords, newRecord]);
    setAlert({ type: 'success', message: 'פעולת התחזוקה נוספה בהצלחה!' });

    setFormData({
      vehicleId: '',
      serviceType: '',
      date: '',
      notes: '',
      cost: '',
      tasks: '',
      receiptImage: null
    });
    setShowAddForm(false);

    setTimeout(() => setAlert(null), 3000);
  };

  const toggleMaintenanceCompletion = (recordId: string) => {
    const updatedRecords = maintenanceRecords.map(record => 
      record.id === recordId 
        ? { ...record, completed: !record.completed }
        : record
    );
    saveMaintenanceRecords(updatedRecords);
  };

  const toggleTaskCompletion = (recordId: string, taskId: string) => {
    const updatedRecords = maintenanceRecords.map(record => 
      record.id === recordId 
        ? {
            ...record,
            tasks: record.tasks.map(task =>
              task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
            )
          }
        : record
    );
    saveMaintenanceRecords(updatedRecords);
  };

  const handleDelete = (recordId: string) => {
    if (confirm('האם אתם בטוחים שברצונכם למחוק את רשומת התחזוקה?')) {
      const updatedRecords = maintenanceRecords.filter(r => r.id !== recordId);
      saveMaintenanceRecords(updatedRecords);
      setAlert({ type: 'success', message: 'רשומת התחזוקה נמחקה בהצלחה!' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({
      vehicleId: '',
      serviceType: '',
      date: '',
      notes: '',
      cost: '',
      tasks: '',
      receiptImage: null
    });
  };

  const getTotalCost = () => {
    return maintenanceRecords
      .filter(record => record.cost)
      .reduce((total, record) => total + (record.cost || 0), 0);
  };

  const getCompletionStats = () => {
    const total = maintenanceRecords.length;
    const completed = maintenanceRecords.filter(r => r.completed).length;
    const openTasks = maintenanceRecords
      .flatMap(r => r.tasks)
      .filter(t => !t.completed).length;
    
    return { total, completed, open: total - completed, openTasks };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
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
              <Wrench className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">ניהול תחזוקה</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <Alert className={`mb-6 ${alert.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">סה"כ פעולות</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Wrench className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">הושלמו</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">פתוחות</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.open}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">עלות כוללת</p>
                  <p className="text-2xl font-bold text-gray-900">₪{getTotalCost().toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Maintenance Button */}
        {!showAddForm && (
          <div className="mb-6">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="fleet-btn fleet-secondary text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              הוסף פעולת תחזוקה
            </Button>
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <Card className="mb-8 fleet-card fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                הוספת פעולת תחזוקה חדשה
              </CardTitle>
              <CardDescription>
                הזינו את פרטי פעולת התחזוקה והמשימות הנדרשות
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">רכב</Label>
                    <Select 
                      value={formData.vehicleId} 
                      onValueChange={(value) => setFormData({...formData, vehicleId: value})}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="בחרו רכב" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.plateNumber} - {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">סוג פעולה/שירות</Label>
                    <Select 
                      value={formData.serviceType} 
                      onValueChange={(value) => setFormData({...formData, serviceType: value})}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="בחרו סוג שירות" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">תאריך ביצוע</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cost">עלות (₪)</Label>
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      placeholder="0.00"
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="receiptImage" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      תמונת קבלה
                    </Label>
                    <Input
                      id="receiptImage"
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="text-right"
                    />
                    {formData.receiptImage && (
                      <p className="text-sm text-green-600">
                        נבחר קובץ: {formData.receiptImage.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tasks">משימות (כל משימה בשורה נפרדת)</Label>
                    <Textarea
                      id="tasks"
                      value={formData.tasks}
                      onChange={(e) => setFormData({...formData, tasks: e.target.value})}
                      placeholder="החלפת שמן&#10;בדיקת צמיגים&#10;ניקוי רדיאטור"
                      className="text-right"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">הערות</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="פרטים נוספים על פעולת התחזוקה..."
                      className="text-right"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="fleet-btn fleet-secondary text-white">
                    הוסף פעולת תחזוקה
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Maintenance Records List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">היסטוריית תחזוקה ({maintenanceRecords.length})</h3>
          
          {maintenanceRecords.length === 0 ? (
            <Card className="fleet-card text-center py-12">
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">אין רשומות תחזוקה במערכת</p>
              <p className="text-sm text-gray-500">הוסיפו פעולת תחזוקה כדי להתחיל</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {maintenanceRecords.map((record, index) => (
                <Card 
                  key={record.id} 
                  className={`fleet-card slide-in-right ${record.completed ? 'bg-green-50 border-green-200' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Car className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">{record.vehiclePlateNumber}</h4>
                          <Badge variant="secondary">{record.serviceType}</Badge>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={record.completed}
                              onCheckedChange={() => toggleMaintenanceCompletion(record.id)}
                            />
                            <span className="text-sm">הושלם</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {record.date}
                          </span>
                          {record.cost && (
                            <span className="font-medium text-green-600">
                              ₪{record.cost.toLocaleString()}
                            </span>
                          )}
                          {record.receiptImage && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Upload className="w-3 h-3" />
                              יש קבלה
                            </Badge>
                          )}
                        </div>

                        {/* Tasks */}
                        {record.tasks && record.tasks.length > 0 && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <h5 className="font-medium mb-2">משימות:</h5>
                            <div className="space-y-2">
                              {record.tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-2">
                                  <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={() => toggleTaskCompletion(record.id, task.id)}
                                  />
                                  <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {record.notes && (
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {record.notes}
                          </p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        מחק
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
