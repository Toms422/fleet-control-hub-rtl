import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, QrCode, Printer, RefreshCw } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

interface BarcodeGeneratorProps {
  onBack: () => void;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  barcode: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ onBack }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const qrCanvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }
  };

  const generateBarcode = (vehicleId: string, barcode: string) => {
    const canvas = canvasRefs.current[vehicleId];
    if (canvas) {
      JsBarcode(canvas, barcode, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 20,
        margin: 10,
        background: "#ffffff",
        lineColor: "#000000"
      });
    }
  };

  const generateQRCode = async (vehicleId: string, barcode: string) => {
    const canvas = qrCanvasRefs.current[vehicleId];
    if (canvas) {
      const publicFormUrl = `${window.location.origin}/#/public?barcode=${barcode}`;
      try {
        await QRCode.toCanvas(canvas, publicFormUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  useEffect(() => {
    vehicles.forEach(vehicle => {
      if (vehicle.barcode) {
        generateBarcode(vehicle.id, vehicle.barcode);
        generateQRCode(vehicle.id, vehicle.barcode);
      }
    });
  }, [vehicles]);

  const downloadBarcode = (vehicle: Vehicle, type: 'barcode' | 'qr') => {
    const canvas = type === 'barcode' 
      ? canvasRefs.current[vehicle.id]
      : qrCanvasRefs.current[vehicle.id];
    
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${vehicle.plateNumber}_${type}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const printBarcode = (vehicle: Vehicle) => {
    const barcodeCanvas = canvasRefs.current[vehicle.id];
    const qrCanvas = qrCanvasRefs.current[vehicle.id];
    
    if (barcodeCanvas && qrCanvas) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ברקוד רכב ${vehicle.plateNumber}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px;
                  direction: rtl;
                }
                .vehicle-info {
                  margin-bottom: 20px;
                  font-size: 18px;
                  font-weight: bold;
                }
                .code-section {
                  margin: 30px 0;
                  padding: 20px;
                  border: 2px solid #ccc;
                  border-radius: 10px;
                }
                .code-title {
                  font-size: 16px;
                  margin-bottom: 10px;
                  color: #666;
                }
                @media print {
                  body { margin: 0; }
                  .code-section { break-inside: avoid; }
                }
              </style>
            </head>
            <body>
              <div class="vehicle-info">
                רכב: ${vehicle.plateNumber} - ${vehicle.model}
              </div>
              
              <div class="code-section">
                <div class="code-title">ברקוד לסריקה</div>
                <img src="${barcodeCanvas.toDataURL()}" />
              </div>
              
              <div class="code-section">
                <div class="code-title">QR Code לטופס דיווח</div>
                <img src="${qrCanvas.toDataURL()}" />
                <div style="font-size: 12px; margin-top: 10px; color: #666;">
                  סרוק להגשת דיווח על רכב זה
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const regenerateBarcode = (vehicle: Vehicle) => {
    const newBarcode = `VEH-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const updatedVehicles = vehicles.map(v => 
      v.id === vehicle.id ? { ...v, barcode: newBarcode } : v
    );
    
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    
    // Regenerate codes
    setTimeout(() => {
      generateBarcode(vehicle.id, newBarcode);
      generateQRCode(vehicle.id, newBarcode);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">יצירת ברקודים</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>יצירת ברקודים לרכבים</CardTitle>
              <CardDescription>
                יצרו ברקודים ייחודיים לכל רכב בצי. ניתן להדפיס ולהדביק על הרכב לדיווח מהיר.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">אין רכבים במערכת</h3>
              <p className="text-gray-600">הוסיפו רכבים במערכת כדי ליצור ברקודים.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vehicles.map(vehicle => (
              <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{vehicle.plateNumber} - {vehicle.model}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => regenerateBarcode(vehicle)}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      יצירה מחדש
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    ברקוד: {vehicle.barcode || 'לא נוצר'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Barcode Section */}
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">ברקוד</h4>
                    <div className="bg-white p-4 border rounded-lg">
                      <canvas
                        ref={el => canvasRefs.current[vehicle.id] = el}
                        className="mx-auto"
                      />
                    </div>
                    <div className="flex gap-2 mt-3 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadBarcode(vehicle, 'barcode')}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        הורדה
                      </Button>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">QR Code לטופס דיווח</h4>
                    <div className="bg-white p-4 border rounded-lg">
                      <canvas
                        ref={el => qrCanvasRefs.current[vehicle.id] = el}
                        className="mx-auto"
                      />
                    </div>
                    <div className="flex gap-2 mt-3 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadBarcode(vehicle, 'qr')}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        הורדה
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => printBarcode(vehicle)}
                      className="w-full flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      הדפסת ברקודים
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeGenerator;