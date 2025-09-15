import React from 'react';
import { CheckCircle, Download, Brain, BookOpen, ArrowRight, Mail, Gift, Star, Trophy } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { stripeProducts } from '../stripe-config';

interface SuccessPageProps {
  onContinue: () => void;
  user: SupabaseUser | null;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue, user }) => {
  const mainCourse = stripeProducts.find(p => p.name === 'Paid Main Course offer');
  const coursePrice = mainCourse ? `${mainCourse.price} ${mainCourse.currency}` : '299 SEK';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-6 w-24 h-24 mx-auto mb-8 shadow-2xl animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            🎉 Grattis! Betalning genomförd!
          </h1>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-200 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Tack för din investering på {coursePrice}!
              </h2>
              {user ? (
                <p className="text-lg text-green-700 leading-relaxed">
                  Du har nu gjort den viktigaste investeringen i ditt liv - en investering i dig själv och din framtid. 
                  Du är redan inloggad och redo att börja din transformationsresa!
                </p>
              ) : (
                <p className="text-lg text-green-700 leading-relaxed">
                  Du har nu gjort den viktigaste investeringen i ditt liv - en investering i dig själv och din framtid. 
                  Ditt konto har skapats automatiskt med den e-postadress och det lösenord du angav vid köpet.
                </p>
              )}
            </div>
            
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2" />
                Välkommen till KongMindset-familjen!
              </h3>
              <div className="text-blue-700 space-y-3">
                <p className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">✅</span>
                  <span><strong>Ditt konto är redo:</strong> {user ? 'Du är redan inloggad och kan börja direkt!' : 'Du kan nu logga in med din e-post och det lösenord du valde'}</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">✅</span>
                  <span><strong>Livstidsåtkomst aktiverad:</strong> Du har permanent tillgång till alla 13 moduler</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">✅</span>
                  <span><strong>Napoleon Hill AI är aktiv:</strong> Din personliga framgångsmentor väntar på dig</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Vad du får för dina {coursePrice}:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6 text-center hover:shadow-xl transition-shadow">
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-3">13 Interaktiva Moduler</h3>
              <p className="text-green-700">Fullständig genomgång av Napoleon Hills 13 framgångsprinciper med moderna tillämpningar</p>
              <div className="mt-4 text-sm text-green-600 font-semibold">Värde: 1 200 kr</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 text-center hover:shadow-xl transition-shadow">
              <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-800 mb-3">Napoleon Hill AI-mentor</h3>
              <p className="text-blue-700">Din personliga framgångscoach tillgänglig 24/7 - världens första Napoleon Hill AI</p>
              <div className="mt-4 text-sm text-blue-600 font-semibold">Värde: OVÄRDERLIG</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6 text-center hover:shadow-xl transition-shadow">
              <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-purple-800 mb-3">GRATIS Originalbok</h3>
              <p className="text-purple-700">Komplett PDF av "Tänk och Bli Rik" - din att behålla för alltid</p>
              <div className="mt-4 text-sm text-purple-600 font-semibold">Värde: 200 kr</div>
            </div>
          </div>
          
          <div className="text-center mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">
              Totalt värde: 1 400+ kr
            </h3>
            <p className="text-xl text-yellow-700">
              Du betalade endast: <span className="text-3xl font-bold text-green-600">{coursePrice}</span>
            </p>
            <p className="text-yellow-600 font-semibold mt-2">
              Det är 79% rabatt - din bästa investering någonsin! 🎯
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
              Vad du får för dina 299 kr:
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-blue-50 rounded-lg p-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-blue-800">{user ? 'Du är redan inloggad!' : 'Logga in på ditt konto'}</h3>
                  <p className="text-blue-700">{user ? 'Perfekt! Du kan börja med modulerna direkt.' : 'Använd din e-post och lösenord som du angav vid köpet'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-green-50 rounded-lg p-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-green-800">Börja med Modul 1: "Önskans kraft"</h3>
                  <p className="text-green-700">Din transformationsresa börjar med att utveckla brinnande önskan för dina mål</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-purple-50 rounded-lg p-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-purple-800">Ladda ner din gratis bok</h3>
                  <p className="text-purple-700">Gå till Resurser-sektionen och ladda ner originalboken "Tänk och Bli Rik"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-yellow-50 rounded-lg p-4">
                <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-bold text-yellow-800">Chatta med Napoleon Hill AI</h3>
                  <p className="text-yellow-700">Använd den blå AI-knappen längst ner för att få personlig vägledning när som helst</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Success Message */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white text-center">
            <Star className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-6">En personlig hälsning till dig</h2>
            <div className="text-lg leading-relaxed space-y-4 max-w-2xl mx-auto">
              <p>
                <strong>Kära framtida framgångsrika person,</strong>
              </p>
              <p>
                Du har just tagit det viktigaste steget på din resa mot rikedom och framgång. 
                I över 85 år har Napoleon Hills principer förändrat miljontals liv världen över.
              </p>
              <p>
                Nu är det din tur. Med din investering på endast {coursePrice} har du fått tillgång till kunskap 
                som vanligtvis kostar tusentals kronor hos personliga coaches.
              </p>
              <p>
                <strong>Kom ihåg:</strong> Framgång handlar inte om att bara läsa - det handlar om att TILLÄMPA. 
                Använd våra interaktiva övningar, prata med Napoleon Hill AI, och viktigast av allt: 
                <em>agera på det du lär dig</em>.
              </p>
              <p className="text-yellow-300 font-bold text-xl">
                "Thoughts are things" - Napoleon Hill
              </p>
              <p>
                Dina tankar blir till verklighet. Börja tänka stort redan idag!
              </p>
              <p>
                <strong>Med respekt och förväntningar på din framgång,</strong><br/>
                <em>KongMindset-teamet</em>
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center space-x-3"
          >
            <span>{user ? 'Starta din transformation nu' : 'Logga in och börja'}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
          
          {!user && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              <strong>Påminnelse:</strong> Logga in med e-posten och lösenordet du använde vid köpet
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
              <p className="text-green-700 font-semibold text-sm">
                💚 30 dagars pengarna-tillbaka-garanti<br/>
                📧 Support: support@kongmindset.se
              </p>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;