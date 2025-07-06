
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Camera, QrCode, ArrowRight, CheckCircle, Gauge } from 'lucide-react';

interface PublicFormProps {
  onBack: () => void;
}

const PublicForm: React.FC<PublicFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    barcode: '',
    image: null as File | null,
    mileage: '',
    feature: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    driverName: '',
    notes: ''
  });

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, image: file});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Save to localStorage for demonstration
    const reports = JSON.parse(localStorage.getItem('publicReports') || '[]');
    const newReport = {
      id: Date.now().toString(),
      ...formData,
      image: formData.image ? formData.image.name : null,
      submittedAt: new Date().toISOString()
    };
    reports.push(newReport);
    localStorage.setItem('publicReports', JSON.stringify(reports));

    setAlert({ type: 'success', message: 'הדיווח נשלח בהצלחה! תודה על התרומה לבטיחות הצי.' });
    
    // Reset form
    setFormData({
      barcode: '',
      image: null,
      mileage: '',
      feature: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      driverName: '',
      notes: ''
    });

    setIsSubmitting(false);
    setTimeout(() => setAlert(null), 5000);
  };

  const features = [
    'נסיעה רגילה',
    'הסעת אורחים',
    'משלוח דחוף',
    'פרויקט מיוחד',
    'אימון נהיגה',
    'תחזוקה שוטפת',
    'אחר'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                חזרה לדף הבית
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">טופס דיווח ציבורי</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <Alert className={`mb-6 ${alert.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <Card className="fleet-card fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">דיווח מצב רכב</CardTitle>
            <CardDescription className="text-lg">
              טופס זה מיועד לכלל הנהגים לדיווח על מצב הרכב לפני/אחרי השימוש
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Identification */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  זיהוי רכב
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="barcode">ברקוד רכב *</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    placeholder="סרקו או הזינו את הברקוד"
                    required
                    className="text-right"
                  />
                  <p className="text-xs text-gray-600">
                    ניתן למצוא את הברקוד על לוח המכוונים או על מפתח הרכב
                  </p>
                </div>
              </div>

              {/* Vehicle Photo */}
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  צילום רכב
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="image">צלמו את הרכב</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-right"
                  />
                  {formData.image && (
                    <p className="text-sm text-green-600">
                      נבחר קובץ: {formData.image.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    צלמו את הרכב מבחוץ לתיעוד מצבו הנוכחי
                  </p>
                </div>
              </div>

              {/* Mileage and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mileage" className="flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    מד מרחק (ק"מ) *
                  </Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    placeholder="123456"
                    required
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feature">תכונה/פרויקט/נסיעה *</Label>
                  <select
                    id="feature"
                    value={formData.feature}
                    onChange={(e) => setFormData({...formData, feature: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md text-right"
                  >
                    <option value="">בחרו סוג נסיעה</option>
                    {features.map(feature => (
                      <option key={feature} value={feature}>{feature}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">תאריך *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">שעה *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverName">שם נהג *</Label>
                <Input
                  id="driverName"
                  value={formData.driverName}
                  onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                  placeholder="הזינו את שמכם המלא"
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">הערות ובעיות שזוהו</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="תארו כל בעיה או ליקוי שזיהיתם ברכב..."
                  className="text-right"
                  rows={4}
                />
                <p className="text-xs text-gray-600">
                  אנא דווחו על כל דבר חריג שהבחנתם בו: רעשים, נוריות אזהרה, בעיות בהיגוי וכו'
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  type="submit" 
                  className="w-full fleet-btn fleet-secondary text-white py-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="spinner"></div>
                      שולח דיווח...
                    </div>
                  ) : (
                    'שלח דיווח'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6 fleet-card bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-800 mb-3">חשוב לדעת:</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• דיווח זה עוזר לנו לשמור על בטיחות הצי ולתכנן תחזוקה מונעת</li>
              <li>• אנא דווחו על כל בעיה או ליקוי, גם קטן</li>
              <li>• הדיווח נשמר במערכת ומתבצע עליו מעקב</li>
              <li>• במקרה חירום או בעיה חמורה, צרו קשר מיידי עם המוקד</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicForm;
