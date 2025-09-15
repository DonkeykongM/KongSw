import React from 'react';
import { ArrowLeft, Cookie, Settings, Eye, BarChart, Shield } from 'lucide-react';

interface CookiePolicyProps {
  onBack: () => void;
}

const CookiePolicy: React.FC<CookiePolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Tillbaka</span>
            </button>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">Cookie-policy</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Cookie className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie-policy för KongMindset</h1>
              <p className="text-gray-600">Senast uppdaterad: 17 januari 2025</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vad är cookies?</h2>
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                  <p className="text-blue-800 leading-relaxed">
                    Cookies är små textfiler som lagras på din enhet (dator, surfplatta eller mobiltelefon) när du besöker 
                    en webbplats. De hjälper webbplatsen att komma ihåg information om ditt besök, som dina inställningar 
                    och aktiviteter, vilket kan göra nästa besök lättare och webbplatsen mer användbar för dig.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Hur KongMindset använder cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Vi använder cookies för att förbättra din upplevelse på vår webbplats, analysera trafik, 
                  personalisera innehåll och säkerställa att våra tjänster fungerar korrekt.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center mb-3">
                      <Shield className="w-6 h-6 text-green-600 mr-2" />
                      <h3 className="font-bold text-green-800">Nödvändiga Cookies</h3>
                    </div>
                    <p className="text-green-700 text-sm mb-3">
                      Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av.
                    </p>
                    <ul className="space-y-1 text-green-600 text-sm">
                      <li>• Inloggningsstatus och sessionshantering</li>
                      <li>• Säkerhetscookies för autentisering</li>
                      <li>• Grundläggande webbplatsfunktionalitet</li>
                      <li>• Språk- och regioninställningar</li>
                    </ul>
                    <div className="mt-3 bg-green-100 rounded p-2">
                      <p className="text-green-800 text-xs font-semibold">
                        ⚖️ Laglig grund: Berättigat intresse / Avtalsuppfyllelse
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center mb-3">
                      <Settings className="w-6 h-6 text-blue-600 mr-2" />
                      <h3 className="font-bold text-blue-800">Funktionalitetscookies</h3>
                    </div>
                    <p className="text-blue-700 text-sm mb-3">
                      Dessa cookies gör det möjligt för webbplatsen att tillhandahålla förbättrad funktionalitet.
                    </p>
                    <ul className="space-y-1 text-blue-600 text-sm">
                      <li>• Kursframsteg och bokmärken</li>
                      <li>• Användarpreferenser och inställningar</li>
                      <li>• Anpassat innehåll baserat på aktivitet</li>
                      <li>• Napoleon Hill AI-interaktionshistorik</li>
                    </ul>
                    <div className="mt-3 bg-blue-100 rounded p-2">
                      <p className="text-blue-800 text-xs font-semibold">
                        ✅ Laglig grund: Samtycke (kan avböjas)
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center mb-3">
                      <BarChart className="w-6 h-6 text-purple-600 mr-2" />
                      <h3 className="font-bold text-purple-800">Analyscookies</h3>
                    </div>
                    <p className="text-purple-700 text-sm mb-3">
                      Dessa cookies hjälper oss förstå hur besökare interagerar med webbplatsen.
                    </p>
                    <ul className="space-y-1 text-purple-600 text-sm">
                      <li>• Google Analytics för webbplatsanalys</li>
                      <li>• Användningsstatistik och prestanda</li>
                      <li>• Felrapportering och optimering</li>
                      <li>• Besökardemografi (anonymiserad)</li>
                    </ul>
                    <div className="mt-3 bg-purple-100 rounded p-2">
                      <p className="text-purple-800 text-xs font-semibold">
                        ✅ Laglig grund: Samtycke (kan avböjas)
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center mb-3">
                      <Eye className="w-6 h-6 text-yellow-600 mr-2" />
                      <h3 className="font-bold text-yellow-800">Marknadsföringscookies</h3>
                    </div>
                    <p className="text-yellow-700 text-sm mb-3">
                      Dessa cookies används för att spåra besökare över webbplatser för marknadsföring.
                    </p>
                    <ul className="space-y-1 text-yellow-600 text-sm">
                      <li>• Spårning av konverteringar</li>
                      <li>• Retargeting och remarketing</li>
                      <li>• Personaliserad annonsering</li>
                      <li>• Social media-integration</li>
                    </ul>
                    <div className="mt-3 bg-yellow-100 rounded p-2">
                      <p className="text-yellow-800 text-xs font-semibold">
                        ✅ Laglig grund: Samtycke (kan avböjas)
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Detaljerad cookie-lista</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Cookie-namn</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Typ</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Syfte</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Varaktighet</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-mono">sb-auth-token</td>
                        <td className="border border-gray-300 px-4 py-2">Nödvändig</td>
                        <td className="border border-gray-300 px-4 py-2">Autentisering via Supabase</td>
                        <td className="border border-gray-300 px-4 py-2">1 år</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-mono">language</td>
                        <td className="border border-gray-300 px-4 py-2">Funktionalitet</td>
                        <td className="border border-gray-300 px-4 py-2">Sparar språkinställning</td>
                        <td className="border border-gray-300 px-4 py-2">Permanent</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-mono">think-and-grow-rich-notes</td>
                        <td className="border border-gray-300 px-4 py-2">Funktionalitet</td>
                        <td className="border border-gray-300 px-4 py-2">Sparar kursanteckningar lokalt</td>
                        <td className="border border-gray-300 px-4 py-2">Permanent</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-mono">kongmindset-module-progress</td>
                        <td className="border border-gray-300 px-4 py-2">Funktionalitet</td>
                        <td className="border border-gray-300 px-4 py-2">Spårar kursframsteg</td>
                        <td className="border border-gray-300 px-4 py-2">Permanent</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-mono">_ga</td>
                        <td className="border border-gray-300 px-4 py-2">Analys</td>
                        <td className="border border-gray-300 px-4 py-2">Google Analytics användaridentifiering</td>
                        <td className="border border-gray-300 px-4 py-2">2 år</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-mono">_ga_H63BXTL1PE</td>
                        <td className="border border-gray-300 px-4 py-2">Analys</td>
                        <td className="border border-gray-300 px-4 py-2">Google Analytics sessionsdata</td>
                        <td className="border border-gray-300 px-4 py-2">2 år</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Hantera dina cookie-inställningar</h2>
                
                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mb-6">
                  <h3 className="font-bold text-blue-800 mb-3">🎛️ Cookie-inställningar på KongMindset</h3>
                  <p className="text-blue-700 mb-4">
                    Du kan när som helst ändra dina cookie-inställningar genom att klicka på "Cookie-inställningar" 
                    längst ner på vår webbplats. Du kan välja att acceptera eller avvisa olika kategorier av cookies.
                  </p>
                  <div className="bg-blue-100 rounded p-3">
                    <p className="text-blue-800 text-sm">
                      <strong>Observera:</strong> Om du avvisar nödvändiga cookies kan vissa delar av webbplatsen 
                      inte fungera korrekt.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-3">Webbläsarinställningar</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Du kan också hantera cookies direkt i din webbläsare:
                    </p>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• <strong>Chrome:</strong> Inställningar → Integritet och säkerhet → Cookies</li>
                      <li>• <strong>Firefox:</strong> Inställningar → Integritet & säkerhet</li>
                      <li>• <strong>Safari:</strong> Inställningar → Integritet</li>
                      <li>• <strong>Edge:</strong> Inställningar → Cookies och webbplatsdata</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-3">Opt-out länkar</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Direkta länkar för att avregistrera dig från spårningstjänster:
                    </p>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                      <li>• <a href="https://www.youronlinechoices.com/se/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Youronlinechoices.com</a></li>
                      <li>• <a href="https://www.networkadvertising.org/choices/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NAI Consumer Opt-Out</a></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tredjepartscookies och integrationer</h2>
                
                <div className="space-y-4">
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <h3 className="font-bold text-red-800 mb-2">Google Analytics</h3>
                    <p className="text-red-700 text-sm">
                      Vi använder Google Analytics för att analysera trafik och användarbeteende. Google kan använda 
                      dessa data för sina egna ändamål. Läs mer i <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">Googles integritetspolicy</a>.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <h3 className="font-bold text-green-800 mb-2">Stripe (Betalningar)</h3>
                    <p className="text-green-700 text-sm">
                      För betalningsbehandling använder vi Stripe, som kan sätta egna cookies för säkerhet och 
                      bedrägeriförebyggande. Läs mer i <a href="https://stripe.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">Stripes integritetspolicy</a>.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-bold text-blue-800 mb-2">Supabase (Databas)</h3>
                    <p className="text-blue-700 text-sm">
                      Vår databas och autentiseringstjänster tillhandahålls av Supabase. De kan sätta cookies för 
                      sessionshantering. Läs mer i <a href="https://supabase.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">Supabase integritetspolicy</a>.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakta oss</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    Om du har frågor om vår användning av cookies eller vill utöva dina rättigheter, kontakta oss:
                  </p>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>E-post:</strong> support@kongmindset.se</p>
                    <p><strong>Telefon:</strong> +46 8 123 456 78</p>
                    <p><strong>Adress:</strong> KongMindset AB, Framgångsgatan 123, 123 45 Stockholm</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ändringar i cookie-policyn</h2>
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-yellow-800">
                    Vi kan uppdatera denna cookie-policy från tid till annan för att reflektera ändringar i vår 
                    användning av cookies eller för att följa lagkrav. Väsentliga ändringar kommer att meddelas 
                    på vår webbplats och genom uppdatering av datumet ovan.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;