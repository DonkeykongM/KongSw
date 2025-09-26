import React, { useState } from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, CreditCard, AlertCircle, ArrowLeft } from 'lucide-react';
import { stripeProducts } from '../stripe-config';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  onSignUp: (email: string, password: string) => Promise<{ error: any }>;
  onBack: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSignIn, onSignUp, onBack }) => {
  const mainCourse = stripeProducts.find(p => p.name === 'Paid Main Course offer');
  const coursePrice = mainCourse ? `${mainCourse.price} kr` : '299 kr';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');
    setSuccess('Förbereder säker betalning...');

    try {
      // Validate form first
      if (!email || !password) {
        setError('Vänligen fyll i både e-post och lösenord.');
        setLoading(false);
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setError('Lösenorden stämmer inte överens.');
        setLoading(false);
        return;
      }

      if (!isLogin && password.length < 6) {
        setError('Lösenordet måste vara minst 6 tecken långt.');
        setLoading(false);
        return;
      }

      console.log('Creating checkout session for email:', email);

      // Ensure we have the correct product and price ID
      if (!mainCourse || !mainCourse.priceId) {
        setError('Produktinformation saknas. Försök igen senare.');
        setLoading(false);
        return;
      }

      // Create checkout session (account will be created after payment)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: email.split('@')[0], // Use email prefix as name
          priceId: mainCourse.priceId,
          success_url: `${window.location.origin}?payment=success`,
          cancel_url: `${window.location.origin}?payment=cancelled`,
        }),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        console.error('Stripe checkout error response:', response.status, responseText);
        
        let errorMessage = 'Failed to create checkout session';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response isn't JSON, use default message
        }
        
        if (response.status === 500) {
          errorMessage = 'Payment system temporarily unavailable. Please try again in a moment.';
        }
        
        throw new Error(errorMessage);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        throw new Error('Invalid response from payment system');
      }
      
      const { url } = responseData;

      if (!url) {
        setError('Kunde inte starta betalningen. Försök igen.');
        return;
      }

      console.log('Redirecting to Stripe checkout. Account will be created after payment for:', email);
      setSuccess('🎯 Omdirigerar till säker betalning...');
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Payment error:', err);
      
      // Handle fetch errors (Edge Function not deployed)
      if (err instanceof TypeError && err.message && err.message.includes('Failed to fetch')) {
        setError(`🚨 STRIPE CHECKOUT FUNKTION INTE DEPLOYAD

🚨 KONTROLLERA STRIPE-KONFIGURATION

Din betalning gick igenom men kontot skapades inte. Detta kan bero på:

MÖJLIGA PROBLEM:

1. 📂 Stripe Webhook inte deployad:
   Gå till Supabase Dashboard → Edge Functions → Skapa "stripe-webhook"

2. 🔗 Webhook URL inte konfigurerad i Stripe:
   Lägg till: https://acdwexqoonauzzjtoexx.supabase.co/functions/v1/stripe-webhook

3. 🔑 Webhook Secret inte konfigurerad:
   Kopiera webhook secret från Stripe → Supabase Environment Variables

SNABBFIX:
📧 Skicka ett mail till support@kongmindset.se med:
- Din e-postadress: ${email}
- Texten: "Köpte kursen men kan inte logga in"
- Vi aktiverar ditt konto manuellt inom 1 timme

Alternativt kan du försöka köpa igen (ingen dubbel debitering sker).`);
      } else {
        // Handle other errors
        let errorMessage = 'Kunde inte ansluta till betalningssystemet. Försök igen.';
        
        if (err instanceof Error && err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      }
      
      setSuccess('');
      setLoading(false);
    } finally {
      // setLoading(false); is now handled in each error case above
    }
  };

  // Clear any previous errors when switching modes
  React.useEffect(() => {
    setError('');
    setSuccess('');
  }, [isLogin]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear errors when user starts typing
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(''); // Clear errors when user starts typing
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('E-postadress krävs');
      return false;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Ange en giltig e-postadress');
      return false;
    }
    
    if (!password.trim()) {
      setError('Lösenord krävs');
      return false;
    }
    
    if (!isLogin) {
      if (password.length < 6) {
        setError('Lösenordet måste vara minst 6 tecken långt');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Lösenorden stämmer inte överens');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    if (isLogin) {
      // Handle existing user login
      setLoading(true);

      try {
        console.log('Attempting login for:', email);
        const result = await onSignIn(email.trim(), password);
        if (result.error) {
          console.error('Login error:', result.error);
          
          // Provide helpful error messages
          if (result.error.message?.includes('Invalid login credentials')) {
            setError('Fel e-post eller lösenord. Kontrollera dina uppgifter och försök igen.');
          } else if (result.error.message?.includes('Email not confirmed')) {
            setError('E-post inte bekräftad. Kontrollera din inkorg för bekräftelselänk.');
          } else {
            setError(result.error.message || 'Inloggning misslyckades');
          }
        } else {
          setSuccess('Inloggning lyckades!');
          console.log('Login successful for:', email);
        }
      } catch (err) {
        console.error('Login exception:', err);
        setError('Ett oväntat fel uppstod vid inloggning.');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle new user signup with payment
      await handleStripeCheckout();
    }
  };

  const handleChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) setError(''); // Clear errors when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Back Button */}
        <div className="text-left mb-4 sm:mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors min-h-[48px] text-sm sm:text-base bg-white/80 px-4 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Tillbaka till hemsidan</span>
          </button>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-2">
            KongMindset
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base px-2">
            Behärska Napoleon Hills Tänk och Bli Rik-principer
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20">
          <div className="flex rounded-lg bg-neutral-100 p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-3 sm:px-4 rounded-md text-sm font-medium transition-all min-h-[48px] active:scale-95 ${
                isLogin
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Logga in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-3 sm:px-4 rounded-md text-sm font-medium transition-all min-h-[48px] active:scale-95 ${
                !isLogin
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Skaffa tillgång
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                E-postadress
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleChange(setEmail)}
                  className="w-full pl-10 pr-4 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[52px] active:border-primary-400"
                  placeholder="Ange din e-postadress"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Lösenord {!isLogin && <span className="text-xs text-gray-500">(minst 6 tecken)</span>}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={handleChange(setPassword)}
                  className="w-full pl-10 pr-12 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[52px] active:border-primary-400"
                  placeholder={isLogin ? "Ange ditt lösenord" : "Skapa ett lösenord (6+ tecken)"}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  disabled={loading}
                  minLength={isLogin ? undefined : 6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 min-h-[52px] min-w-[52px] flex items-center justify-center active:scale-95 rounded-lg hover:bg-gray-100"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field - Only for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                  Bekräfta lösenord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange(setConfirmPassword)}
                    className="w-full pl-10 pr-12 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[52px] active:border-primary-400"
                    placeholder="Bekräfta ditt lösenord"
                    required
                    autoComplete="new-password"
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 min-h-[52px] min-w-[52px] flex items-center justify-center active:scale-95 rounded-lg hover:bg-gray-100"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 font-medium">Fel vid {isLogin ? 'inloggning' : 'registrering'}</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                  {error.includes('Invalid login credentials') && (
                    <div className="mt-2 text-xs text-red-500">
                      <p>💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Kontrollera att e-postadressen är korrekt</li>
                        <li>Kontrollera att lösenordet är rätt</li>
                        <li>Om du precis köpte kursen kan kontot ta några minuter att aktiveras</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600 font-medium">{success}</p>
              </div>
            )}

            {/* Login Help for Existing Customers */}
            {isLogin && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm">🔑 Inloggningshjälp</h3>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• Använd samma e-post och lösenord som du använde vid köpet</p>
                  <p>• Om du precis köpte kursen kan det ta 1-2 minuter för kontot att aktiveras</p>
                  <p>• Kontrollera att du inte har stavfel i e-posten</p>
                  <p>• Kontakta support@kongmindset.se om problemet kvarstår</p>
                </div>
              </div>
            )}

            {/* Payment Info for Purchase Access */}
            {!isLogin && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="font-semibold text-green-800 text-sm sm:text-base">✅ Säker betalning via Stripe</span>
                </div>
                <p className="text-xs sm:text-sm text-green-700 mb-2">
                  <strong>Komplett KongMindset-kurs: {coursePrice}</strong> (specialerbjudande)
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>🎯 Livstidsåtkomst till alla 13 moduler</li>
                  <li>🧠 Napoleon Hill AI-mentor (24/7)</li>
                  <li>✅ GRATIS originalbok "Tänk och Bli Rik"</li>
                  <li>💚 30 dagars pengarna-tillbaka-garanti</li>
                  <li>🔐 Ditt konto skapas automatiskt - logga in direkt efter köp!</li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[52px] text-base active:scale-95"
            >
              {loading ? (isLogin ? 'Loggar in...' : 'Förbereder säker betalning...') : (isLogin ? 'Logga in på ditt konto' : `🛒 Köp fullständig tillgång - ${coursePrice}`)}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-neutral-600 px-2">
            {isLogin ? "Redo att förvandla ditt liv? " : "Har du redan ett konto? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 font-medium underline min-h-[44px] px-2 active:scale-95"
              disabled={loading}
            >
              {isLogin ? 'Köp tillgång' : 'Logga in'}
            </button>
          </div>
        </div>

        {/* Course Preview */}
        <div className="text-center mt-6 sm:mt-8 px-4">
          <p className="text-neutral-600 text-xs sm:text-sm">
            {isLogin ? 'Logga in på ditt konto för att fortsätta din framgångsresa' : 'Efter betalning skapas ditt konto automatiskt med livstidsåtkomst'}
          </p>
          
          {/* Debug Info */}
          {error && error.includes('STRIPE') && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-xs">
                🛠️ <strong>Utvecklarinfo:</strong> Stripe funktioner behöver konfigureras i Supabase Dashboard
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;