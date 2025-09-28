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
  const [appError, setAppError] = useState<string | null>(null);

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
      setAppError('Ett fel uppstod vid laddning av sidan');
    }
  }, []);

  // Error boundary effect
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setAppError('Ett oväntat fel uppstod. Ladda om sidan.');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setAppError('Ett nätverksfel uppstod. Kontrollera din internetanslutning.');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

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

  // Show error state if there's an app error
  if (appError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ett fel uppstod</h2>
          <p className="text-gray-600 mb-6">{appError}</p>
          <button
            onClick={() => {
              setAppError(null);
              window.location.reload();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Ladda om sidan
          </button>
        </div>
      </div>
    );
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg font-medium">Laddar din kurs...</p>
          {!isConfigured && (
            <p className="text-neutral-500 text-sm mt-2">⚠️ Supabase inte konfigurerat - kör i demo-läge</p>
          )}
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Ladda om om sidan hänger sig
            </button>
          </div>
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

  // Show auth form if requested or if user not logged in and trying to access protected content
  if (showAuthForm || (currentPage === 'auth')) {
    return (
      <LanguageProvider>
        <AuthForm onSignIn={signIn} onBack={handleBackToLanding} />
      </LanguageProvider>
    );
  }

  // Show landing page if no user
  if (!user) {
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