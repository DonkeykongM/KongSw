import React, { useState } from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, CreditCard, AlertCircle, ArrowLeft, CheckCircle, User, Shield } from 'lucide-react';
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registering, setRegistering] = useState(false);

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Minst 8 tecken');
    if (!/[A-Z]/.test(password)) errors.push('Minst en stor bokstav');
    if (!/[a-z]/.test(password)) errors.push('Minst en liten bokstav');
    if (!/[0-9]/.test(password)) errors.push('Minst en siffra');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Minst ett specialtecken');
    return errors;
  };

  const passwordErrors = password ? validatePassword(password) : [];
  const isPasswordValid = passwordErrors.length === 0 && password.length > 0;
  const passwordsMatch = password === confirmPassword;

  // Handle direct registration (not purchase)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setError('');
    setSuccess('');

    // Validation
    if (!email.trim() || !password || !confirmPassword || !name.trim()) {
      setError('Alla fält måste fyllas i');
      setRegistering(false);
      return;
    }

    if (!isPasswordValid) {
      setError('Lösenordet uppfyller inte säkerhetskraven');
      setRegistering(false);
      return;
    }

    if (!passwordsMatch) {
      setError('Lösenorden stämmer inte överens');
      setRegistering(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Ange en giltig e-postadress');
      setRegistering(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Systemet är inte konfigurerat. Kontakta support.');
      setRegistering(false);
      return;
    }

    try {
      // Create user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
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
        } else if (signUpError.message.includes('weak password')) {
          setError('Lösenordet är för svagt. Använd ett starkare lösenord.');
        } else {
          setError(`Registrering misslyckades: ${signUpError.message}`);
        }
        setRegistering(false);
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
      setRegistering(false);
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

      // Password validation for purchase
      if (!isPasswordValid) {
        setError('Lösenordet måste uppfylla säkerhetskraven (se nedan).');
        setLoading(false);
        return;
      }

      setSuccess('Förbereder säker betalning...');

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://acdwexqoonauzzjtoexx.supabase.co';
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
          } else if (response.status === 403) {
            errorMessage = 'Åtkomst nekad. Kontrollera din internetanslutning.';
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
      
      // Provide more specific error messages
      let userFriendlyError = err.message || 'Betalningen kunde inte startas';
      
      if (err.message?.includes('fetch')) {
        userFriendlyError = 'Kunde inte ansluta till betalningssystemet. Kontrollera din internetanslutning och försök igen.';
      } else if (err.message?.includes('network')) {
        userFriendlyError = 'Nätverksfel. Kontrollera din internetanslutning och försök igen.';
      }
      
      setError(userFriendlyError);
      setSuccess('');
      setLoading(false);
    }
  };

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
                    className="w-full pl-10 pr-12 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent password-input"
                    placeholder="Ditt lösenord"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 password-toggle-btn"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Loggar in...' : 'Logga in på kursen'}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                  onClick={async () => {
                    if (!email.trim()) {
                      setError('Ange din e-postadress först');
                      return;
                    }
                    
                    setLoading(true);
                    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
                    
                    if (error) {
                      setError('Kunde inte skicka återställningslänk');
                    } else {
                      setSuccess('Återställningslänk skickad till din e-post!');
                    }
                    setLoading(false);
                  }}
                >
                  Glömt lösenord?
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
                    disabled={loading || registering}
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
                    disabled={loading || registering}
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
                    className={`w-full pl-10 pr-12 py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent password-input ${
                      password && !isPasswordValid ? 'border-red-300 bg-red-50' : 'border-neutral-300'
                    }`}
                    placeholder="Minst 8 tecken, stor/liten bokstav, siffra, specialtecken"
                    required
                    minLength={8}
                    disabled={loading || registering}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 z-10 password-toggle-btn"
                    aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            passwordErrors.length <= 4 - level
                              ? passwordErrors.length === 0
                                ? 'bg-green-500'
                                : passwordErrors.length <= 2
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {passwordErrors.length > 0 && (
                      <div className="text-xs text-red-600">
                        Saknas: {passwordErrors.join(', ')}
                      </div>
                    )}
                    {isPasswordValid && (
                      <div className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Starkt lösenord!
                      </div>
                    )}
                  </div>
                )}
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
                    className={`w-full pl-10 pr-12 py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent password-input ${
                      confirmPassword && !passwordsMatch ? 'border-red-300 bg-red-50' : 'border-neutral-300'
                    }`}
                    placeholder="Upprepa lösenordet"
                    required
                    disabled={loading || registering}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 z-10 password-toggle-btn"
                    aria-label={showConfirmPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="mt-2">
                    {passwordsMatch ? (
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
                disabled={loading || !isPasswordValid || !passwordsMatch || !email.trim() || !name.trim()}
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

          {/* Switch Mode */}

          {/* Help Text */}
          <div className="text-center mt-4 text-xs text-neutral-500">
            Logga in med e-post och lösenord från ditt köp. Glömt lösenord? Använd återställningslänken ovan.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;