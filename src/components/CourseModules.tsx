import React, { useEffect } from 'react';
import { Clock, Trophy, Star, ArrowRight, CheckCircle, Target, Users, BookOpen, Brain, MessageCircle, Minimize2 } from 'lucide-react';
import ModuleCard from './ModuleCard';
import { courseContent } from '../data/courseContent';
import SEOHead from './SEOHead';
import { getCompletedWeeksCount, getModuleProgress } from '../utils/progressStorage';

interface CourseModulesProps {
  onModuleStart: (moduleId: number) => void;
}

const CourseModules: React.FC<CourseModulesProps> = ({ onModuleStart }) => {
  const completedWeeks = getCompletedWeeksCount();
  const allModulesCompleted = completedWeeks === 13;
  const [isChatbotExpanded, setIsChatbotExpanded] = React.useState(false);

  useEffect(() => {
    // Load Napoleon Hill AI Brain for course pages
    if (!window.VG_SCRIPT_LOADED) {
      // Create the container if it doesn't exist
      if (!document.getElementById('VG_OVERLAY_CONTAINER')) {
        const container = document.createElement('div');
        container.id = 'VG_OVERLAY_CONTAINER';
        container.style.width = '0px';
        container.style.height = '0px';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9998';
        container.style.transition = 'all 0.3s ease';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);
      }

      window.VG_CONFIG = {
        ID: "6yGc4NPDxDr1xbtes97V",
        region: 'na',
        render: 'full-width',
        stylesheets: [
          "https://vg-bunny-cdn.b-cdn.net/vg_live_build/styles.css"
        ]
      };
      
      const VG_SCRIPT = document.createElement("script");
      VG_SCRIPT.src = "https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js";
      VG_SCRIPT.defer = true;
      document.body.appendChild(VG_SCRIPT);
      window.VG_SCRIPT_LOADED = true;
    }
  }, []);

  const toggleChatbot = () => {
    const container = document.getElementById('VG_OVERLAY_CONTAINER');
    if (container) {
      if (!isChatbotExpanded) {
        container.style.width = '500px';
        container.style.height = '500px';
        setIsChatbotExpanded(true);
        
        // Add click listener to header for minimizing
        setTimeout(() => {
          const headerElements = container.querySelectorAll('.vg-header, .vg-title, .vg-header-container, #vg-header-container');
          headerElements.forEach(header => {
            header.addEventListener('click', () => {
              container.style.width = '0px';
              container.style.height = '0px';
              setIsChatbotExpanded(false);
            });
            header.style.cursor = 'pointer';
            header.title = 'Klicka för att minimera chatten';
          });
        }, 1000);
      } else {
        container.style.width = '0px';
        container.style.height = '0px';
        setIsChatbotExpanded(false);
      }
    }
  };
  
  const seoTitle = "13 Interactive Modules - Napoleon Hill's Think and Grow Rich Course | KongMindset";
  const seoDescription = "Bemästra alla 13 principer från Napoleon Hills Tänk och Bli Rik genom interaktiva lektioner, reflektionsövningar och kunskapsquiz. Komplett transformationskurs med AI-mentor.";
  const courseKeywords = "napoleon hill kurs, tänk och bli rik moduler, framgångsprinciper träning, rikedomstankesätt kurs, personlig utveckling 2025, interaktivt lärande, onlinekurs";
  
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Napoleon Hill's Think and Grow Rich: Complete 13-Module Course",
    "description": seoDescription,
    "provider": {
      "@type": "Organization",
      "name": "KongMindset",
      "url": "https://kongmindset.com"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "duration": "P12W"
    },
    "offers": {
      "@type": "Offer",
      "price": "29.99",
      "priceCurrency": "USD"
    },
    "teaches": [
      "The Power of Desire",
      "Faith and Belief", 
      "Autosuggestion",
      "Specialized Knowledge",
      "Creative Imagination",
      "Organized Planning",
      "Persistence",
      "Decision Making",
      "Subconscious Mind Control",
      "Brain Power Optimization",
      "Energy Transmutation", 
      "Sixth Sense Development",
      "Philosophy of Wealth"
    ]
  };
  return (
    <>
    <section id="modules" className="py-16 md:py-24 bg-white/50 backdrop-blur-sm">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={courseKeywords}
        canonicalUrl="https://kongmindset.com/modules"
        ogTitle={seoTitle}
        ogDescription={seoDescription}
        ogImage="https://kongmindset.com/image.png"
        moduleSchema={courseSchema}
      />
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto font-light mb-6">
            Transformera ditt liv genom 13 veckors systematisk träning baserad på Napoleon Hills tidlösa visdom från "Tänk och Bli Rik." Varje vecka fokuserar på en princip som ska integreras djupt i ditt dagliga liv.
          </p>
        </div>
        
        {/* Completion Module - Show when all 13 modules are completed */}
        {allModulesCompleted && (
          <div className="mb-16 max-w-6xl mx-auto completion-details">
            <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-3xl shadow-2xl border-4 border-yellow-300 p-8 md:p-12 relative overflow-hidden">
              {/* Celebration Header */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-2xl">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text mb-4">
                  🎉 GRATTIS!
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Du har slutfört alla 13 moduler i KongMindset-kursen!
                </p>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Det är en betydande prestation och visar på ditt engagemang för personlig utveckling och framgång.
                </p>
              </div>

              {/* Achievement Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/80 rounded-xl p-6 text-center shadow-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">13/13</div>
                  <p className="text-green-700 font-semibold">Moduler slutförda</p>
                </div>
                <div className="bg-white/80 rounded-xl p-6 text-center shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                  <p className="text-blue-700 font-semibold">Transformation uppnådd</p>
                </div>
                <div className="bg-white/80 rounded-xl p-6 text-center shadow-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
                  <p className="text-purple-700 font-semibold">Livslång kunskap</p>
                </div>
              </div>

              {/* Key Message */}
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 mb-8 border-2 border-orange-300">
                <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
                  <Star className="w-6 h-6 mr-2" />
                  Men detta är bara början!
                </h3>
                <p className="text-orange-700 text-lg leading-relaxed">
                  Att slutföra modulerna är dock bara början. Napoleon Hills filosofi är inte en engångsföreteelse, utan en livslång praktik. 
                  Här är de nästa stegen du bör överväga för att fortsätta din transformationsresa:
                </p>
              </div>

              {/* Next Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Kontinuerlig tillämpning</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Återbesök principerna:</strong> Gå igenom modulerna igen, särskilt de som du fann mest utmanande.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Daglig praktik:</strong> Integrera principerna i din vardag med autosuggestion och visualisering.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Fördjupa förståelsen</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Läs originalboken igen:</strong> Du kommer att upptäcka nya insikter och nyanser.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Studera andra filosofier:</strong> Utforska andra verk som kompletterar Hills läror.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Använd din AI-mentor</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Personlig vägledning 24/7:</strong> Använd Napoleon Hill AI för specifika situationer och utmaningar.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Din rådgivare:</strong> Se AI-mentorn som din personlige framgångscoach.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 rounded-full p-3 mr-4">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Master Mind & Mentorship</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Bygg Master Mind-grupp:</strong> Sök likasinnade för stöd och nya perspektiv.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Bli mentor:</strong> Lär ut principerna till andra för att fördjupa din kunskap.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Final Encouragement */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-2xl">
                <h3 className="text-3xl font-bold mb-4">Din resa mot framgång är en pågående process</h3>
                <p className="text-xl mb-6 opacity-90">
                  Fortsätt att lära, tillämpa och växa! Använd ditt sjätte sinne och lita på din inre vägledning.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>Sätt nya mål</span>
                  </button>
                  <button className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Återbesök moduler</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Completion Module Card - Only show when all modules are completed */}
        {allModulesCompleted && (
          <div className="w-full max-w-6xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 rounded-2xl shadow-2xl border-4 border-yellow-400 p-6 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              {/* Premium Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                🎓 KURSEN SLUTFÖRD
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mt-4">
                {/* Icon Section */}
                <div className="text-center lg:text-left">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full p-8 w-32 h-32 mx-auto lg:mx-0 mb-4 shadow-2xl flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text">
                    GRATTIS!
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="lg:col-span-2">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    🎉 Du har slutfört hela KongMindset-resan!
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    Alla 13 veckor av Napoleon Hills framgångsprinciper är nu en del av dig. 
                    Men detta är bara början på din livslånga praktik av dessa kraftfulla lärdomar.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/70 rounded-lg p-3 text-center shadow-md">
                      <div className="text-2xl font-bold text-green-600">13/13</div>
                      <p className="text-sm text-green-700">Veckor slutförda</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center shadow-md">
                      <div className="text-2xl font-bold text-blue-600">100%</div>
                      <p className="text-sm text-blue-700">Transformation</p>
                    </div>
                  </div>
                  
                  <button
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-3"
                    onClick={() => {
                      // Scroll to the detailed completion section
                      document.querySelector('.completion-details')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                  >
                    <Star className="w-6 h-6" />
                    <span>Se dina nästa steg</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
          {courseContent.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              onModuleStart={onModuleStart}
              isLocked={module.id > 1 && completedWeeks < module.id - 1}
              isCompleted={completedWeeks >= module.id}
              progress={getModuleProgress(module.id)}
            />
          ))}
        </div>

        {/* Mobile-Specific Help Section */}
        <div className="mt-12 sm:hidden">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-3">📱 Mobilhjälp</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Tryck på modulkorten för att starta lektioner</p>
              <p>• Swipa åt sidor för att navigera i lektioner</p>
              <p>• Använd AI-mentorn (blå knapp nederst) för hjälp</p>
              <p>• Rotera din telefon för bättre videovisning</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Chatbot Toggle Button */}
    <div className="fixed bottom-4 right-4 z-[10000]">
      <button
        onClick={toggleChatbot}
        className={`bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 flex items-center space-x-2 ring-4 ring-blue-300/50 backdrop-blur-sm ${
          isChatbotExpanded ? 'py-3 px-6 text-base bg-red-600 hover:bg-red-700' : 'p-5 w-16 h-16'
        }`}
        title={isChatbotExpanded ? 'Minimera Napoleon Hill AI' : 'Fråga Napoleon Hill AI - Din personliga framgångsmentor'}
      >
        {isChatbotExpanded ? (
          <>
            <Minimize2 className="w-6 h-6" />
            <span className="font-semibold">✕ Stäng</span>
          </>
        ) : (
          <div className="relative">
            <Brain className="w-8 h-8 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-bounce">
              <MessageCircle className="w-3 h-3 text-white ml-0.5 mt-0.5" />
            </div>
          </div>
        )}
      </button>
      
      {!isChatbotExpanded && (
        <div className="absolute -top-12 right-0 bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-2 rounded-lg shadow-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <div className="text-sm font-bold">🧠 Napoleon Hill AI</div>
          <div className="text-xs opacity-90">Din personliga framgångsmentor</div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-900"></div>
        </div>
      )}
    </div>
    </>
  );
};

export default CourseModules;