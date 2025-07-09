import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VehicleManagement from './components/VehicleManagement';
import Maintenance from './components/Maintenance';
import Reports from './components/Reports';
import Calendar from './components/Calendar';
import History from './components/History';
import BarcodeGenerator from './components/BarcodeGenerator';
import PublicForm from './components/PublicForm';
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
    setCurrentPage('dashboard');
  };

  // Component for handling URL-based public form access
  const PublicFormHandler = () => {
    const location = useLocation();
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      // Check if accessing via direct URL with barcode parameter
      const urlParams = new URLSearchParams(location.search);
      const barcodeParam = urlParams.get('barcode');
      
      if (barcodeParam) {
        // Allow access to public form when barcode is present
        setHasAccess(true);
      } else if (isLoggedIn) {
        // Allow access when logged in
        setHasAccess(true);
      }
    }, [location]);

    if (!hasAccess && !isLoggedIn) {
      return <Login onLogin={handleLogin} />;
    }

    return <PublicForm onBack={() => window.history.back()} />;
  };

  return (
    <TooltipProvider>
      <Router>
        <div className="App">
          <Toaster />
          <Routes>
            {/* Public route for barcode scanning */}
            <Route path="/public" element={<PublicFormHandler />} />
            
            {/* Main application routes */}
            <Route path="/" element={
              !isLoggedIn ? (
                <Login onLogin={handleLogin} />
              ) : (
                <>
                  {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} onLogout={handleLogout} />}
                  {currentPage === 'vehicles' && <VehicleManagement onBack={() => setCurrentPage('dashboard')} />}
                  {currentPage === 'maintenance' && <Maintenance onBack={() => setCurrentPage('dashboard')} />}
                  {currentPage === 'reports' && <Reports onBack={() => setCurrentPage('dashboard')} />}
                  {currentPage === 'calendar' && <Calendar onBack={() => setCurrentPage('dashboard')} />}
                  {currentPage === 'history' && <History onBack={() => setCurrentPage('dashboard')} />}
                  {currentPage === 'barcodes' && <BarcodeGenerator onBack={() => setCurrentPage('dashboard')} />}
                  {currentPage === 'public' && <PublicForm onBack={() => setCurrentPage('dashboard')} />}
                </>
              )
            } />
          </Routes>
        </div>
      </Router>
    </TooltipProvider>
  );
}

export default App;