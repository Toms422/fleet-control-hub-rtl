
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, Plus, Edit, Trash2, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  vin: string;
  barcode: string;
  maintenanceStatus: 'תקין' | 'דורש טיפול';
  addedDate: string;
}

interface VehicleManagementProps {
  onBack: () => void;
}

const VehicleManagement: React.FC<VehicleManagementProps> = ({ onBack }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    vin: '',
    barcode: '',
    maintenanceStatus: 'תקין' as const
  });

  useEffect(() => {
    // Load vehicles from localStorage
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    } else {
      // Initialize with sample data
      const sampleVehicles: Vehicle[] = [
        {
          id: '1',
          plateNumber: '123-45-678',
          model: 'טויוטה קורולה',
          vin: 'JT2BF28K0X0123456',
          barcode: 'BAR001',
          maintenanceStatus: 'תקין',
          addedDate: '2024-01-15'
        },
        {
          id: '2',
          plateNumber: '987-65-432',
          model: 'הונדה סיוויק',
          vin: '1HGBH41JXMN123456',
          barcode: 'BAR002',
          maintenanceStatus: 'דורש טיפול',
          addedDate: '2024-02-10'
        }
      ];
      setVehicles(sampleVehicles);
      localStorage.setItem('vehicles', JSON.stringify(sampleVehicles));
    }
  }, []);

  const saveVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
    localStorage.setItem('vehicles', JSON.stringify(newVehicles));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVehicle) {
      // Update existing vehicle
      const updatedVehicles = vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...editingVehicle, ...formData }
          : v
      );
      saveVehicles(updatedVehicles);
      setAlert({ type: 'success', message: 'הרכב עודכן בהצלחה!' });
      setEditingVehicle(null);
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...formData,
        addedDate: new Date().toISOString().split('T')[0]
      };
      saveVehicles([...vehicles, newVehicle]);
      setAlert({ type: 'success', message: 'הרכב נוסף בהצלחה!' });
    }

    setFormData({
      plateNumber: '',
      model: '',
      vin: '',
      barcode: '',
      maintenanceStatus: 'תקין'
    });
    setShowAddForm(false);

    setTimeout(() => setAlert(null), 3000);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plateNumber: vehicle.plateNumber,
      model: vehicle.model,
      vin: vehicle.vin,
      barcode: vehicle.barcode,
      maintenanceStatus: vehicle.maintenanceStatus
    });
    setShowAddForm(true);
  };

  const handleDelete = (vehicleId: string) => {
    if (confirm('האם אתם בטוחים שברצונכם למחוק את הרכב?')) {
      const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
      saveVehicles(updatedVehicles);
      setAlert({ type: 'success', message: 'הרכב נמחק בהצלחה!' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingVehicle(null);
    setFormData({
      plateNumber: '',
      model: '',
      vin: '',
      barcode: '',
      maintenanceStatus: 'תקין'
    });
  };

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
              <Car className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">ניהול רכבים</h1>
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

        {/* Add Vehicle Button */}
        {!showAddForm && (
          <div className="mb-6">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="fleet-btn fleet-primary text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              הוסף רכב חדש
            </Button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8 fleet-card fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                {editingVehicle ? 'עריכת רכב' : 'הוספת רכב חדש'}
              </CardTitle>
              <CardDescription>
                {editingVehicle ? 'עדכנו את פרטי הרכב' : 'הזינו את פרטי הרכב החדש'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plateNumber">מספר רכב</Label>
                    <Input
                      id="plateNumber"
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                      placeholder="123-45-678"
                      required
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">דגם</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      placeholder="טויוטה קורולה"
                      required
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vin">מספר זיהוי (VIN)</Label>
                    <Input
                      id="vin"
                      value={formData.vin}
                      onChange={(e) => setFormData({...formData, vin: e.target.value})}
                      placeholder="JT2BF28K0X0123456"
                      required
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="barcode">ברקוד</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                      placeholder="BAR001"
                      required
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="maintenanceStatus">סטטוס תחזוקה</Label>
                    <Select 
                      value={formData.maintenanceStatus} 
                      onValueChange={(value: 'תקין' | 'דורש טיפול') => 
                        setFormData({...formData, maintenanceStatus: value})
                      }
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="תקין">תקין</SelectItem>
                        <SelectItem value="דורש טיפול">דורש טיפול</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="fleet-btn fleet-primary text-white">
                    {editingVehicle ? 'עדכן רכב' : 'הוסף רכב'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Vehicles List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">רשימת רכבים ({vehicles.length})</h3>
          
          {vehicles.length === 0 ? (
            <Card className="fleet-card text-center py-12">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">אין רכבים במערכת</p>
              <p className="text-sm text-gray-500">הוסיפו רכב חדש כדי להתחיל</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle, index) => (
                <Card 
                  key={vehicle.id} 
                  className={`fleet-card slide-in-right`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{vehicle.plateNumber}</CardTitle>
                        <CardDescription>{vehicle.model}</CardDescription>
                      </div>
                      <Badge 
                        variant={vehicle.maintenanceStatus === 'תקין' ? 'default' : 'destructive'}
                        className="flex items-center gap-1"
                      >
                        {vehicle.maintenanceStatus === 'תקין' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {vehicle.maintenanceStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">VIN:</span> {vehicle.vin}</p>
                      <p><span className="font-medium">ברקוד:</span> {vehicle.barcode}</p>
                      <p><span className="font-medium">תאריך הוספה:</span> {vehicle.addedDate}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(vehicle)}
                        className="flex items-center gap-1 flex-1"
                      >
                        <Edit className="w-3 h-3" />
                        עריכה
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(vehicle.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        מחיקה
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

export default VehicleManagement;
