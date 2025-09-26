import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import PurchaseForm from './components/PurchaseForm';
import Dashboard from './components/Dashboard';
import SuccessPage from './components/SuccessPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'purchase' | 'success'>('landing');

  // Handle URL parameters for payment success/failure
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      setCurrentView('success');
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      setCurrentView('landing');
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show success page after payment
  if (currentView === 'success') {
    return (
      <SuccessPage 
        onContinue={() => setCurrentView(user ? 'landing' : 'login')} 
      />
    );
  }

  // Show dashboard if user is authenticated
  if (user) {
    return <Dashboard />;
  }

  // Show appropriate form based on current view
  switch (currentView) {
    case 'login':
      return (
        <LoginForm 
          onBack={() => setCurrentView('landing')}
          onSuccess={() => setCurrentView('landing')}
        />
      );
    case 'purchase':
      return (
        <PurchaseForm 
          onBack={() => setCurrentView('landing')}
          onSuccess={() => setCurrentView('success')}
        />
      );
    default:
      return (
        <LandingPage 
          onLogin={() => setCurrentView('login')}
          onPurchase={() => setCurrentView('purchase')}
        />
      );
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;