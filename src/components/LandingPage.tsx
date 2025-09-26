import React, { useState } from 'react';
import { Brain, BookOpen, Star, Trophy, Users, CheckCircle, Play, Download, Gift, Target, Clock, Shield, HelpCircle, ChevronDown, ChevronUp, ArrowRight, Zap, Award, Sparkles } from 'lucide-react';
import FAQSection from './FAQSection';
import Footer from './Footer';
import ContactPage from './ContactPage';
import PrivacyPolicy from './PrivacyPolicy';
import CookiePolicy from './CookiePolicy';
import TermsOfService from './TermsOfService';

interface LandingPageProps {
  onJoinClick: () => void;
}

export default function LandingPage({ onJoinClick }: LandingPageProps) {
  const coursePrice = "299 kr";
  const originalPrice = "1,400 kr";
  const [currentView, setCurrentView] = useState<'landing' | 'contact' | 'privacy' | 'cookies' | 'terms'>('landing');

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'home':
        setCurrentView('landing');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'modules':
        // Trigger authentication for protected content
        onJoinClick();
        break;
      case 'resources':
        // Trigger authentication for protected content
        onJoinClick();
        break;
      case 'contact':
        setCurrentView('contact');
        break;
      case 'privacy-policy':
        setCurrentView('privacy');
        break;
      case 'cookie-policy':
        setCurrentView('cookies');
        break;
      case 'terms-of-service':
        setCurrentView('terms');
        break;
      default:
        setCurrentView('landing');
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  // Render different views based on current selection
  if (currentView === 'contact') {
    return <ContactPage onBack={handleBackToLanding} onSignOut={() => Promise.resolve({ error: null })} />;
  }

  if (currentView === 'privacy') {
    return <PrivacyPolicy onBack={handleBackToLanding} />;
  }

  if (currentView === 'cookies') {
    return <CookiePolicy onBack={handleBackToLanding} />;
  }

  if (currentView === 'terms') {
    return <TermsOfService onBack={handleBackToLanding} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50">
      {/* Header with Login */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
                KongMindset
              </span>
            </div>
            
            {/* Login Button */}
            <button
              onClick={onJoinClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 min-h-[52px] text-base"
            >
              <span>🔑 Logga in</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-yellow-900/5"></div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-20 h-20" />
              <span className="text-4xl font-display font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                KongMindset
              </span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight">
              Bemästra Napoleon Hills<br />
              <span className="text-yellow-600">Rikedomsplan</span>
            </h1>
            
            <p className="text-2xl text-slate-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              Få <strong>originalboken GRATIS</strong> plus <strong>Napoleon Hill i din ficka</strong> - världens första AI-mentor baserad på "Tänk och Bli Rik"
            </p>
            
            {/* Special Offer Badge */}
            <button
              onClick={onJoinClick}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-full inline-block mb-8 shadow-2xl animate-pulse transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer min-h-[52px] text-lg"
            >
              <span className="font-bold text-lg">🔥 2025 KAMPANJ: 299 kr specialpris!</span>
            </button>
            
            {/* Login Button - Prominent */}
            {/* Savings Text */}
            <div className="text-center mb-8">
              <p className="text-sm text-slate-500 line-through">1,400 kr</p>
              <p className="text-green-600 font-bold">Du sparar 1,101 kr!</p>
            </div>
            
            {/* Guarantee & Campaign Info */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-600 mb-12">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>30 dagars pengarna tillbaka</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span>kampanjen gäller endast för de första 100 medlemmar</span>
              </div>
            </div>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span>Säker betalning via Stripe</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span>SSL-krypterad webbplats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 md:py-24 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Vad du får för {coursePrice}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Allt du behöver för att bemästra Napoleon Hills 13 framgångsprinciper och transformera ditt liv
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                INKLUDERAT
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-4 w-16 h-16 mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">13 Interaktiva Moduler</h3>
              <p className="text-slate-600 mb-4">Strukturerad genomgång av varje princip med moderna tillämpningar för 2025</p>
              <div className="text-sm text-blue-600 font-semibold">12 veckors transformationsprogram</div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative">
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                EXKLUSIVT
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-full p-4 w-16 h-16 mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Napoleon Hill AI-Mentor</h3>
              <p className="text-slate-600 mb-4">Din personliga framgångscoach 24/7 - världens första Napoleon Hill AI</p>
              <div className="text-sm text-purple-600 font-semibold">Personlig vägledning när som helst</div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative">
              <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                BONUS
              </div>
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-full p-4 w-16 h-16 mb-6 shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">GRATIS Originalbok</h3>
              <p className="text-slate-600 mb-4">Komplett PDF av "Tänk och Bli Rik" - din att behålla för alltid</p>
              <div className="text-sm text-green-600 font-semibold">Omedelbar nedladdning efter köp</div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-700 rounded-full p-4 w-16 h-16 mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Personlig Utvecklingsplan</h3>
              <p className="text-slate-600 mb-4">13 veckors strukturerat program med reflektioner och uppföljning</p>
              <div className="text-sm text-yellow-600 font-semibold">Inkluderat</div>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-full p-4 w-16 h-16 mb-6 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Kunskapsquiz & Certifiering</h3>
              <p className="text-slate-600 mb-4">Testa din förståelse och få certifiering när du slutför kursen</p>
              <div className="text-sm text-red-600 font-semibold">Inkluderat</div>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-full p-4 w-16 h-16 mb-6 shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Exklusiv Medlemsgåva</h3>
              <p className="text-slate-600 mb-4">Gratis gåva som alltid tidigare visats för världen - något du kommer att älska garanterat</p>
              <div className="text-sm text-teal-600 font-semibold">Endast för medlemmar: OVÄRDERLIGT</div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="text-center mt-16">
            <button
              onClick={onJoinClick}
              className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8 border-4 border-yellow-300 max-w-2xl mx-auto shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer w-full"
            >
              <h3 className="text-3xl font-bold text-yellow-800 mb-4">
                Totalt värde: 1,400+ kr
              </h3>
              <p className="text-2xl text-yellow-700 mb-4">
                Du betalar endast: <span className="text-4xl font-bold text-green-600">{coursePrice}</span>
              </p>
              <p className="text-yellow-600 font-semibold">
                Det är 79% rabatt på en livsförändrande investering! 🎯
              </p>
              <div className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full mx-auto inline-block font-bold text-lg shadow-lg">
                👆 Klicka nu
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Moved up 2 sections */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Din resa mot framgång börjar nu
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Gå med i de första 100 medlemmarna och få livstidsåtkomst för endast {coursePrice}
            </p>
            
            <div className="bg-red-500/20 backdrop-blur border border-red-300 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-6 h-6 text-red-300" />
                <span className="text-red-200 font-bold text-lg">BEGRÄNSAT ERBJUDANDE</span>
              </div>
              <p className="text-red-100">
                Efter de första 100 medlemmarna ökar priset till <span className="font-bold">{coursePrice}/månad</span>
              </p>
            </div>

            <button
              onClick={onJoinClick}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-4 px-8 rounded-full text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center space-x-3 mb-8 min-h-[56px]"
            >
              <Sparkles className="w-6 h-6" />
              <span>Säkra Din Plats Nu - {coursePrice}</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>30 dagars garanti</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Omedelbar tillgång</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-green-400" />
                <span>2025 års kampanj</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Så fungerar det
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Tre enkla steg till din transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl transform transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Köp & Få Omedelbar Tillgång</h3>
              <p className="text-slate-600 leading-relaxed">
                Betala {coursePrice} och få direkt tillgång till alla 13 moduler plus Napoleon Hills AI-mentor
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl transform transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Studera & Tillämpa i 13 Veckor</h3>
              <p className="text-slate-600 leading-relaxed">
                Följ det strukturerade 13-veckors programmet, en princip per vecka, med praktiska övningar och djup reflektion
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl transform transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Transformera Ditt Liv</h3>
              <p className="text-slate-600 leading-relaxed">
                Se konkreta resultat i ditt tankesätt, självförtroende och ekonomiska framgång
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-24 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Vad våra elever säger
            </h2>
            <p className="text-lg md:text-xl text-slate-600">
              Riktiga resultat från riktiga människor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6 italic">
                "Inom 4 veckor hade jag ett helt nytt tankesätt om pengar och framgång. Napoleon Hills AI-mentor är som att ha världens bästa coach i fickan!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-slate-800">Marcus Andersson</div>
                  <div className="text-slate-500 text-sm">Företagare, Stockholm</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">
                "Jag ökade min inkomst med 67% på 6 månader genom att tillämpa principerna. Detta är den bästa investeringen jag någonsin gjort!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-slate-800">Sara Lindqvist</div>
                  <div className="text-slate-500 text-sm">Säljchef, Göteborg</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">
                "Strukturen är perfekt! Jag hade läst boken 3 gånger tidigare men första gången jag verkligen förstod och tillämpade principerna."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-slate-800">Johan Eriksson</div>
                  <div className="text-slate-500 text-sm">Coach, Malmö</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection onJoinClick={onJoinClick} coursePrice={coursePrice} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}