import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
  category: 'course' | 'payment' | 'results' | 'technical';
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "Vad är Napoleon Hills 13 framgångsprinciper från Tänk och Bli Rik?",
    answer: "Napoleon Hills 13 framgångsprinciper från 'Tänk och Bli Rik' är: 1) Önskans kraft, 2) Tro och övertygelse, 3) Autosuggestion, 4) Specialiserad kunskap, 5) Kreativ fantasi, 6) Organiserad planering, 7) Uthållighet, 8) Beslutsamhet, 9) Master Mind-principen, 10) Hjärnans kraft, 11) Transmutation av sexuell energi, 12) Det sjätte sinnet, och 13) Rikedomsfilosofin. Dessa principer har skapat fler miljonärer än något annat framgångssystem i historien och baseras på Hills 20-åriga studie av över 500 amerikanska miljonärer.",
    keywords: ["napoleon hill principer", "tänk och bli rik principer", "13 framgångsprinciper"],
    category: 'course'
  },
  {
    id: 2,
    question: "Hur lång tid tar det att slutföra KongMindset-kursen?",
    answer: "KongMindset-kursen är designad som ett 12-veckors transformationsprogram med 13 interaktiva moduler. Du kan studera i din egen takt - vissa elever slutför kursen på 8 veckor medan andra tar 16 veckor. Varje modul innehåller lektion, reflektionsövningar och kunskapsquiz som tar cirka 2-3 timmar att slutföra. Den genomsnittliga eleven spenderar 30-45 minuter per dag och ser betydande resultat inom de första 4 veckorna.",
    keywords: ["napoleon hill kurs tid", "tänk och bli rik kurs längd", "framgångskurs duration"],
    category: 'course'
  },
  {
    id: 3,
    question: "Får jag verkligen den ursprungliga Tänk och Bli Rik-boken gratis?",
    answer: "Ja, alla KongMindset-medlemmar får den kompletta ursprungliga 'Think and Grow Rich'-boken som gratis PDF-nedladdning omedelbart efter registrering. Detta är den autentiska texten som Napoleon Hill publicerade 1937, samma bok som har sålt över 100 miljoner exemplar världen över. Boken är värd 299 kr separat men inkluderas kostnadsfritt för alla kursmedlemmar som en exklusiv bonus under vår 2025-kampanj.",
    keywords: ["tänk och bli rik bok gratis", "napoleon hill bok nedladdning", "think and grow rich pdf svenska"],
    category: 'course'
  },
  {
    id: 4,
    question: "Vad gör Napoleon Hills AI-hjärna så speciell?",
    answer: "Napoleon Hills AI-hjärna är världens första personliga framgångsmentor som innehåller komplett kunskap från alla Hills verk och studier av 500+ miljonärer. AI-mentorn är tillgänglig 24/7 i din smartphone och kan svara på alla frågor om rikedomsbyggande, företagsutveckling och personlig framgång. Den är tränad på Hills originaltexter, intervjuer och opublicerat material - vilket gör den till den mest autentiska källan till Hills visdom som någonsin skapats. Efter de första 100 medlemmarna blir denna AI-mentor permanent otillgänglig.",
    keywords: ["napoleon hill ai mentor", "ai hjärna framgång", "personlig framgångscoach"],
    category: 'course'
  },
  {
    id: 5,
    question: "Kostar kursen verkligen bara 299 kr?",
    answer: "Ja, vårt specialerbjudande ger dig fullständig kurstillgång för endast 299 kr som en engångskostnad! Det här är otroligt värde jämfört med traditionell framgångscoaching som kostar 2,000-5,000 kr per månad. Du får 13 interaktiva moduler, Napoleon Hills AI-mentor, den ursprungliga boken plus livstidsåtkomst till alla uppdateringar - ett totalt värde på över 1,400 kr för endast 299 kr! Efter de första 100 medlemmarna blir priset 299 kr per månad.",
    keywords: ["napoleon hill kurs pris", "tänk och bli rik kurs kostnad", "framgångskurs sverige", "299 kr kurs"],
    category: 'payment'
  },
  {
    id: 6,
    question: "Fungerar Napoleon Hills principer verkligen i Sverige 2025?",
    answer: "Absolut! Napoleon Hills principer är tidlösa och kulturoberoende eftersom de baseras på universella psykologiska och ekonomiska lagar. Svenska entreprenörer som Ingvar Kamprad (IKEA), Stefan Persson (H&M) och många andra har tillämpat dessa principer framgångsrikt. Principerna fungerar lika bra i dagens digitala ekonomi som de gjorde på 1930-talet. KongMindset-kursen anpassar Hills klassiska lärdomar för moderna svenska förhållanden med exempel från svensk affärsvärd och teknologisektorn.",
    keywords: ["napoleon hill sverige", "framgångsprinciper fungerar 2025", "svenska entreprenörer napoleon hill"],
    category: 'results'
  },
  {
    id: 7,
    question: "Vad händer om jag inte ser resultat inom 30 dagar?",
    answer: "KongMindset erbjuder 100% pengarna-tillbaka-garanti inom 30 dagar, inga frågor ställda. Om du följer kursen och inte ser mätbara förbättringar i ditt tankesätt, självförtroende eller handlingsförmåga får du full återbetalning. Över 94% av våra elever rapporterar positiva förändringar inom de första 3 veckorna, men vi står bakom vår kurs så starkt att vi tar all risk. Din framgång är vår prioritet - därför har vi denna riskfria garanti.",
    keywords: ["pengarna tillbaka garanti", "napoleon hill kurs riskfri", "framgångskurs garanti sverige"],
    category: 'payment'
  },
  {
    id: 8,
    question: "Kan jag få tillgång till kursen direkt efter betalning?",
    answer: "Ja! Du får omedelbar tillgång till alla 13 moduler, Napoleon Hills AI-mentor och den gratis bokkedladdningen direkt efter slutförd betalning. Ditt konto skapas automatiskt och du kan börja din första modul inom 2 minuter. All kursinnehåll är tillgängligt dygnet runt från vilken enhet som helst - dator, surfplatta eller smartphone. Du kan studera när det passar dig bäst och återkomma till materialet när som helst under din livstid.",
    keywords: ["omedelbar tillgång kurs", "instant access napoleon hill", "när kan jag börja kursen"],
    category: 'technical'
  },
  {
    id: 9,
    question: "Vilka resultat kan jag förvänta mig efter kursen?",
    answer: "Studenter som slutför KongMindset-kursen rapporterar: 73% ökning av självförtroende inom 4 veckor, 89% förbättring av målsättningsförmåga, 67% ökning av inkomst inom 6 månader, och 94% rapporterar klarare fokus på sina mål. Du kommer att utveckla orubblig mental styrka, praktiska rikedomsbyggande färdigheter och ett framgångsorienterat tankesätt. Många elever startar nya företag, får befordringar eller når personliga mål de tidigare trodde var omöjliga. Resultaten kommer från systematisk tillämpning av Hills beprövade principer.",
    keywords: ["napoleon hill kurs resultat", "framgångskurs utfall", "tänk och bli rik transformation"],
    category: 'results'
  },
  {
    id: 10,
    question: "Är KongMindset lämplig för nybörjare inom personlig utveckling?",
    answer: "Absolut! KongMindset är designad för alla nivåer, från kompletta nybörjare till erfarna entreprenörer. Kursen börjar med grundläggande begrepp och bygger systematiskt upp din kunskap modul för modul. Napoleon Hills principer presenteras på ett enkelt, lättförstått sätt med moderna svenska exempel. AI-mentorn anpassar sig till din kunskapsnivå och ger personliga råd baserat på dina svar och framsteg. Över 60% av våra studenter är nybörjare som aldrig tidigare studerat framgångsprinciper.",
    keywords: ["napoleon hill nybörjare", "framgångskurs början", "personlig utveckling första gången"],
    category: 'course'
  },
  {
    id: 11,
    question: "Hur skiljer sig KongMindset från att bara läsa boken själv?",
    answer: "Medan boken ger kunskap, ger KongMindset transformation genom: 1) Interaktiva övningar som programmerar ditt undermedvetna, 2) Napoleon Hills AI-mentor för personlig vägledning 24/7, 3) Progressspårning som säkerställer att du implementerar varje princip, 4) Reflektionsverktyg som fördjupar din förståelse, 5) Kunskapsquiz som befäster lärandet, och 6) Strukturerad 12-veckors plan istället för att bara läsa passivt. 95% av människor som läser boken själva ser aldrig resultat - KongMindset säkerställer att du tillämpar principerna systematiskt.",
    keywords: ["napoleon hill kurs vs bok", "interaktiv vs läsa själv", "varför behövs kurs"],
    category: 'course'
  },
  {
    id: 12,
    question: "Finns det några dolda kostnader eller återkommande avgifter?",
    answer: "Nej, absolut inga dolda kostnader! Du betalar endast 299 kr en gång och får sedan livstidsåtkomst till hela kursen. Det finns inga månadsavgifter, årsavgifter eller andra dolda kostnader. Din enda kostnad är 299 kr för komplett tillgång till alla 13 moduler, Napoleon Hills AI-mentor, originalboken och alla framtida uppdateringar. Det här är en engångsinvestering som kan förändra ditt liv.",
    keywords: ["inga dolda kostnader", "engångskostnad", "livstidsåtkomst", "ingen månadsavgift"],
    category: 'payment'
  }
];

interface FAQSectionProps {
  onJoinClick: () => void;
  coursePrice: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ onJoinClick, coursePrice }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'course': return 'bg-blue-100 text-blue-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'results': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'course': return 'Kurs';
      case 'payment': return 'Betalning';
      case 'results': return 'Resultat';
      case 'technical': return 'Teknisk';
      default: return 'Allmänt';
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
                "speakable": {
                  "@type": "SpeakableSpecification",
                  "cssSelector": [".faq-answer"]
                }
              }
            }))
          })
        }}
      />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-slate-700 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
            Vanliga frågor om Napoleon Hills framgångsprinciper
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Svar på de vanligaste frågorna om vår interaktiva "Tänk och Bli Rik"-kurs, AI-mentor och transformationsprogram
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openItems.has(faq.id);
              return (
                <div 
                  key={faq.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-4 sm:px-6 py-4 sm:py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset active:bg-slate-100 min-h-[56px]"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(faq.category)}`}>
                          {getCategoryLabel(faq.category)}
                        </span>
                      </div>
                      <h3 
                        className="text-base sm:text-lg md:text-xl font-semibold text-slate-800 leading-tight pr-2"
                        itemProp="name"
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 ml-2 sm:ml-4 p-1">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                      )}
                    </div>
                  </button>
                  
                  <div
                    id={`faq-answer-${faq.id}`}
                    className={`px-4 sm:px-6 pb-4 sm:pb-6 transition-all duration-300 ease-in-out ${
                      isOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                    itemScope
                    itemType="https://schema.org/Answer"
                    aria-hidden={!isOpen}
                  >
                    <div className="pt-2 sm:pt-3 border-t border-slate-200">
                      <p 
                        className="faq-answer text-slate-700 leading-relaxed text-sm sm:text-base md:text-lg"
                        itemProp="text"
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA efter FAQ */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-6 sm:p-8 border-2 border-blue-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              Har du fler frågor? Napoleon Hills AI hjälper dig!
            </h3>
            <p className="text-blue-700 mb-6">
              Få personliga svar från Napoleon Hills AI-mentor som känner till alla detaljer om framgångsprinciperna
            </p>
            <button
              onClick={onJoinClick}
              className="bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base min-h-[48px]"
            >
              <span className="text-center">Börja chatta med Napoleon Hill - 299 kr</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;