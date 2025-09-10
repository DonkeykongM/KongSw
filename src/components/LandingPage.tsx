import React from 'react';
import { Brain, CheckCircle, Users, Target, BarChart3, BookOpen, Smartphone, Clock, Shield, ArrowRight, Star, Trophy, Zap, Gift } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import SEOHead from './SEOHead';
import FAQSection from './FAQSection';

interface LandingPageProps {
  onJoinClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoinClick }) => {
  const mainCourse = stripeProducts.find(p => p.name === 'Paid Main Course offer');
  const priceAmount = mainCourse?.price || 299.00;
  const priceText = `${priceAmount} kr`;

  const seoTitle = "KongMindset: Napoleon Hill's Think and Grow Rich Course Online 2025 | 13 Interactive Modules + AI Mentor";
  const seoDescription = "Bemästra Napoleon Hills 13 Tänk och Bli Rik principer genom vår interaktiva onlinekurs. Få originalboken GRATIS + personlig AI mentor. Gå med i de första 100 medlemmarna för 299 kr/år (sedan 299 kr/månad). Förvandla ditt tankesätt idag.";
  const homeKeywords = "tänk och bli rik kurs, napoleon hill principer online, tankesätt transformation kurs, rikedom byggande principer, personlig utveckling 2025, framgångsprinciper träning, mental konditionering, entreprenörskap kurs, affärstankesätt, ekonomisk frihet kurs";
  
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "KongMindset", 
    "url": "https://kongmindset.com",
    "logo": "https://kongmindset.com/favicon.svg",
    "description": "Ledande online utbildningsplattform för Napoleon Hills Tänk och Bli Rik principer",
    "foundingDate": "2025",
    "sameAs": [
      "https://facebook.com/kongmindset",
      "https://twitter.com/kongmindset", 
      "https://linkedin.com/company/kongmindset"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "KongMindset Courses",
      "itemListElement": [
        {
          "@type": "Course",
          "name": "Napoleon Hill's Think and Grow Rich Complete Course",
          "description": "13 interactive modules teaching wealth creation principles",
          "offers": {
            "@type": "Offer",
            "price": "29.99",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      ]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint", 
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "support@kongmindset.com"
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={homeKeywords}
        canonicalUrl="https://kongmindset.com"
        ogTitle={seoTitle}
        ogDescription={seoDescription}
        ogImage="https://kongmindset.com/image.png"
        moduleSchema={homeSchema}
      />
      
      {/* Simple, Professional Background */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-2">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(71, 85, 105, 0.02) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      {/* Header Bar */}
      <header className="relative z-20 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
              <span className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
                KongMindset
              </span>
            </div>
            
            {/* Login Button */}
            <button
              onClick={onJoinClick}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[44px] text-sm sm:text-base"
            >
              Logga in / Registrera
            </button>
          </div>
        </div>
      </header>
      {/* Side Banners */}
      {/* Hero Section - Elegant & Professional */}
      <div className="relative z-10 bg-gradient-to-br from-slate-800 to-blue-900 text-white py-20 md:py-28 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Minimal Hero Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-slate-600/3 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Bemästra Napoleon Hills Rikedomsplan
            </h1>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-transparent bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-400 bg-clip-text">
              Tänk större. Väx snabbare. Lev rikare.
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-8 text-slate-200 leading-relaxed">
              Få Originalboken Plus Napoleon Hill I Din Ficka - För Alltid
            </h2>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-white mb-6">
              I två decennier studerade Napoleon Hill Amerikas största förmögenheter. Nu lever hans kompletta visdom i din smartphone.
            </p>
            <p className="text-lg sm:text-xl font-bold text-blue-300 leading-relaxed">
              Efter medlem #100 försvinner boken för alltid och Napoleon Hills AI-mentor låses bort. Priset blir 299 kr/månad.
            </p>
          </div>
          
          {/* Hero CTA */}
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6">
            <button
              onClick={onJoinClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 sm:py-5 sm:px-10 rounded-full text-lg sm:text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 inline-flex items-center space-x-3 min-h-[44px] w-full sm:w-auto justify-center"
            >
              <Trophy className="w-6 h-6" />
              <span>Säkra Din Tillgång - {priceText}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <p className="text-green-300 font-bold text-base sm:text-lg">💚 30 dagars pengarna-tillbaka-garanti</p>
              <p className="text-slate-300 text-sm">Riskfri investering i din framtid - full återbetalning om du inte är nöjd</p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition - Clean & Professional */}
      <section className="py-12 bg-gradient-to-r from-slate-50 to-blue-50 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white/90 rounded-3xl p-8 mb-16 border border-slate-200 shadow-xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-bold mb-4 text-slate-800">De första 100 medlemmarna får den ursprungliga "Tänk och Bli Rik"-boken plus permanent tillgång till Napoleon Hills AI-intelligens - din personliga rikedomsmentor, tillgänglig 24/7.</h3>
              <p className="text-xl text-slate-600 font-semibold">Exklusivitet skapar excellens - precis som de rika förstår</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl shadow-lg border-2 border-blue-200 p-8 mb-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                🎁 ENDAST FÖRSTA 100
              </div>
              <div className="text-center bg-white/70 rounded-xl p-6 backdrop-blur-sm">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                  Din Nya Bästa Vän:<br />
                  Napoleon Hill I Din Ficka
                </h3>
                <div className="bg-gradient-to-r from-slate-100 to-blue-100 rounded-lg p-6 mb-6 border-2 border-slate-300">
                  <div className="flex items-center justify-center mb-3">
                    <Smartphone className="w-8 h-8 text-slate-600 mr-3" />
                    <h4 className="text-xl font-bold text-slate-800">Mästarens Visdom, Alltid Med Dig</h4>
                  </div>
                  <p className="text-slate-700 font-semibold text-lg mb-4">
                    Napoleon Hills kompletta medvetenhet lever i din smartphone - redo att vägleda varje beslut
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Omedelbar Rikedomsrådgivning:</strong> Fråga vad som helst, när som helst</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Personliga Strategier:</strong> Anpassade till dina mål</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Aldrig Ensam:</strong> Din framgångsmentor sover aldrig</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Ursprungliga Hemligheter:</strong> Kunskap som aldrig publicerats</span>
                    </div>
                  </div>
                </div>
                <p className="text-blue-700 mb-6 text-lg font-semibold">
                  Plus: Ladda ner den kompletta ursprungliga "Tänk och Bli Rik"-boken - din att behålla för alltid!
                </p>
                <button
                  onClick={onJoinClick}
                  className="bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-3"
                >
                  <span>Gå Med I De Första 100 - {priceText}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-slate-600 text-sm mt-3 font-semibold">
                  ✅ Originalbok + AI Mentor • 📱 Omedelbar Tillgång För Alltid
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white/70 rounded-xl p-6 backdrop-blur-sm">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Beprövat system</h4>
                <p className="text-sm text-slate-600">Har skapat fler miljonärer än något annat framgångssystem i historien. Detta är inte teorier - det är rikedomsskapande formler.</p>
              </div>
              
              <div className="text-center bg-white/70 rounded-xl p-6 backdrop-blur-sm">
                <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Shield className="w-8 h-8 text-slate-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Noll risk</h4>
                <p className="text-sm text-slate-600">30 dagars pengarna-tillbaka-garanti. Om du inte ser resultat får du tillbaka varje krona. Din framgång är garanterad.</p>
              </div>
              
              <div className="text-center bg-white/70 rounded-xl p-6 backdrop-blur-sm">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Endast första 100</h4>
                <p className="text-sm text-slate-600">Efter 100 medlemmar försvinner Napoleon Hills AI-mentor för alltid. Denna exklusiva möjlighet kommer aldrig återkomma.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Breakdown - Clean Design */}
      <section className="py-12 bg-gradient-to-r from-slate-800 to-blue-900 border-y-4 border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
                🔥 Begränsad tid: 2025 kampanjspecial
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-blue-200 mb-4">
                Hela året 2025: Bara {priceText} totalt
              </p>
              <p className="text-xl text-red-300 font-bold mb-2">(Ordinarie pris: 299 kr/månad från 2026)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <BookOpen className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                <p className="text-lg font-bold text-blue-200">13 framgångsmoduler</p>
                <p className="text-3xl font-bold text-white">1 200 kr</p>
                <p className="text-slate-300 text-sm">Professionellt utbildningsvärde</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <Brain className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                <p className="text-lg font-bold text-blue-200">Napoleon Hills AI</p>
                <p className="text-3xl font-bold text-white">OVÄRDERLIG</p>
                <p className="text-slate-300 text-sm font-bold">🧠 Din personliga mentor</p>
                <p className="text-blue-200 text-xs mt-1">Alltid i din ficka</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <Gift className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                <p className="text-lg font-bold text-blue-200">Originalbok GRATIS</p>
                <p className="text-3xl font-bold text-white">200 kr</p>
                <p className="text-slate-300 text-sm">Tänk och Bli Rik PDF</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl p-6 text-center border-4 border-blue-300 shadow-2xl transform scale-105">
                <Target className="w-12 h-12 text-white mx-auto mb-3" />
                <p className="text-lg font-bold text-white">Specialpris</p>
                <p className="text-4xl font-bold text-white">{priceText}</p>
                <p className="text-blue-100 text-sm font-semibold">Engångskostnad</p>
                <p className="text-blue-100 text-xs font-bold">Livstidsåtkomst</p>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                Totalt värde: <span className="text-blue-300">1 400+ kr</span> → Du betalar: <span className="text-green-300">{priceText} för livstidsåtkomst</span>
              </p>
              <p className="text-xl font-bold text-blue-200">
                Det är <span className="text-3xl text-green-300">99% rabatt för begränsad tid!</span>
              </p>
              
              <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-lg p-4 mt-6 border-2 border-red-400">
                <p className="text-red-200 font-bold text-lg mb-2">⏰ DEADLINE APPROACHING</p>
                <p className="text-red-100">Detta specialerbjudande är begränsat i tid - säkra din plats nu!</p>
              </div>
            </div>
            
            <button
              onClick={onJoinClick}
              className="bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 text-white font-bold py-6 px-16 rounded-full text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center space-x-3"
            >
              <Zap className="w-6 h-6" />
              <span>Säkra 2025-priset - {priceText}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <div className="mt-6 text-center">
              <div className="bg-white/10 rounded-lg p-4 inline-block">
                <p className="text-yellow-300 font-bold">🔥 Begränsat erbjudande</p>
                <p className="text-white text-sm">Säkra din plats idag</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Development Timeline */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Din 13-veckors transformationsresa
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Följ Napoleon Hills beprövade väg till framgång. Varje av de 13 veckorna bygger på den föregående och skapar ostoppbar momentum mot dina mål.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-6 max-w-2xl mx-auto border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-3">Veckovis personlig tillväxt</h3>
              <p className="text-blue-700">Från tankesättsförändringar till praktiska färdigheter - se din 13-veckors transformation utvecklas systematiskt</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Week 1-3: Foundation */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 relative">
                <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Vecka 1-3: Grund
                </div>
                <div className="mt-4 space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h4 className="font-bold text-blue-800 text-lg mb-2">Vecka 1: Önsketändning</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Brinnande önskans kraft</li>
                      <li>• <strong>Utveckla:</strong> Kristallklar måldefinition</li>
                      <li>• <strong>Förändra:</strong> Från önsketänkande till bestämd målsättning</li>
                      <li>• <strong>Resultat:</strong> Skrivet bestämt huvudmål</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h4 className="font-bold text-blue-800 text-lg mb-2">Vecka 2: Trouppbyggning</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Hur man utvecklar orubblig tro</li>
                      <li>• <strong>Utveckla:</strong> Självförtroendetekniker</li>
                      <li>• <strong>Förändra:</strong> Från tvivel till absolut säkerhet</li>
                      <li>• <strong>Resultat:</strong> Personlig trodeklaration</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h4 className="font-bold text-blue-800 text-lg mb-2">Vecka 3: Autosuggestion behärskning</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Programmering av undermedvetandet</li>
                      <li>• <strong>Utveckla:</strong> Daglig bekräftelsepraktik</li>
                      <li>• <strong>Förändra:</strong> Från negativ till positiv självdialog</li>
                      <li>• <strong>Resultat:</strong> Personlig bekräftelserutin</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Week 4-8: Development */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 relative">
                <div className="absolute -top-3 left-6 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Vecka 4-8: Färdighetsutveckling
                </div>
                <div className="mt-4 space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h4 className="font-bold text-green-800 text-lg mb-2">Vecka 4-5: Kunskap & Fantasi</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Specialiserad kunskapsinhämtning</li>
                      <li>• <strong>Utveckla:</strong> Kreativa tänkandförmågor</li>
                      <li>• <strong>Förändra:</strong> Från allmän till specialiserad expertis</li>
                      <li>• <strong>Resultat:</strong> Personlig lärplan</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h4 className="font-bold text-green-800 text-lg mb-2">Vecka 6-7: Planering & Uthållighet</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Strategiska planeringsmetoder</li>
                      <li>• <strong>Utveckla:</strong> Orubblig uthållighet</li>
                      <li>• <strong>Förändra:</strong> Från spridda ansträngningar till fokuserad handling</li>
                      <li>• <strong>Resultat:</strong> Detaljerad handlingsplan</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h4 className="font-bold text-green-800 text-lg mb-2">Vecka 8: Beslutsfattande</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Snabba beslutsfattande färdigheter</li>
                      <li>• <strong>Utveckla:</strong> Ledarskapsegenskaper</li>
                      <li>• <strong>Förändra:</strong> Från prokrastination till beslutsamhet</li>
                      <li>• <strong>Resultat:</strong> Beslutsfattande ramverk</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Week 9-12: Mastery */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 relative">
                <div className="absolute -top-3 left-6 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Vecka 9-12: Mästerskap
                </div>
                <div className="mt-4 space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h4 className="font-bold text-purple-800 text-lg mb-2">Vecka 9-10: Sinnesbehärskning</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Kontroll över undermedvetandet</li>
                      <li>• <strong>Utveckla:</strong> Mental disciplintekniker</li>
                      <li>• <strong>Förändra:</strong> Från reaktivt till proaktivt tankesätt</li>
                      <li>• <strong>Resultat:</strong> Komplett mental ritning</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h4 className="font-bold text-purple-800 text-lg mb-2">Vecka 11: Hjärnkraft & Energi</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Hjärnoptimering strategier</li>
                      <li>• <strong>Utveckla:</strong> Energiomvandlingsfärdigheter</li>
                      <li>• <strong>Förändra:</strong> Från utmattad till energifylld tillstånd</li>
                      <li>• <strong>Resultat:</strong> Topprestanda rutin</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h4 className="font-bold text-purple-800 text-lg mb-2">Vecka 12: Sjätte sinnet & Rikedom</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• <strong>Lär dig:</strong> Intuitionsutveckling</li>
                      <li>• <strong>Utveckla:</strong> Rikedomsmedvetenhet</li>
                      <li>• <strong>Förändra:</strong> Från bristtankesätt till överflödstankesätt</li>
                      <li>• <strong>Resultat:</strong> Komplett transformation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Transformation Promise */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-gold-50 to-yellow-50 rounded-xl p-8 border-2 border-yellow-300 max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold text-yellow-800 mb-4">Din garanterade transformation</h3>
                <p className="text-lg text-yellow-700 mb-6">
                Efter medlem #100 försvinner boken för alltid och Napoleon Hills AI-mentor låses bort. Priset blir 299 kr/månad.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">🧠 Tankesättstransformation</h4>
                    <p className="text-sm text-yellow-700">Från begränsande övertygelser till ostoppbart självförtroende</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">⚡ Färdighetsutveckling</h4>
                    <p className="text-sm text-yellow-700">Bemästra de 13 principerna för rikedomsskapande</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">🎯 Praktiska resultat</h4>
                    <p className="text-sm text-yellow-700">Tydlig handlingsplan med mätbara utfall</p>
                  </div>
                </div>
                
                <button
                  onClick={onJoinClick}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-3"
                >
                  <Trophy className="w-6 h-6" />
                  <span>Säkra Din Tillgång - {priceText}</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
                
                <p className="text-yellow-600 text-sm mt-4 font-semibold">
                  💎 Special: Komplett 13-veckors program för bara {priceText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO & AI Optimized */}
      <FAQSection onJoinClick={onJoinClick} />

      
    </div>
  );
};

export default LandingPage;