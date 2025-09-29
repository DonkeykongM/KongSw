import React, { useState } from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, User, AlertCircle } from 'lucide-react';
import SupabaseDiagnostic from './SupabaseDiagnostic';
import { isSupabaseConfigured } from '../lib/supabase';
import { supabase } from '../lib/supabase';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<{ data?: any; error: any }>;
  onBack: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSignIn, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔑 Försöker logga in:', email);
      
      const result = await onSignIn(email.trim(), password.trim());
      
      if (result.error) {
        setError(result.error.message || 'Inloggning misslyckades');
      } else {
        console.log('✅ Inloggning lyckades');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('Ett oväntat fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!email.trim() || !password || !confirmPassword || !name.trim()) {
      setError('Alla fält måste fyllas i');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Lösenorden stämmer inte överens');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken långt');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Ange en giltig e-postadress');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Systemet är inte konfigurerat. Kontakta support.');
      setLoading(false);
      return;
    }

    try {
      // Create user with Supabase Auth - NO EMAIL CONFIRMATION
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: undefined, // No email confirmation needed
          data: {
            display_name: name.trim(),
            full_name: name.trim()
          }
        }
      });

      if (signUpError) {
        console.error('Registration error:', signUpError);
        
        if (signUpError.message.includes('already registered')) {
          setError('E-postadressen är redan registrerad. Försök logga in istället.');
        } else {
          setError(`Registrering misslyckades: ${signUpError.message}`);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccess('✅ Konto skapat! Du kan nu logga in med dina uppgifter.');
        
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        
        // Switch to login mode after 2 seconds
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 2000);
      }

    } catch (err: any) {
      console.error('Registration exception:', err);
      setError('Ett oväntat fel uppstod vid registrering');
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Basic validation
      if (!email || !password || !name) {
        setError('Alla fält krävs för att köpa kursen.');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Lösenorden stämmer inte överens.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Lösenordet måste vara minst 6 tecken långt.');
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Ange en giltig e-postadress.');
        setLoading(false);
        return;
      }

      setSuccess('Förbereder säker betalning...');

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        setError('Betalningssystemet är inte tillgängligt just nu. Kontakta support på support@kongmindset.se');
        setLoading(false);
        return;
      }

      console.log('🛒 Startar checkout för:', email);

      // Create checkout session
      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          name: name.trim(),
          source: 'kongmindset_course_purchase'
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Kunde inte starta betalningen';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          if (response.status === 404) {
            errorMessage = 'Betalningsfunktionen är inte tillgänglig. Kontakta support.';
          } else if (response.status === 500) {
            errorMessage = 'Serverfel uppstod. Försök igen om en stund.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const { url } = await response.json();
      
      if (!url) {
        throw new Error('Ingen betalnings-URL mottagen');
      }

      console.log('✅ Omdirigerar till Stripe checkout');
      setSuccess('🎯 Omdirigerar till säker betalning...');
      
      // Redirect to Stripe
      window.location.href = url;
      
    } catch (err: any) {
      console.error('Checkout fel:', err);
      setError(err.message || 'Betalningen kunde inte startas');
      setSuccess('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Show diagnostic if Supabase not configured */}
        {!isSupabaseConfigured && (
          <div className="mb-6">
            <SupabaseDiagnostic />
          </div>
        )}

        {/* Back Button */}
        <div className="text-left mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors bg-white/80 px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Tillbaka till hemsidan</span>
          </button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-2">
            KongMindset
          </h1>
          <p className="text-neutral-600">Napoleon Hills Tänk och Bli Rik</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Logga in på din kurs' : 'Skapa konto'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Använd e-post och lösenord' : 'Skapa ditt konto för att komma igång'}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
            {/* Name field for registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ditt namn
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="För- och efternamn"
                    disabled={loading}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                E-postadress
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="din@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Lösenord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={isLogin ? "Ditt lösenord" : "Minst 6 tecken"}
                  required
                  disabled={loading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                  aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password for registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bekräfta lösenord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Upprepa lösenordet"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (isLogin ? 'Loggar in...' : 'Skapar konto...') : (isLogin ? 'Logga in' : 'Skapa konto')}
            </button>

            {/* Switch between login/register */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                {isLogin ? 'Har du inte ett konto än?' : 'Har du redan ett konto?'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-primary-600 hover:text-primary-700 font-semibold underline"
              >
                {isLogin ? 'Skapa nytt konto' : 'Logga in istället'}
              </button>
            </div>

            {/* Purchase Option for Login */}
            {isLogin && (
              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Har du inte köpt kursen än?</p>
                <button
                  type="button"
                  onClick={handleStripeCheckout}
                  disabled={loading || !email || !password}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-4 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                >
                  🛒 Köp kursen - 299 kr
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Använd samma e-post och lösenord som ovan
                </p>
              </div>
            )}
          </form>

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-600">{error}</p>
                {error.includes('support') && (
                  <p className="text-xs text-red-500 mt-1">
                    📧 E-post: support@kongmindset.se
                  </p>
                )}
              </div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-600 font-medium">{success}</p>
            </div>
          )}

          {/* Help Text */}
          <div className="text-center mt-4 text-xs text-neutral-500">
            {isLogin ? 'Logga in med e-post och lösenord' : 'Skapa konto för att komma igång'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;