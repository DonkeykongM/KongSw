import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LanguageProvider } from './contexts/LanguageContext';
import AuthForm from './components/AuthForm';
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import CourseModules from './components/CourseModules';
import ModuleDetail from './components/ModuleDetail';
import ResourcesPage from './components/ResourcesPage';
import ContactPage from './components/ContactPage';
import ProfilePage from './components/ProfilePage';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import TermsOfService from './components/TermsOfService';
import SuccessPage from './components/SuccessPage';
import { courseContent } from './data/courseContent';
import { ModuleContent } from './data/courseContent';

function App() {
  const { user, loading, signIn, signOut, isConfigured } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedModule, setSelectedModule] = useState<ModuleContent | null>(null);

  // Handle payment success/failure from URL params
  React.useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        setCurrentPage('success');
        setShowAuthForm(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentStatus === 'cancelled') {
        setShowAuthForm(false);
        setCurrentPage('home');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('Error handling URL params:', error);
    }
  }, []);

  // Debug auth state changes
  React.useEffect(() => {
    console.log('🔍 Auth state debug:', {
      user: user?.email || 'No user',
      loading,
      showAuthForm,
      currentPage,
      isConfigured
    });
  }, [user, loading, showAuthForm, currentPage, isConfigured]);

  const handleModuleStart = (moduleId: number) => {
    const module = courseContent.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
      setCurrentPage('module-detail');
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedModule(null);
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setSelectedModule(null);
  };

  const handleJoinClick = () => {
    setShowAuthForm(true);
  };

  const handleBackToLanding = () => {
    setCurrentPage('home');
    setShowAuthForm(false);
  };

  const handleSuccessContinue = () => {
    if (user) {
      setCurrentPage('modules');
    } else {
      setCurrentPage('auth');
      setShowAuthForm(true);
    }
  };


  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg font-medium">
            {user ? 'Förbereder din kurs...' : 'Kontrollerar inloggning...'}
          </p>
          {!isConfigured && (
            <p className="text-neutral-500 text-sm mt-2">⚠️ Supabase inte konfigurerat - kör i demo-läge</p>
          )}
        </div>
      </div>
    );
  }

  // Handle success page first
  if (currentPage === 'success') {
    return (
      <LanguageProvider>
        <SuccessPage onContinue={handleSuccessContinue} user={user} />
      </LanguageProvider>
    );
  }

  // Show auth form only if explicitly requested and no user
  if (showAuthForm && !user) {
    return (
      <LanguageProvider>
        <AuthForm onSignIn={signIn} onBack={handleBackToLanding} />
      </LanguageProvider>
    );
  }

  // Show landing page if no user and not showing auth form
  if (!user && !showAuthForm) {
    return (
      <LanguageProvider>
        <LandingPage onJoinClick={handleJoinClick} />
      </LanguageProvider>
    );
  }

  // Show module detail if selected
  if (currentPage === 'module-detail' && selectedModule) {
    return (
      <LanguageProvider>
        <ModuleDetail module={selectedModule} onBack={handleBackToHome} onSignOut={signOut} />
      </LanguageProvider>
    );
  }

  // Show other pages
  if (currentPage === 'contact') {
    return (
      <LanguageProvider>
        <ContactPage onBack={handleBackToHome} onSignOut={signOut} />
      </LanguageProvider>
    );
  }

  if (currentPage === 'profile') {
    return (
      <LanguageProvider>
        <ProfilePage onBack={handleBackToHome} onSignOut={signOut} user={user} />
      </LanguageProvider>
    );
  }

  if (currentPage === 'resources') {
    return (
      <LanguageProvider>
        <ResourcesPage onBack={handleBackToHome} onSignOut={signOut} user={user} />
      </LanguageProvider>
    );
  }

  if (currentPage === 'privacy-policy') {
    return (
      <LanguageProvider>
        <PrivacyPolicy onBack={handleBackToHome} />
      </LanguageProvider>
    );
  }

  if (currentPage === 'cookie-policy') {
    return (
      <LanguageProvider>
        <CookiePolicy onBack={handleBackToHome} />
      </LanguageProvider>
    );
  }

  if (currentPage === 'terms-of-service') {
    return (
      <LanguageProvider>
        <TermsOfService onBack={handleBackToHome} />
      </LanguageProvider>
    );
  }

  // Default: Show main course interface
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50">
        <Navigation currentPage={currentPage} onNavigate={handleNavigation} onSignOut={signOut} user={user} />
        <main className="flex-grow">
          <CourseModules onModuleStart={handleModuleStart} />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;