import React, { useState } from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, CreditCard, AlertCircle, ArrowLeft, CheckCircle, User, Shield } from 'lucide-react';
import SupabaseDiagnostic from './SupabaseDiagnostic';
import { isSupabaseConfigured } from '../lib/supabase';

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔑 Försöker logga in:', email);
      
      const result = await onSignIn(email.trim(), password.trim());
      
      if (result.error) {
        setError(result.error.message || 'Inloggning misslyckades');
      } else {
        console.log('✅ Inloggning lyckades');
        setSuccess('Inloggning lyckades! Omdirigerar...');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('Ett oväntat fel uppstod');
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

      if (!isLogin && password !== confirmPassword) {
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

      setSuccess('Kontaktar betalningssystem...');

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
          const errorText = await response.text();
          console.error('Checkout error:', response.status, errorText);
          
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
      
      let userFriendlyError = err.message || 'Betalningen kunde inte startas';
      
      if (err.message?.includes('fetch')) {
        userFriendlyError = 'Kunde inte ansluta till betalningssystemet. Kontrollera din internetanslutning och försök igen.';
      }
      
      setError(userFriendlyError);
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
              {isLogin ? 'Logga in på din kurs' : 'Köp KongMindset-kursen'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Använd e-post och lösenord från ditt köp' : 'Få omedelbar tillgång till alla 13 moduler + Napoleon Hill AI'}
            </p>
          </div>

          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-6">
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
                    placeholder="Ditt lösenord"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Loggar in...' : 'Logga in på kursen'}
              </button>

              {/* Purchase Option */}
              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Har du inte köpt kursen än?</p>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-4 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🛒 Köp kursen - 299 kr
                </button>
              </div>
            </form>
          ) : (
            // Course Purchase Form
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-800 mb-2">🎯 Köp KongMindset-kursen</h3>
                  <p className="text-green-700 text-sm mb-4">Få omedelbar tillgång efter betalning</p>
                  <div className="bg-white rounded-lg p-4 border border-green-300">
                    <div className="text-3xl font-bold text-green-600">299 kr</div>
                    <div className="text-sm text-green-700">Kampanj hela 2025</div>
                  </div>
                </div>
              </div>

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
                    placeholder="Minst 6 tecken"
                    required
                    minLength={6}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bekräfta lösenord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      confirmPassword && password !== confirmPassword ? 'border-red-300 bg-red-50' : 'border-neutral-300'
                    }`}
                    placeholder="Upprepa lösenordet"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 z-10"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="mt-2">
                    {password === confirmPassword ? (
                      <div className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Lösenorden matchar
                      </div>
                    ) : (
                      <div className="text-xs text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Lösenorden matchar inte
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* What's Included */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                <h4 className="font-bold text-blue-800 mb-3">Vad du får för 299 kr:</h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>13 interaktiva moduler (livstidsåtkomst)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Napoleon Hill AI-mentor 24/7</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>GRATIS originalbok "Tänk och Bli Rik"</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>30 dagars pengarna-tillbaka-garanti</span>
                  </li>
                </ul>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handleStripeCheckout}
                disabled={loading || !email.trim() || !name.trim() || !password || password !== confirmPassword}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-4 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Förbereder säker betalning...' : '🛒 Köp kurs för 299 kr'}
              </button>
              
              {/* Security Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>SSL-säker</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-3 h-3" />
                    <span>Stripe-betalning</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Omedelbar tillgång</span>
                  </div>
                </div>
              </div>

              {/* Switch to Login */}
              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Har du redan köpt kursen?</p>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary-600 hover:text-primary-700 font-semibold underline"
                >
                  Logga in här
                </button>
              </div>
            </div>
          )}

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
            {isLogin ? 
              'Logga in med samma e-post och lösenord som du använde vid köpet.' :
              'Efter betalning kan du logga in direkt med dessa uppgifter.'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;