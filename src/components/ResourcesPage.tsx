import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, Gift, BookOpen, Brain, Target, CheckCircle, Star, Clock, Users, Shield } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { getCompletedWeeksCount, getTotalProgress } from '../utils/progressStorage';
import { useSubscription } from '../hooks/useSubscription';

interface ResourcesPageProps {
  onBack: () => void;
  onSignOut: () => Promise<{ error: any }>;
  user: SupabaseUser;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ onBack, onSignOut, user }) => {
  const { hasActiveAccess } = useSubscription(user);

  const resources = [
    {
      id: 1,
      title: "Ursprungliga 'Tänk och Bli Rik' Boken",
      description: "Ladda ner den kompletta ursprungliga boken av Napoleon Hill som startade allt.",
      type: "PDF-bok",
      size: "2.1 MB",
      icon: Gift,
      downloadUrl: "/Think and Grow Rich eBook.pdf",
      filename: "Tänk och Bli Rik - Napoleon Hill.pdf",
     downloadUrl: "/think-and-grow-rich-ebook.pdf",
    },
    {
      id: 2,
      title: "Från Dröm Till Verklighet",
      description: "En kompletterande bok som utforskar vägen från drömmar till konkret framgång.",
      type: "PDF-bok", 
      size: "1.8 MB",
      icon: BookOpen,
     downloadUrl: "/fran-drom-till-verklighet.pdf",
      filename: "Från Dröm Till Verklighet.pdf",
      featured: false
    },
    {
      id: 3,
      title: "13 Framgångsprinciper Snabbguide",
      description: "Sammanfattning av alla 13 principer i en lättanvänd referensguide.",
      type: "Referensguide",
      size: "0.8 MB",
      icon: Target,
      content: `
# Napoleon Hills 13 Framgångsprinciper - Snabbguide

## 1. Önskans kraft
- Utveckla brinnande önskan för dina mål
- Var specifik med vad du vill uppnå
- Önskan måste vara starkare än alla hinder

## 2. Tro och övertygelse  
- Tro på din förmåga att lyckas
- Använd autosuggestion för att bygga tro
- Agera som om framgång redan är din

## 3. Autosuggestion
- Programmera ditt undermedvetna sinne
- Upprepa positiva bekräftelser dagligen
- Kombinera ord med starka känslor

## 4. Specialiserad kunskap
- Skaffa specifik kunskap för dina mål
- Lär dig från experter och mentorer
- Tillämpa kunskapen praktiskt

## 5. Kreativ fantasi
- Använd din fantasi för att skapa lösningar
- Visualisera dina mål som redan uppnådda
- Kombinera idéer på nya sätt

## 6. Organiserad planering
- Skapa detaljerade planer för dina mål
- Omge dig med kompetenta rådgivare
- Justera planer baserat på resultat

## 7. Uthållighet
- Vägra att ge upp när det blir svårt
- Utveckla mental uthållighet
- Se motgångar som tillfälliga hinder

## 8. Beslutsamhet
- Fatta beslut snabbt och bestämt
- Ändra beslut långsamt om nödvändigt
- Undvik påverkan från tvivlare

## 9. Master Mind
- Skapa allianser med likasinnade personer
- Dela kunskap och resurser
- Dra nytta av kollektiv intelligens

## 10. Hjärnan och ditt sinne
- Förstå hjärnan som en sändare/mottagare
- Kontrollera dina tankar medvetet
- Öppna dig för inspiration och insikter

## 11. Transmutation av sexuell energi
- Kanalisera stark energi mot kreativa mål
- Använd passion för att driva framsteg
- Omvandla fysisk energi till mental kraft

## 12. Det sjätte sinnet
- Utveckla din intuition och "magkänsla"
- Lyssna på ditt inre gudomliga vägledning
- Lita på plötsliga insikter och inspiration

## 13. Rikedomsfilosofin
- Integrera alla principer till en helhet
- Förstå att rikedom är mer än pengar
- Använd framgång för att hjälpa andra

*Kom ihåg: Framgång kommer från systematisk tillämpning av ALLA principer, inte bara en eller två.*
      `
    },
    {
      id: 4,
      title: "Dagbok för framgångsprinciper",
      description: "Mall för att spåra din dagliga tillämpning av de 13 principerna.",
      type: "Aktivitetsmall",
      size: "0.3 MB",
      icon: BookOpen,
      content: `
# Daglig Framgångsdagbok - KongMindset

## Datum: _______________

### Morgonreflektion
**Min Definite Chief Aim idag:**
_________________________________

**Dagens prioriterade mål:**
1. _________________________________
2. _________________________________
3. _________________________________

### Principtillämpning

**1. Önskan:** Hur stark var min önskan idag? (1-10) ___
Reflektion: _________________________________

**2. Tro:** Vad gjorde jag för att stärka min tro? 
_________________________________

**3. Autosuggestion:** Vilka bekräftelser använde jag?
_________________________________

**4. Kunskap:** Vad lärde jag mig idag?
_________________________________

**5. Fantasi:** Hur använde jag min kreativa fantasi?
_________________________________

**6. Planering:** Vilka planer justerade eller förbättrade jag?
_________________________________

**7. Uthållighet:** Vilka hinder övervann jag idag?
_________________________________

**8. Beslut:** Vilka viktiga beslut fattade jag?
_________________________________

**9. Master Mind:** Hur samarbetade jag med andra?
_________________________________

**10. Sinnet:** Hur kontrollerade jag mina tankar?
_________________________________

**11. Energi:** Hur kanaliserade jag min energi produktivt?
_________________________________

**12. Intuition:** Vilka intuitiva insikter fick jag?
_________________________________

**13. Service:** Hur hjälpte jag andra idag?
_________________________________

### Kvällsreflektion
**Dagens största framgång:**
_________________________________

**Vad skulle jag göra annorlunda:**
_________________________________

**Tacksamt för:**
_________________________________

**Imorgon kommer jag att:**
_________________________________

### Framstegsmätning
**Energinivå:** Låg | Medel | Hög
**Fokus:** Låg | Medel | Hög  
**Optimism:** Låg | Medel | Hög
**Produktivitet:** Låg | Medel | Hög

**Veckovis mål:** _________________________________
**Månadsvis mål:** _________________________________
**Årligt mål:** _________________________________
      `
    }
  ];

  const handleDownload = (resource: typeof resources[0]) => {
    if (resource.downloadUrl) {
      // Direct download for PDF files
      const link = document.createElement('a');
      link.href = resource.downloadUrl;
      link.download = resource.filename || resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resource.content) {
      // Create and download text content
      const blob = new Blob([resource.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resource.title}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tillbaka till kursen
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Resurser</h1>
            <button
              onClick={onSignOut}
              className="flex items-center text-gray-600 hover:text-gray-700 transition-colors"
            >
              Logga ut
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-2xl">
            <Gift className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dina framgångsresurser
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ladda ner och använd dessa kraftfulla verktyg för att fördjupa din förståelse av Napoleon Hills principer
          </p>
        </div>

        {/* Access Status */}
        {hasActiveAccess() && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-green-800 font-semibold text-lg">
                ✅ Du har full tillgång till alla KongMindset-resurser
              </span>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <div 
                key={resource.id}
                className={`bg-white rounded-xl shadow-lg border-2 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  resource.featured ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-gray-200'
                }`}
              >
                {resource.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    🎁 GRATIS BONUS
                  </div>
                )}
                
                <div className={`rounded-full p-4 w-16 h-16 mb-6 ${
                  resource.featured 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {resource.size}
                  </span>
                </div>
                
                <button
                  onClick={() => handleDownload(resource)}
                  className={`w-full font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center justify-center space-x-2 ${
                    resource.featured
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                  }`}
                >
                  <Download className="w-5 h-5" />
                  <span>Ladda ner</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional Features for Members */}
        <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Exklusiva medlemsfördelar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-blue-50 rounded-lg p-6">
              <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-blue-800 mb-2">Napoleon Hill AI</h3>
              <p className="text-sm text-blue-700">Din personliga framgångsmentor tillgänglig 24/7</p>
            </div>
            
            <div className="text-center bg-green-50 rounded-lg p-6">
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-green-800 mb-2">Livstidsåtkomst</h3>
              <p className="text-sm text-green-700">Återkom till kursen när som helst för resten av ditt liv</p>
            </div>
            
            <div className="text-center bg-purple-50 rounded-lg p-6">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-purple-800 mb-2">Exklusiv gemenskap</h3>
              <p className="text-sm text-purple-700">Del av de första 100 medlemmarna med specialfördelar</p>
            </div>
            
            <div className="text-center bg-yellow-50 rounded-lg p-6">
              <Shield className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-bold text-yellow-800 mb-2">Pengarna tillbaka</h3>
              <p className="text-sm text-yellow-700">30 dagars full pengarna-tillbaka-garanti</p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ditt lärframsteg</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">13</div>
              <p className="text-sm text-blue-700">Moduler tillgängliga</p>
            </div>
            
            <div className="text-center bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">{getCompletedWeeksCount()}</div>
              <p className="text-sm text-green-700">Moduler slutförda</p>
            </div>
            
            <div className="text-center bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">{getTotalProgress()}%</div>
              <p className="text-sm text-purple-700">Totalt framsteg</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-800 mb-3">Rekommenderade nästa steg:</h3>
            {getCompletedWeeksCount() === 0 ? (
              <div className="space-y-2">
                <p className="text-gray-700 text-sm">
                  🎯 Börja med Modul 1: "Önskans kraft" för att påbörja din transformationsresa
                </p>
                <p className="text-gray-700 text-sm">
                  📖 Ladda ner den ursprungliga boken och läs kapitel 1 parallellt
                </p>
                <p className="text-gray-700 text-sm">
                  🧠 Chatta med Napoleon Hill AI för personlig vägledning
                </p>
              </div>
            ) : getCompletedWeeksCount() === 13 ? (
              <div className="space-y-2">
                <p className="text-green-600 text-sm font-semibold">
                  🎉 Grattis! Du har behärskat alla 13 principer!
                </p>
                <p className="text-gray-700 text-sm">
                  🔄 Gå igenom modulerna igen för fördjupad förståelse
                </p>
                <p className="text-gray-700 text-sm">
                  👥 Överväg att bli mentor för andra och dela din kunskap
                </p>
                <p className="text-gray-700 text-sm">
                  📈 Sätt nya, ännu större mål baserat på vad du lärt dig
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-blue-600 text-sm">
                  🚀 Fantastiska framsteg! Du är {getCompletedWeeksCount()}/13 moduler igenom din transformation
                </p>
                <p className="text-gray-700 text-sm">
                  📚 Fortsätt med nästa modul för att bygga momentum
                </p>
                <p className="text-gray-700 text-sm">
                  📝 Använd dagboken för att spåra dina dagliga tillämpningar
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Redo för nästa steg?</h3>
          <p className="text-blue-700 mb-6">
            Fortsätt din transformationsresa med praktisk tillämpning av Napoleon Hills principer
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Fortsätt med kursen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;