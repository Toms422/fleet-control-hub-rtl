import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Printer } from "lucide-react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

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
  const [plateNumber, setPlateNumber] = useState("");
  const [model, setModel] = useState("");

  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const qrCanvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    const savedVehicles = localStorage.getItem("vehicles");
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }
  };

  const saveVehicles = (vehicles: Vehicle[]) => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
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
        lineColor: "#000000",
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
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    }
  };

  useEffect(() => {
    vehicles.forEach((vehicle) => {
      if (vehicle.barcode) {
        generateBarcode(vehicle.id, vehicle.barcode);
        generateQRCode(vehicle.id, vehicle.barcode);
      }
    });
  }, [vehicles]);

  const handleAddVehicle = () => {
    if (!plateNumber.trim()) {
      alert("אנא הזן מספר רכב");
      return;
    }
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      plateNumber,
      model,
      barcode: plateNumber, // משתמשים במספר הרכב כברקוד
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
    setPlateNumber("");
    setModel("");
  };

  const downloadBarcode = (vehicle: Vehicle, type: "barcode" | "qr") => {
    const canvas =
      type === "barcode"
        ? canvasRefs.current[vehicle.id]
        : qrCanvasRefs.current[vehicle.id];

    if (canvas) {
      const link = document.createElement("a");
      link.download = `${vehicle.plateNumber}_${type}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const printBarcode = (vehicle: Vehicle) => {
    const barcodeCanvas = canvasRefs.current[vehicle.id];
    const qrCanvas = qrCanvasRefs.current[vehicle.id];

    if (barcodeCanvas && qrCanvas) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ברקוד רכב ${vehicle.plateNumber}</title>
            </head>
            <body>
              <h3>ברקוד:</h3>
              <img src="${barcodeCanvas.toDataURL()}" />
              <h3>קוד QR:</h3>
              <img src="${qrCanvas.toDataURL()}" />
              <script>
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="p-4">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        חזרה
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>הוספת רכב חדש</CardTitle>
          <CardDescription>הזן את פרטי הרכב כדי ליצור ברקוד</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="מספר רכב"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
          />
          <Input
            placeholder="דגם רכב (לא חובה)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <Button onClick={handleAddVehicle}>צור ברקוד</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader>
              <CardTitle>רכב {vehicle.plateNumber}</CardTitle>
              <CardDescription>{vehicle.model}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-center">
              <canvas
                ref={(el) => (canvasRefs.current[vehicle.id] = el)}
              ></canvas>
              <canvas
                ref={(el) => (qrCanvasRefs.current[vehicle.id] = el)}
              ></canvas>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadBarcode(vehicle, "barcode")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  הורד ברקוד
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadBarcode(vehicle, "qr")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  הורד QR
                </Button>
                <Button
                  variant="outline"
                  onClick={() => printBarcode(vehicle)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  הדפס
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BarcodeGenerator;
