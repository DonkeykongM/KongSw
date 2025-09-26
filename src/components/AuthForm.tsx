import React, { useState } from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, CreditCard, AlertCircle, ArrowLeft } from 'lucide-react';

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
        if (result.error.message?.includes('Invalid login credentials')) {
          setError('Fel e-post eller lösenord. Kontrollera att du använder samma uppgifter som vid köpet.');
        } else {
          setError(result.error.message || 'Inloggning misslyckades');
        }
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
          {/* Toggle Buttons */}
          <div className="flex rounded-lg bg-neutral-100 p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Logga in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Köp kurs
            </button>
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
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Lösenord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ditt lösenord"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
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
            </form>
          ) : (
            // Purchase Form
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ditt namn
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="För- och efternamn"
                  disabled={loading}
                  required
                />
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
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Välj lösenord <span className="text-xs text-gray-500">(blir ditt inloggningslösenord)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Minst 6 tecken"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bekräfta lösenord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-4 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Upprepa lösenordet"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Komplett KongMindset-kurs</span>
                </div>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>🎯 13 interaktiva moduler (livstidsåtkomst)</li>
                  <li>🧠 Napoleon Hill AI-mentor (24/7)</li>
                  <li>📚 GRATIS originalbok "Tänk och Bli Rik"</li>
                  <li>💚 30 dagars pengarna-tillbaka-garanti</li>
                  <li>🔐 Ditt konto skapas automatiskt efter betalning</li>
                </ul>
              </div>

              <button
                onClick={handleStripeCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-4 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Förbereder betalning...' : '🛒 Köp kurs för 299 kr'}
              </button>
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
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              </div>
              <p className="text-sm text-green-600 font-medium">{success}</p>
            </div>
          )}

          {/* Switch Mode */}
          <div className="text-center mt-6 text-sm text-neutral-600">
            {isLogin ? "Behöver du köpa kursen? " : "Har du redan köpt kursen? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 font-medium underline"
              disabled={loading}
            >
              {isLogin ? 'Köp här' : 'Logga in här'}
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center mt-4 text-xs text-neutral-500">
            {isLogin 
              ? 'Använd samma e-post och lösenord som du använde vid köpet' 
              : 'Efter betalning skapas ditt konto automatiskt med dessa inloggningsuppgifter'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;