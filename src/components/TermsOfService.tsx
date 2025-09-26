import React from 'react';
import { ArrowLeft, FileText, Scale, CreditCard, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">Användarvillkor</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Användarvillkor för KongMindset</h1>
              <p className="text-gray-600">Senast uppdaterad: 17 januari 2025</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Scale className="w-6 h-6 text-blue-600 mr-2" />
                  1. Allmänna villkor och godkännande
                </h2>
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                  <p className="text-blue-800 leading-relaxed">
                    Välkommen till KongMindset! Dessa användarvillkor ("Villkor") reglerar din användning av 
                    vår webbplats kongmindset.se och våra tjänster relaterade till Napoleon Hills "Tänk och Bli Rik"-kurs.
                  </p>
                  <p className="text-blue-800 leading-relaxed mt-3">
                    Genom att registrera ett konto, göra ett köp eller på annat sätt använda våra tjänster 
                    godkänner du att vara bunden av dessa villkor. Om du inte godkänner villkoren, 
                    vänligen använd inte våra tjänster.
                  </p>
                </div>
                
                <div className="mt-4 bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <h3 className="font-bold text-yellow-800 mb-2">📋 Viktig information</h3>
                  <ul className="space-y-1 text-yellow-700 text-sm">
                    <li>• Du måste vara minst 18 år gammal för att använda våra tjänster</li>
                    <li>• Dessa villkor gäller tillsammans med vår Integritetspolicy</li>
                    <li>• Villkoren kan uppdateras från tid till annan</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Beskrivning av tjänster</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <h3 className="font-bold text-green-800 mb-2">🎓 KongMindset-kursen</h3>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• 13 interaktiva moduler baserade på "Tänk och Bli Rik"</li>
                      <li>• Strukturerad genomgång av Napoleon Hills principer</li>
                      <li>• Reflektionsövningar och kunskapsquiz</li>
                      <li>• Progressspårning och certifiering</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <h3 className="font-bold text-purple-800 mb-2">🤖 Napoleon Hill AI-mentor</h3>
                    <ul className="space-y-1 text-purple-700 text-sm">
                      <li>• Personlig AI-coach tillgänglig 24/7</li>
                      <li>• Svar på frågor om framgångsprinciper</li>
                      <li>• Skräddarsydda råd baserat på dina mål</li>
                      <li>• Interaktiv vägledning genom kursen</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-bold text-blue-800 mb-2">📚 Digitala resurser</h3>
                    <ul className="space-y-1 text-blue-700 text-sm">
                      <li>• Gratis nedladdning av originalboken</li>
                      <li>• Referensguider och sammanfattningar</li>
                      <li>• Dagbok för framgångsprinciper</li>
                      <li>• Kompletterande läsmaterial</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <h3 className="font-bold text-orange-800 mb-2">🎯 Livstidsåtkomst</h3>
                    <ul className="space-y-1 text-orange-700 text-sm">
                      <li>• Permanent tillgång till allt kursinnehåll</li>
                      <li>• Uppdateringar och förbättringar inkluderade</li>
                      <li>• Kundstöd via e-post och chat</li>
                      <li>• Tillgång från alla enheter</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 text-green-600 mr-2" />
                  3. Priser och betalningsvillkor
                </h2>
                
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200 mb-4">
                  <h3 className="font-bold text-green-800 mb-3">💰 Aktuella priser (2025)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-bold text-green-800">Grundarspecial (Första 100 medlemmarna)</h4>
                      <p className="text-2xl font-bold text-green-600">299 kr</p>
                      <p className="text-green-700 text-sm">Engångsbetalning - Livstidsåtkomst</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 opacity-60">
                      <h4 className="font-bold text-gray-600">Ordinarie pris (Efter kampanj)</h4>
                      <p className="text-2xl font-bold text-gray-500">299 kr/månad</p>
                      <p className="text-gray-500 text-sm">Månadsprenumeration</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-bold text-blue-800 mb-2">Betalningsmetoder</h3>
                    <p className="text-blue-700 text-sm">
                      Vi accepterar alla större kreditkort (Visa, Mastercard, American Express) via vår säkra 
                      betalningspartner Stripe. Alla betalningar är SSL-krypterade och PCI DSS-kompatibla.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                    <h3 className="font-bold text-yellow-800 mb-2">Prisändringar</h3>
                    <p className="text-yellow-700 text-sm">
                      Vi förbehåller oss rätten att ändra priser med 30 dagars förvarning. Befintliga kunder 
                      påverkas inte av prisökningar för redan köpta tjänster med livstidsåtkomst.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <h3 className="font-bold text-red-800 mb-2">Skatter och avgifter</h3>
                    <p className="text-red-700 text-sm">
                      Alla priser inkluderar svensk moms (25%). Inga dolda avgifter tillkommer. 
                      Internationella kunder kan bli föremål för lokala skatter.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-green-600 mr-2" />
                  4. Pengarna-tillbaka-garanti
                </h2>
                
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
                  <h3 className="font-bold text-green-800 mb-4 text-xl">🛡️ 30-dagars full pengarna-tillbaka-garanti</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-green-800 mb-2">✅ Vad som täcks</h4>
                      <ul className="space-y-1 text-green-700 text-sm">
                        <li>• Full återbetalning inom 30 dagar</li>
                        <li>• Inga frågor ställda</li>
                        <li>• Även om du slutfört delar av kursen</li>
                        <li>• Snabb hantering (5-7 arbetsdagar)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-green-800 mb-2">📋 Så begär du återbetalning</h4>
                      <ol className="space-y-1 text-green-700 text-sm">
                        <li>1. Skicka e-post till support@kongmindset.se</li>
                        <li>2. Ange ditt kontos e-postadress</li>
                        <li>3. Vi behandlar din förfrågan inom 24 timmar</li>
                        <li>4. Återbetalning sker via samma betalmetod</li>
                      </ol>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-green-100 rounded p-3">
                    <p className="text-green-800 text-sm">
                      <strong>Anledning krävs inte:</strong> Vi tror på vårt innehåll och vill att alla ska vara 100% nöjda. 
                      Om kursen inte uppfyller dina förväntningar får du pengarna tillbaka, så enkelt är det.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Användarrättigheter och skyldigheter</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Dina rättigheter
                    </h3>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li>• Livstidsåtkomst till allt kursinnehåll</li>
                      <li>• Ladda ner och spara digitala resurser för personligt bruk</li>
                      <li>• Använda Napoleon Hill AI-mentor utan begränsningar</li>
                      <li>• Få kundstöd och teknisk hjälp</li>
                      <li>• Ta del av framtida uppdateringar och förbättringar</li>
                      <li>• Radera ditt konto och personuppgifter när som helst</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <h3 className="font-bold text-orange-800 mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Dina skyldigheter
                    </h3>
                    <ul className="space-y-2 text-orange-700 text-sm">
                      <li>• Använd tjänsten endast för personligt, icke-kommersiellt bruk</li>
                      <li>• Dela inte dina inloggningsuppgifter med andra</li>
                      <li>• Respektera upphovsrätt och inte distribuera kursinnehåll</li>
                      <li>• Inte försöka kringgå säkerhetsåtgärder</li>
                      <li>• Behandla andra användare och AI-mentor med respekt</li>
                      <li>• Rapportera tekniska problem och säkerhetsbrister</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Upphovsrätt och immateriella rättigheter</h2>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <h3 className="font-bold text-purple-800 mb-2">📚 Napoleon Hills verk</h3>
                    <p className="text-purple-700 text-sm">
                      "Think and Grow Rich" av Napoleon Hill är i public domain. Vår kurs bygger på dessa 
                      klassiska texter men inkluderar egen pedagogisk bearbetning, moderna tillämpningar 
                      och interaktiva element som är skyddade av upphovsrätt.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-bold text-blue-800 mb-2">🎯 KongMindsets innehåll</h3>
                    <p className="text-blue-700 text-sm">
                      Allt kursinnehåll, inklusive videor, quiz, övningar, AI-mentor och pedagogiska material 
                      är skyddat av upphovsrätt och tillhör KongMindset AB. Du får en icke-exklusiv licens 
                      för personligt bruk.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <h3 className="font-bold text-red-800 mb-2">🚫 Förbjuden användning</h3>
                    <ul className="space-y-1 text-red-700 text-sm">
                      <li>• Kopiera eller distribuera kursinnehåll till andra</li>
                      <li>• Skapa egna kurser baserade på vårt material</li>
                      <li>• Använda vårt innehåll i kommersiella syften</li>
                      <li>• Reverse engineering av AI-mentor eller plattform</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Ansvarsbegränsning och garantier</h2>
                
                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                  <h3 className="font-bold text-yellow-800 mb-4">⚠️ Viktiga förbehåll</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-2">Utbildning, inte investeringsrådgivning</h4>
                      <p className="text-yellow-700 text-sm">
                        KongMindset tillhandahåller utbildning om framgångsprinciper. Vi ger inte finansiell 
                        rådgivning, investeringserådgivning eller garanterar ekonomiska resultat. Alla 
                        investeringar och affärsbeslut är ditt eget ansvar.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-2">Individuella resultat varierar</h4>
                      <p className="text-yellow-700 text-sm">
                        Framgång beror på många faktorer utöver utbildning, inklusive ansträngning, 
                        marknadsförhållanden och individuella omständigheter. Vi kan inte garantera 
                        specifika resultat eller ekonomisk framgång.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-2">Teknisk tillgänglighet</h4>
                      <p className="text-yellow-700 text-sm">
                        Vi strävar efter 99,9% drifttid men kan inte garantera oavbruten tillgång till 
                        tjänsten på grund av underhåll, tekniska problem eller force majeure.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Kontouppsägning och åtkomst</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <h3 className="font-bold text-green-800 mb-2">Din rätt att säga upp</h3>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• Du kan radera ditt konto när som helst</li>
                      <li>• Ingen uppsägningstid krävs</li>
                      <li>• Personuppgifter raderas enligt GDPR</li>
                      <li>• Kursframsteg kan exporteras före radering</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <h3 className="font-bold text-red-800 mb-2">Vår rätt att säga upp</h3>
                    <p className="text-red-700 text-sm mb-2">Vi kan säga upp ditt konto vid:</p>
                    <ul className="space-y-1 text-red-700 text-sm">
                      <li>• Brott mot dessa användarvillkor</li>
                      <li>• Missbruk av tjänsten eller AI-mentor</li>
                      <li>• Otillåten delning av innehåll</li>
                      <li>• Bedräglig aktivitet</li>
                    </ul>
                    <p className="text-red-700 text-sm mt-2">
                      <strong>Obs:</strong> Vid uppsägning från vår sida har du rätt till proportionell återbetalning.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Tillämplig lag och tvistlösning</h2>
                
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-800 mb-4">🏛️ Juridisk information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-blue-800">Tillämplig lag</h4>
                      <p className="text-blue-700 text-sm">
                        Dessa villkor och din användning av KongMindset regleras av svensk rätt. 
                        EU:s konsumentskyddsregler tillämpas för konsumenter inom EU/EES.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-blue-800">Tvistlösning</h4>
                      <p className="text-blue-700 text-sm">
                        Vi föredrar att lösa eventuella tvister genom direkt kommunikation. 
                        Kontakta oss först på support@kongmindset.se. Om ingen lösning kan nås 
                        ska tvister avgöras av svensk domstol med Stockholm som värnplats.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-blue-800">Konsumenters rättigheter</h4>
                      <p className="text-blue-700 text-sm">
                        Konsumenter inom EU har rätt att vända sig till <a href="https://www.arn.se" className="underline" target="_blank" rel="noopener noreferrer">Allmänna reklamationsnämnden (ARN)</a> 
                        eller EU:s <a href="https://ec.europa.eu/consumers/odr/" className="underline" target="_blank" rel="noopener noreferrer">ODR-plattform</a> för tvistlösning.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Kontaktinformation</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4">📞 Så når du oss</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">KongMindset AB</h4>
                      <div className="space-y-1 text-gray-600 text-sm">
                        <p>Org.nr: 559123-4567</p>
                        <p>Framgångsgatan 123</p>
                        <p>123 45 Stockholm, Sverige</p>
                        <p>E-post: support@kongmindset.se</p>
                        <p>Telefon: +46 8 123 456 78</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Supporttider</h4>
                      <div className="space-y-1 text-gray-600 text-sm">
                        <p><strong>Måndag-Fredag:</strong> 09:00-18:00 CET</p>
                        <p><strong>Lördag:</strong> 10:00-16:00 CET</p>
                        <p><strong>Söndag:</strong> Stängt</p>
                        <p><strong>E-post:</strong> Besvaras inom 24 timmar</p>
                        <p><strong>Brådskande ärenden:</strong> Märk e-post "URGENT"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Ändringar i användarvillkoren</h2>
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-yellow-800 mb-3">
                    Vi förbehåller oss rätten att uppdatera dessa användarvillkor när som helst. 
                    Väsentliga ändringar kommer att meddelas via:
                  </p>
                  <ul className="space-y-1 text-yellow-700 text-sm">
                    <li>• E-post till ditt registrerade konto minst 30 dagar i förväg</li>
                    <li>• Meddelande på webbplatsen när du loggar in</li>
                    <li>• Uppdaterat datum längst upp i detta dokument</li>
                  </ul>
                  <p className="text-yellow-800 mt-3 text-sm">
                    <strong>Din fortsatta användning av tjänsten efter ändringar utgör godkännande av de nya villkoren.</strong>
                  </p>
                </div>
              </section>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300 text-center">
                <h3 className="font-bold text-green-800 text-xl mb-4">
                  🎯 Tack för att du valt KongMindset!
                </h3>
                <p className="text-green-700">
                  Vi är engagerade i att ge dig den bästa möjliga upplevelsen i din framgångsresa. 
                  Dessa villkor är utformade för att skydda både dig och oss, samtidigt som vi 
                  upprätthåller en miljö för lärande och personlig utveckling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;