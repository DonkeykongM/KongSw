import React from 'react';
import { Brain, Home, Mail, User, LogOut, BookOpen, Menu, X } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useSubscription } from '../hooks/useSubscription';
import { useProfile } from '../hooks/useProfile';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSignOut: () => Promise<{ error: any }>;
  user: SupabaseUser;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, onSignOut, user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { getActiveProduct, hasActiveAccess } = useSubscription(user);
  const { profile } = useProfile(user);

  const navItems = [
    { id: 'home', label: 'Hem', icon: Home },
    { id: 'modules', label: 'Moduler', icon: Brain },
    { id: 'resources', label: 'Resurser', icon: BookOpen },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'contact', label: 'Kontakt', icon: Mail }
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const activeProduct = getActiveProduct();
  const hasAccess = hasActiveAccess();
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
              KongMindset
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {/* Navigation Items */}
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    currentPage === item.id
                      ? 'text-primary-600 bg-primary-50 shadow-sm'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-right">
                  <span className="text-sm text-neutral-600">Välkommen, {profile?.display_name || user?.email?.split('@')[0] || 'Användare'}</span>
                  {hasAccess && activeProduct && (
                    <div className="text-xs text-green-600 font-medium">
                      ✅ {activeProduct.name}
                    </div>
                  )}
                </div>
              </div>
              {/* Prominent Desktop Logout Button */}
              <button
                onClick={() => onSignOut()}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 min-h-[44px] shadow-md hover:shadow-lg"
                title="Logga ut"
              >
                <LogOut className="w-5 h-5" />
                <span>Logga ut</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            {/* Prominent Mobile Logout Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onSignOut()}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 min-h-[48px] min-w-[48px] shadow-md active:scale-95"
                title="Logga ut"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden xs:inline">Ut</span>
              </button>
              
              {/* Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 rounded-lg text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95"
                aria-label="Öppna meny"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl z-50 border-t border-gray-200 border-l border-r border-b rounded-b-lg">
            {/* Mobile User Info Header */}
            <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-medium text-gray-900">
                    {profile?.display_name || user?.email?.split('@')[0] || 'Elev'}
                  </span>
                  {hasAccess && activeProduct && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      ✅ Premium tillgång
                    </div>
                  )}
                </div>
                
                {/* Mobile Logout Button - Prominent */}
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 transition-all duration-200 min-h-[52px] text-base font-bold shadow-lg active:scale-95"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span>Logga ut</span>
                </button>
              </div>
            </div>
            
            <div className="px-4 py-4 space-y-2 bg-white">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left font-bold transition-all duration-200 min-h-[56px] text-base active:scale-95 ${
                      currentPage === item.id
                        ? 'text-blue-700 bg-blue-50 border border-blue-200'
                        : 'text-gray-900 hover:text-blue-700 hover:bg-blue-50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-6 h-6 flex-shrink-0 ${
                      currentPage === item.id ? 'text-blue-600' : 'text-gray-700'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;