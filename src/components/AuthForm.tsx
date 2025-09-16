import React, { useState } from 'react';
import { Brain, Mail, Lock, Eye, EyeOff, CreditCard, AlertCircle, ArrowLeft } from 'lucide-react';
import { stripeProducts, getProductByPriceId } from '../stripe-config';

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

    // Debug environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPreview: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'MISSING'
    });

    if (!supabaseUrl || !supabaseKey) {
      setError('Supabase configuration is missing. Please check your .env file.');
      setLoading(false);
      return;
    }

    try {
      // Validate form first
      if (!email || !password) {
        setError('Vänligen fyll i både e-post och lösenord.');
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setError('Lösenorden stämmer inte överens.');
        return;
      }

      if (!isLogin && password.length < 6) {
        setError('Lösenordet måste vara minst 6 tecken långt.');
        return;
      }

      // Create checkout session (account will be created after payment)
      const checkoutUrl = `${supabaseUrl}/functions/v1/stripe-checkout`;
      console.log('Calling checkout URL:', checkoutUrl);
      
      let response;
      try {
        response = await fetch(checkoutUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            email: email,
            password: password,
            priceId: mainCourse?.priceId || 'price_1S7zDfBu2e08097PaQ5APyYq',
            success_url: `${window.location.origin}?payment=success`,
            cancel_url: `${window.location.origin}?payment=cancelled`,
          }),
        });
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        setError(`🚨 STRIPE CHECKOUT FUNKTION INTE DEPLOYAD

Din stripe-checkout Edge Function är inte deployad till Supabase.

STEG FÖR ATT FIXA:

1. 📂 Öppna Supabase Dashboard:
   https://supabase.com/dashboard/project/acdwexqoonauzzjtoexx

2. 🔧 Gå till "Edge Functions" i vänstra menyn

3. ➕ Klicka "Create a new function"

4. 📝 Namnge funktionen: "stripe-checkout"

5. 💾 Kopiera koden från: supabase/functions/stripe-checkout/index.ts

6. 🔑 Gå till "Settings" → "Environment Variables" och lägg till:
   - STRIPE_SECRET_KEY (från Stripe Dashboard → Developers → API keys)
   - STRIPE_WEBHOOK_SECRET (skapa webhook i Stripe först)
   - SUPABASE_SERVICE_ROLE_KEY (från Supabase Settings → API)

7. 🚀 Spara och deploya funktionen

8. 🧪 Testa betalningen igen här

ALTERNATIVT: Om du har Supabase CLI installerat:
supabase functions deploy stripe-checkout --project-ref acdwexqoonauzzjtoexx

Fel: ${fetchError instanceof Error ? fetchError.message : 'Network error'}`);
        setSuccess('');
        setLoading(false);
        return;
      }

      console.log('Stripe checkout response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        console.error('Stripe checkout error:', response.status, responseText);
        
        let errorMessage = `Failed to create checkout session (${response.status})`;
        
        if (response.status === 404) {
          errorMessage = `🚨 STRIPE CHECKOUT FUNKTION INTE DEPLOYAD

Stegen för att fixa detta:

1. Gå till din Supabase Dashboard: https://supabase.com/dashboard
2. Välj projekt: acdwexqoonauzzjtoexx
3. Gå till "Edge Functions" i sidomenyn
4. Klicka "New Function" och välj "Upload from existing files"
5. Ladda upp filerna från: supabase/functions/stripe-checkout/
6. Gå till "Environment Variables" och lägg till:
   - STRIPE_SECRET_KEY: sk_test_... (från Stripe Dashboard)
   - STRIPE_WEBHOOK_SECRET: whsec_... (från Stripe Dashboard) 
   - SUPABASE_SERVICE_ROLE_KEY: (från Supabase Settings → API)
7. Spara och deploya funktionen
8. Kom tillbaka och testa betalningen igen

Alternativt: Om du har Supabase CLI installerat, kör:
supabase functions deploy stripe-checkout --project-ref acdwexqoonauzzjtoexx`;
        } else if (response.status === 500) {
          errorMessage = `🔑 STRIPE-NYCKLAR SAKNAS I SUPABASE

Edge Function:en är deployad men Stripe-nycklarna saknas:

1. Gå till Supabase Dashboard → Edge Functions → Environment Variables
2. Lägg till dessa variabler:
   - STRIPE_SECRET_KEY: Hämta från Stripe Dashboard → Developers → API keys
   - STRIPE_WEBHOOK_SECRET: Skapa i Stripe Dashboard → Developers → Webhooks
   - SUPABASE_SERVICE_ROLE_KEY: Från Supabase Settings → API → service_role key
3. Spara och testa igen

Kontrollera också att ditt Stripe-konto har produkten med price_id: ${mainCourse?.priceId}`;
        }
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response isn't JSON, keep our status-specific message
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

      console.log('Redirecting to Stripe checkout with credentials saved for:', email);
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Payment error:', err);
      let errorMessage = '';
      
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          errorMessage = `🌐 EDGE FUNCTION INTE TILLGÄNGLIG

Din stripe-checkout Edge Function är inte deployad till Supabase.

SNABB LÖSNING:
1. Öppna Supabase Dashboard: https://supabase.com/dashboard/project/acdwexqoonauzzjtoexx
2. Gå till "Edge Functions" → "New Function"
3. Skapa function med namn: "stripe-checkout"
4. Kopiera koden från: supabase/functions/stripe-checkout/index.ts
5. Lägg till miljövariabler (STRIPE_SECRET_KEY, etc.)
6. Testa betalningen igen

Alternativt om du har Supabase CLI:
supabase functions deploy stripe-checkout --project-ref acdwexqoonauzzjtoexx

Nuvarande Supabase URL: ${supabaseUrl}`;
        } else {
          errorMessage = err.message;
        }
      } else {
        errorMessage = 'Kunde inte ansluta till betalningssystemet. Försök igen.';
      }
      
      setError(errorMessage);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (isLogin) {
      // Handle existing user login
      setLoading(true);

      try {
        const result = await onSignIn(email, password);
        if (result.error) {
          setError(result.error.message);
        } else {
          setSuccess('Inloggning lyckades!');
        }
      } catch (err) {
        setError('Ett oväntat fel uppstod.');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle new user signup with payment (account created after payment)
      await handleStripeCheckout();
    }
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
              className={`flex-1 py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
                isLogin
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Logga in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
                  placeholder="Ange din e-postadress"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Lösenord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-12 py-3 sm:py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
                  placeholder={isLogin ? "Ange ditt lösenord" : "Skapa ett lösenord"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 min-h-[48px] min-w-[48px] flex items-center justify-center"
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-12 py-3 sm:py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
                    placeholder="Bekräfta ditt lösenord"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 min-h-[48px] min-w-[48px] flex items-center justify-center"
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
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
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
                  <li>🔐 Ditt konto skapas automatiskt efter betalning</li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
             className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px] text-base"
            >
              {loading ? 'Bearbetar...' : (isLogin ? 'Logga in' : `🛒 Köp kurs - ${coursePrice}`)}
            </button>
          </form>

          {/* Footer */}
         <div className="text-center mt-6 text-sm text-neutral-600 px-2">
            {isLogin ? "Redo att förvandla ditt liv? " : "Har du redan ett konto? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              {isLogin ? 'Köp tillgång' : 'Logga in'}
            </button>
          </div>
        </div>

        {/* Course Preview */}
       <div className="text-center mt-6 sm:mt-8 px-4">
         <p className="text-neutral-600 text-xs sm:text-sm">
            {isLogin ? 'Logga in på ditt konto för att fortsätta din framgångsresa' : 'Efter betalning får du automatiskt ett konto med livstidsåtkomst'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;