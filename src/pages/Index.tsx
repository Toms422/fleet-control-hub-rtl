
import React, { useState, useEffect } from 'react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import VehicleManagement from '@/components/VehicleManagement';
import Maintenance from '@/components/Maintenance';
import PublicForm from '@/components/PublicForm';

type Page = 'login' | 'dashboard' | 'vehicles' | 'maintenance' | 'reports' | 'calendar' | 'public-form';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const handleNavigate = (page: string) => {
    if (page === 'public-form') {
      setCurrentPage('public-form');
    } else if (isLoggedIn) {
      setCurrentPage(page as Page);
    } else {
      setCurrentPage('login');
    }
  };

  const handleBack = () => {
    if (currentPage === 'public-form') {
      setCurrentPage(isLoggedIn ? 'dashboard' : 'login');
    } else if (isLoggedIn) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('login');
    }
  };

  // Render different pages based on current state
  switch (currentPage) {
    case 'login':
      return <Login onLogin={handleLogin} />;
    
    case 'dashboard':
      return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
    
    case 'vehicles':
      return <VehicleManagement onBack={handleBack} />;
    
    case 'maintenance':
      return <Maintenance onBack={handleBack} />;
    
    case 'public-form':
      return <PublicForm onBack={handleBack} />;
    
    case 'reports':
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">דוחות - בפיתוח</h2>
            <p className="text-gray-600 mb-6">דף הדוחות נמצא בשלבי פיתוח ויהיה זמין בקרוב</p>
            <button 
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              חזרה לדף הבית
            </button>
          </div>
        </div>
      );
    
    case 'calendar':
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">לוח שנה - בפיתוח</h2>
            <p className="text-gray-600 mb-6">לוח השנה נמצא בשלבי פיתוח ויהיה זמין בקרוב</p>
            <button 
              onClick={handleBack}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              חזרה לדף הבית
            </button>
          </div>
        </div>
      );
    
    default:
      return <Login onLogin={handleLogin} />;
  }
};

export default Index;
