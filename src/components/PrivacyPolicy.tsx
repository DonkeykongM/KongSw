import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Mail, Phone, MapPin } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">Integritetspolicy</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Integritetspolicy för KongMindset</h1>
              <p className="text-gray-600">Senast uppdaterad: 17 januari 2025</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-6 h-6 text-blue-600 mr-2" />
                  1. Inledning och Omfattning
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Denna integritetspolicy beskriver hur KongMindset ("vi", "oss", "vår") samlar in, använder, 
                  lagrar och skyddar dina personuppgifter när du använder vår webbplats (kongmindset.se) och 
                  våra tjänster relaterade till Napoleon Hills "Tänk och Bli Rik"-kurs.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Vi är engagerade i att skydda din integritet och följer alla tillämpliga lagar och förordningar, 
                  inklusive EU:s allmänna dataskyddsförordning (GDPR).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Database className="w-6 h-6 text-green-600 mr-2" />
                  2. Personuppgifter Vi Samlar In
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-bold text-blue-800 mb-2">Konto och Registrering</h3>
                    <ul className="space-y-1 text-blue-700">
                      <li>• E-postadress (krävs för inloggning och kommunikation)</li>
                      <li>• Lösenord (krypterat och säkert lagrat)</li>
                      <li>• Användarnamn/visningsnamn</li>
                      <li>• Profilinformation (valfritt)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <h3 className="font-bold text-green-800 mb-2">Kursaktivitet och Framsteg</h3>
                    <ul className="space-y-1 text-green-700">
                      <li>• Modulframsteg och slutförda lektioner</li>
                      <li>• Quiz-resultat och reflektionsanteckningar</li>
                      <li>• Tidsstämplar för aktivitet</li>
                      <li>• Interaktioner med Napoleon Hill AI-mentor</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <h3 className="font-bold text-purple-800 mb-2">Betalning och Transaktioner</h3>
                    <ul className="space-y-1 text-purple-700">
                      <li>• Betalningshistorik via Stripe (vi lagrar INTE kreditkortsuppgifter)</li>
                      <li>• Faktureringsadress (om tillhandahållen)</li>
                      <li>• Transaktions-ID:n för kvitto och support</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                    <h3 className="font-bold text-yellow-800 mb-2">Teknisk Information</h3>
                    <ul className="space-y-1 text-yellow-700">
                      <li>• IP-adress och geografisk plats (ungefärlig)</li>
                      <li>• Webbläsartyp och enhetsinformation</li>
                      <li>• Cookies och användningsdata</li>
                      <li>• Prestandadata för att förbättra tjänsten</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hur Vi Använder Dina Uppgifter</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-2">Primära Ändamål</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Tillhandahålla kursinnehåll och AI-mentor</li>
                      <li>• Hantera ditt konto och inloggning</li>
                      <li>• Spåra ditt lärframsteg</li>
                      <li>• Bearbeta betalningar säkert</li>
                      <li>• Tillhandahålla kundstöd</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-2">Sekundära Ändamål</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Förbättra och utveckla våra tjänster</li>
                      <li>• Säkerhet och bedrägeriförebyggande</li>
                      <li>• Analysera användarengagemang</li>
                      <li>• Skicka viktiga meddelanden (med ditt samtycke)</li>
                      <li>• Efterleva juridiska krav</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Laglig Grund för Behandling</h2>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800"><strong>Avtalsuppfyllelse:</strong> Vi behandlar dina uppgifter för att tillhandahålla den kurs du har köpt</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-green-800"><strong>Berättigade intressen:</strong> För säkerhet, förbättringar och analys av tjänsten</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-purple-800"><strong>Samtycke:</strong> För marknadsföring och icke-nödvändiga cookies (med ditt uttryckliga samtycke)</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-yellow-800"><strong>Juridisk skyldighet:</strong> För att uppfylla skattemässiga och redovisningsmässiga krav</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Delning av Uppgifter</h2>
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-4">
                  <h3 className="font-bold text-red-800 mb-2">🔒 Vi Säljer ALDRIG Dina Uppgifter</h3>
                  <p className="text-red-700">KongMindset säljer, hyr ut eller på annat sätt kommersiellt delar aldrig dina personuppgifter med tredje parter.</p>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-3">Vi delar endast uppgifter med:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Tekniska Tjänsteleverantörer</p>
                      <p className="text-gray-600 text-sm">Supabase (databas), Stripe (betalning), Netlify (hosting) - alla med starka integritetsåtaganden</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Juridiska Krav</p>
                      <p className="text-gray-600 text-sm">Om det krävs enligt lag, domstolsbeslut eller myndighetsförfrågan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Säkerhetsskäl</p>
                      <p className="text-gray-600 text-sm">För att skydda våra rättigheter, din säkerhet eller andras säkerhet</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Dina Rättigheter enligt GDPR</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="font-bold text-blue-800 mb-2">Åtkomst och Portabilitet</h3>
                    <ul className="space-y-1 text-blue-700 text-sm">
                      <li>• Rätt att få en kopia av dina uppgifter</li>
                      <li>• Rätt att överföra uppgifter till annan tjänst</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <h3 className="font-bold text-green-800 mb-2">Rättelse och Radering</h3>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• Rätt att korrigera felaktig information</li>
                      <li>• Rätt att få uppgifter raderade ("rätt att bli glömd")</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <h3 className="font-bold text-purple-800 mb-2">Begränsning och Invändning</h3>
                    <ul className="space-y-1 text-purple-700 text-sm">
                      <li>• Rätt att begränsa behandling</li>
                      <li>• Rätt att göra invändning mot behandling</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                    <h3 className="font-bold text-yellow-800 mb-2">Samtycke och Klagomål</h3>
                    <ul className="space-y-1 text-yellow-700 text-sm">
                      <li>• Rätt att återkalla samtycke</li>
                      <li>• Rätt att klaga till Datainspektionen</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Datasäkerhet och Lagring</h2>
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                  <h3 className="font-bold text-green-800 mb-4">🔐 Säkerhetsåtgärder</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-green-700">
                      <li>• SSL/TLS-kryptering för all datatransmission</li>
                      <li>• Krypterade lösenord (bcrypt)</li>
                      <li>• Säkra datacenter (EU-baserade)</li>
                      <li>• Regelbundna säkerhetsupdateringar</li>
                    </ul>
                    <ul className="space-y-2 text-green-700">
                      <li>• Begränsad åtkomst enligt "need-to-know"-principen</li>
                      <li>• Automatiska säkerhetskopior</li>
                      <li>• Övervakning och loggning av systemåtkomst</li>
                      <li>• GDPR-kompatibla tjänsteleverantörer</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">📅 Lagringstider</h3>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• <strong>Kontouppgifter:</strong> Så länge ditt konto är aktivt + 2 år efter senaste aktivitet</li>
                    <li>• <strong>Kursframsteg:</strong> Permanent (för livstidsåtkomst till kursen)</li>
                    <li>• <strong>Betalningsuppgifter:</strong> 7 år (enligt svensk bokföringslag)</li>
                    <li>• <strong>Tekniska loggar:</strong> Max 12 månader</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Internationella Överföringar</h2>
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-yellow-800">
                    Dina uppgifter lagras primärt inom EU/EES. När uppgifter överförs utanför EU (t.ex. till USA för vissa tjänster) 
                    säkerställer vi adequat skyddsnivå genom:
                  </p>
                  <ul className="mt-2 space-y-1 text-yellow-700">
                    <li>• EU-US Data Privacy Framework</li>
                    <li>• Standardiserade avtalsklausuler</li>
                    <li>• Adequacy decisions av EU-kommissionen</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-6 h-6 text-blue-600 mr-2" />
                  9. Kontakta Oss
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    För frågor om denna integritetspolicy eller för att utöva dina rättigheter, kontakta oss:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3">Personuppgiftsansvarig</h3>
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          support@kongmindset.se
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          +46 8 123 456 78
                        </p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          KongMindset AB<br />
                          <span className="ml-6">Framgångsgatan 123</span><br />
                          <span className="ml-6">123 45 Stockholm</span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3">Svarstider</h3>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• <strong>Allmänna frågor:</strong> Inom 48 timmar</li>
                        <li>• <strong>GDPR-förfrågningar:</strong> Inom 30 dagar</li>
                        <li>• <strong>Brådskande säkerhetsfrågor:</strong> Inom 24 timmar</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Ändringar i Policyn</h2>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-blue-800">
                    Vi kan uppdatera denna integritetspolicy från tid till annan för att reflektera ändringar i vår verksamhet, 
                    lagstiftning eller bästa praxis. Väsentliga ändringar kommer att meddelas via e-post eller framstående 
                    meddelande på vår webbplats minst 30 dagar före ikraftträdande.
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

export default PrivacyPolicy;