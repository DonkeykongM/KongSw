import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, XCircle, RotateCcw, Lightbulb, Target, Zap, AlertTriangle, ArrowRight, User, Clock, Package, StickyNote, Brain, Calendar, Play, MessageCircle, Minimize2, X } from 'lucide-react';
import { ModuleContent, QuizQuestion } from '../data/courseContent';
import { ModuleSchema, BreadcrumbSchema } from './SEOComponents';
import PostItNote from './PostItNote';
import { ReflectionNote, QuizNote } from '../types/notes';
import { 
  markWeekLessonCompleted, 
  markWeekReflectionCompleted, 
  markWeekQuizCompleted,
  getModuleProgress,
  updateModuleProgress
} from '../utils/progressStorage';
import { 
  addNote, 
  updateNote, 
  deleteNote, 
  getReflectionNotes, 
  getQuizNotes, 
  generateNoteId 
} from '../utils/notesStorage';

interface ModuleDetailProps {
  module: ModuleContent;
  onBack: () => void;
  onSignOut: () => Promise<{ error: any }>;
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ module, onBack, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<'lesson' | 'reflection' | 'quiz' | 'overview' | 'resources'>('lesson');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [reflectionAnswers, setReflectionAnswers] = useState<{[key: number]: string}>({});
  const [hasViewedLesson, setHasViewedLesson] = useState(false);
  const [checklist, setChecklist] = useState({
    dailyPractice: false,
    reflectionCompleted: false,
    quizPassed: false,
    observedChanges: false
  });

  // Post-it notes state
  const [reflectionNotes, setReflectionNotes] = useState<ReflectionNote[]>([]);
  const [quizNotes, setQuizNotes] = useState<QuizNote[]>([]);
  const [isChatbotExpanded, setIsChatbotExpanded] = useState(false);

  // Calculate if checklist is complete
  const isChecklistComplete = Object.values(checklist).every(Boolean);

  // Handle checklist item changes
  const handleChecklistChange = (key: keyof typeof checklist) => {
    const updatedChecklist = {
      ...checklist,
      [key]: !checklist[key]
    };
    setChecklist(updatedChecklist);
    
    // Check if all items are now completed
    const allCompleted = Object.values(updatedChecklist).every(Boolean);
    
    // If all checklist items are completed, mark module as completed
    if (allCompleted) {
      updateModuleProgress(module.id, { 
        completed: true,
        lessonCompleted: true,
        reflectionCompleted: true, 
        quizCompleted: true
      });
    }
    
    // Save to localStorage for persistence
    localStorage.setItem(`checklist_module_${module.id}`, JSON.stringify(updatedChecklist));
  };

  // Load notes on component mount
  React.useEffect(() => {
    setReflectionNotes(getReflectionNotes(module.id));
    setQuizNotes(getQuizNotes(module.id));
    
    // Check if lesson was already viewed
    const progress = getModuleProgress(module.id);
    setHasViewedLesson(progress?.lessonCompleted || false);
    
    // Load checklist state from localStorage
    const savedChecklist = localStorage.getItem(`checklist_module_${module.id}`);
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
    
    // Auto-check reflection and quiz based on progress
    if (progress) {
      setChecklist(prev => ({
        ...prev,
        reflectionCompleted: progress.reflectionCompleted || false,
        quizPassed: (progress.quizCompleted && (progress.quizScore || 0) >= 80) || false
      }));
    }
  }, [module.id]);

  // Load Napoleon Hill AI Brain for module pages
  useEffect(() => {
    // Prevent chatbot loading on small mobile screens to avoid crashes
    const isMobile = window.innerWidth < 768;
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Skip chatbot on mobile or low-end devices to prevent crashes
    if (isMobile || isLowEndDevice) {
      console.log('Skipping chatbot on mobile/low-end device to prevent crashes');
      return;
    }
    
    if (!window.VG_SCRIPT_LOADED) {
      // Add error handling for chatbot loading
      try {
        // Create the container if it doesn't exist
        if (!document.getElementById('VG_OVERLAY_CONTAINER')) {
          const container = document.createElement('div');
          container.id = 'VG_OVERLAY_CONTAINER';
          container.style.width = '0px';
          container.style.height = '0px';
          container.style.position = 'fixed';
          container.style.bottom = '20px';
          container.style.right = '20px';
          container.style.zIndex = '9999';
          container.style.transition = 'width 0.3s ease, height 0.3s ease';
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
        
        // Add error handling for script loading
        const VG_SCRIPT = document.createElement("script");
        VG_SCRIPT.src = "https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js";
        VG_SCRIPT.defer = true;
        VG_SCRIPT.onerror = () => {
          console.warn('Failed to load chatbot script - continuing without AI mentor');
          window.VG_SCRIPT_LOADED = false;
        };
        VG_SCRIPT.onload = () => {
          console.log('Chatbot script loaded successfully');
          window.VG_SCRIPT_LOADED = true;
        };
        document.body.appendChild(VG_SCRIPT);
      } catch (error) {
        console.error('Error setting up chatbot:', error);
        window.VG_SCRIPT_LOADED = false;
      }
    }
  }, []);

  const toggleChatbot = () => {
    // Safety check for mobile devices
    const container = document.getElementById('VG_OVERLAY_CONTAINER');
    if (!container || window.innerWidth < 768) {
      // Show alternative mobile help instead
      alert('Napoleon Hill AI-mentor: På mobila enheter, använd reflektionsfrågorna och quizen för vägledning. AI-chatten fungerar bäst på desktop.');
      return;
    }
    
    if (container) {
      if (isChatbotExpanded) {
        container.style.width = '0px';
        container.style.height = '0px';
        setIsChatbotExpanded(false);
      } else {
        container.style.width = '500px';
        container.style.height = '500px';
        setIsChatbotExpanded(true);
      }
    }
  };

  // Mark lesson as completed when user views it
  const handleLessonView = () => {
    if (!hasViewedLesson) {
      markWeekLessonCompleted(module.id);
      setHasViewedLesson(true);
    }
  };

  const renderLesson = () => (
    <div className="max-w-6xl mx-auto space-y-8" onClick={handleLessonView}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl shadow-2xl text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-blue-100 font-semibold">Vecka {module.id} av 13</span>
            </div>
            {hasViewedLesson && (
              <div className="bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">Lektion slutförd</span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {module.title}
          </h1>
          
          <p className="text-xl text-blue-100 leading-relaxed max-w-4xl">
            {module.description}
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="bg-blue-500/30 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full text-sm font-medium">
              Napoleon Hills Princip
            </span>
            <span className="bg-purple-500/30 backdrop-blur-sm text-purple-100 px-4 py-2 rounded-full text-sm font-medium">
              7 Dagars Integration
            </span>
            <span className="bg-green-500/30 backdrop-blur-sm text-green-100 px-4 py-2 rounded-full text-sm font-medium">
              Praktisk Tillämpning
            </span>
          </div>
        </div>
      </div>

      {/* Main Lesson Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-3 mr-4">
            <Play className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Veckans videolektion</h2>
        </div>
        
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg mb-6">
          <video 
            controls 
            className="w-full h-full object-cover"
            poster="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg"
          >
            <source src={module.videoUrl} type="video/mp4" />
            Din webbläsare stöder inte video-taggen.
          </video>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-blue-800 text-sm">
            <strong>💡 Tips:</strong> Titta på videon flera gånger under veckan för att fördjupa din förståelse av principen.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              Vad du kommer att lära dig
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="text-blue-800 text-lg leading-relaxed">
                Denna vecka fokuserar på Napoleon Hills princip om <strong>{module.title}</strong>, 
                en av de 13 grundläggande framgångsprinciperna från "Tänk och Bli Rik".
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-6 h-6 text-green-600 mr-2" />
              Veckans lärplan
            </h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-lg p-4 border border-green-100">
                  <h4 className="font-bold text-green-800 mb-2">📚 Dag 1-2: Grund</h4>
                  <p className="text-green-700 text-sm">Läs och förstå principen grundligt</p>
                </div>
                <div className="bg-white/80 rounded-lg p-4 border border-green-100">
                  <h4 className="font-bold text-green-800 mb-2">🎯 Dag 3-4: Praktik</h4>
                  <p className="text-green-700 text-sm">Börja praktisera i små steg</p>
                </div>
                <div className="bg-white/80 rounded-lg p-4 border border-green-100">
                  <h4 className="font-bold text-green-800 mb-2">⚡ Dag 5-6: Fördjupning</h4>
                  <p className="text-green-700 text-sm">Fördjupa din tillämpning</p>
                </div>
                <div className="bg-white/80 rounded-lg p-4 border border-green-100">
                  <h4 className="font-bold text-green-800 mb-2">🔍 Dag 7: Utvärdering</h4>
                  <p className="text-green-700 text-sm">Reflektion och utvärdering</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-6 h-6 text-yellow-600 mr-2" />
              Kärninnehåll
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {module.lessonText}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 text-purple-600 mr-2" />
              Viktiga implementeringspunkter
            </h3>
            <div className="space-y-3">
              {module.keyPrinciples.map((principle, index) => (
                <div key={index} className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-2">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-purple-800 font-medium">{principle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <ArrowRight className="w-6 h-6 text-indigo-600 mr-2" />
              Hur du tillämpar denna princip
            </h3>
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 mb-4">
              <p className="text-indigo-800 text-lg font-medium mb-4">
                Napoleon Hill betonade att kunskap utan handling är värdelös. Så här tillämpar du denna princip:
              </p>
            </div>
            
            <div className="space-y-4">
              {module.practicalSteps.map((step, index) => (
                <div key={index} className="bg-white border border-indigo-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-indigo-800 mb-2">{step.step}</h4>
                      <p className="text-gray-700 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Progress Guidelines - Moved to bottom with gentler styling */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-xl p-6 mt-8">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-200 rounded-full p-3 flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-blue-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                📋 Checklista för att gå vidare till nästa vecka:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className={`bg-white/80 rounded-lg p-4 border transition-all duration-300 ${
                  checklist.dailyPractice ? 'border-green-300 bg-green-50/50' : 'border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="dailyPractice"
                      checked={checklist.dailyPractice}
                      onChange={() => handleChecklistChange('dailyPractice')}
                      className="w-5 h-5 mt-1 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div>
                      <label htmlFor="dailyPractice" className={`font-semibold mb-1 cursor-pointer ${
                        checklist.dailyPractice ? 'text-green-800 line-through' : 'text-blue-800'
                      }`}>
                        Praktiserat dagligen i 7 dagar
                      </label>
                      <p className={`text-sm ${
                        checklist.dailyPractice ? 'text-green-700' : 'text-blue-700'
                      }`}>
                        Principen ska bli naturlig för dig
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`bg-white/80 rounded-lg p-4 border transition-all duration-300 ${
                  checklist.reflectionCompleted ? 'border-green-300 bg-green-50/50' : 'border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="reflectionCompleted"
                      checked={checklist.reflectionCompleted}
                      onChange={() => handleChecklistChange('reflectionCompleted')}
                      className="w-5 h-5 mt-1 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div>
                      <label htmlFor="reflectionCompleted" className={`font-semibold mb-1 cursor-pointer ${
                        checklist.reflectionCompleted ? 'text-green-800 line-through' : 'text-blue-800'
                      }`}>
                        Slutfört reflektionsfrågor
                      </label>
                      <p className={`text-sm ${
                        checklist.reflectionCompleted ? 'text-green-700' : 'text-blue-700'
                      }`}>
                        Djupare förståelse genom reflektion
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`bg-white/80 rounded-lg p-4 border transition-all duration-300 ${
                  checklist.quizPassed ? 'border-green-300 bg-green-50/50' : 'border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="quizPassed"
                      checked={checklist.quizPassed}
                      onChange={() => handleChecklistChange('quizPassed')}
                      className="w-5 h-5 mt-1 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div>
                      <label htmlFor="quizPassed" className={`font-semibold mb-1 cursor-pointer ${
                        checklist.quizPassed ? 'text-green-800 line-through' : 'text-blue-800'
                      }`}>
                        Klarat quizet (80%+)
                      </label>
                      <p className={`text-sm ${
                        checklist.quizPassed ? 'text-green-700' : 'text-blue-700'
                      }`}>
                        Bekräfta din kunskapsinhämtning
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`bg-white/80 rounded-lg p-4 border transition-all duration-300 ${
                  checklist.observedChanges ? 'border-green-300 bg-green-50/50' : 'border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="observedChanges"
                      checked={checklist.observedChanges}
                      onChange={() => handleChecklistChange('observedChanges')}
                      className="w-5 h-5 mt-1 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div>
                      <label htmlFor="observedChanges" className={`font-semibold mb-1 cursor-pointer ${
                        checklist.observedChanges ? 'text-green-800 line-through' : 'text-blue-800'
                      }`}>
                        Observerat förändringar
                      </label>
                      <p className={`text-sm ${
                        checklist.observedChanges ? 'text-green-700' : 'text-blue-700'
                      }`}>
                        Små framsteg är också framsteg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`rounded-lg p-4 border transition-all duration-300 ${
                isChecklistComplete 
                  ? 'bg-green-100/60 border-green-200' 
                  : 'bg-blue-100/60 border-blue-200'
              }`}>
                <p className={`text-sm ${
                  isChecklistComplete ? 'text-green-800' : 'text-blue-800'
                }`}>
                  💡 <strong>Varför tar det tid?</strong> Napoleon Hill upptäckte att det krävs upprepning för att programmera undermedvetandet. Ta dig tid - det är fundamentet för bestående framgång.
                </p>
                {isChecklistComplete && (
                  <p className="text-green-800 text-sm font-bold mt-2">
                    🎉 Fantastisk! Du har slutfört alla steg för denna vecka. {module.id < 13 ? `Vecka ${module.id + 1} är nu tillgänglig!` : 'Du har slutfört hela kursen!'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (selectedAnswer === module.quiz[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }

      if (currentQuestion < module.quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        
        // Save quiz result as post-it note
        const finalScore = selectedAnswer === module.quiz[currentQuestion].correctAnswer ? score + 1 : score;
        const finalPercentage = Math.round((finalScore / module.quiz.length) * 100);
        
        // Mark quiz as completed
        markWeekQuizCompleted(module.id, finalScore, module.quiz.length);
        
        const quizNote: QuizNote = {
          id: generateNoteId(),
          type: 'quiz',
          moduleId: module.id,
          moduleTitle: module.title,
          content: `Quiz completed with ${finalScore}/${module.quiz.length} correct answers`,
          score: finalScore,
          totalQuestions: module.quiz.length,
          percentage: finalPercentage,
          answers: [...newAnswers, selectedAnswer],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        addNote(quizNote);
        setQuizNotes(getQuizNotes(module.id));
      }
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  const handleReflectionChange = (questionIndex: number, answer: string) => {
    setReflectionAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSaveReflections = () => {
    Object.entries(reflectionAnswers).forEach(([questionIndex, answer]) => {
      if (answer.trim()) {
        const reflectionNote: ReflectionNote = {
          id: generateNoteId(),
          type: 'reflection',
          moduleId: module.id,
          moduleTitle: module.title,
          content: answer.trim(),
          questionIndex: parseInt(questionIndex),
          question: module.reflectionQuestions[parseInt(questionIndex)].question,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        addNote(reflectionNote);
      }
    });
    
    // Clear the form and refresh notes
    setReflectionAnswers({});
    setReflectionNotes(getReflectionNotes(module.id));
    
    // Mark reflection as completed
    markWeekReflectionCompleted(module.id);
    
    // Show success message
    alert('Reflections saved successfully!');
  };

  const handleEditNote = (noteId: string, newContent: string) => {
    updateNote(noteId, { content: newContent });
    setReflectionNotes(getReflectionNotes(module.id));
    setQuizNotes(getQuizNotes(module.id));
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
      setReflectionNotes(getReflectionNotes(module.id));
      setQuizNotes(getQuizNotes(module.id));
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Purpose Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Target className="w-6 h-6 text-blue-600" />
          <span>Modulens syfte</span>
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">{module.purpose}</p>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Översikt</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Huvudmål:</h4>
            <p className="text-gray-700 leading-relaxed">{module.overview.mainGoal}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Viktiga lärdomar:</h4>
            <ul className="space-y-2">
              {module.overview.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">{takeaway}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Tillämpningsvägledning:</h4>
            <p className="text-gray-700 leading-relaxed">{module.overview.applicationGuidance}</p>
          </div>
        </div>
      </div>

      {/* Inspirational Quote */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <blockquote className="text-xl italic text-blue-800 mb-4">
          "{module.quote}"
        </blockquote>
        <cite className="text-blue-600 font-medium">- Napoleon Hill</cite>
      </div>

      {/* Key Principles */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Nyckelpriciper</h3>
        <ul className="space-y-3">
          {module.keyPrinciples.map((principle, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed">{principle}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Practical Steps */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-green-600" />
          <span>Praktiska steg</span>
        </h3>
        <div className="space-y-4">
          {module.practicalSteps.map((step, index) => (
            <div key={index} className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">
                {index + 1}. {step.step}
              </h4>
              <p className="text-green-700 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Pitfalls */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <span>Vanliga fallgropar att undvika</span>
        </h3>
        <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
          <ul className="space-y-3">
            {module.commonPitfalls.map((pitfall, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></div>
                <p className="text-red-700 leading-relaxed">{pitfall}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Exercises */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <User className="w-6 h-6 text-indigo-600" />
          <span>Praktiska övningar</span>
        </h3>
        <div className="space-y-6">
          {module.exercises.map((exercise, index) => (
            <div key={index} className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-3 text-lg">{exercise.title}</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-indigo-700">Varaktighet: </span>
                    <span className="text-indigo-600">{exercise.duration}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-indigo-700">Material: </span>
                    <span className="text-indigo-600">{exercise.materials.join(', ')}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-indigo-700 mb-2">Instruktioner:</h5>
                  <p className="text-indigo-600 leading-relaxed">{exercise.instructions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ytterligare resurser</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {module.resources.map((resource, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">{resource.title}</p>
                  <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const moduleProgress = getModuleProgress(module.id);
    
    if (!quizStarted) {
      return (
        <div className="text-center py-12">
          <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Testa dina kunskaper</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Ta detta quiz för att testa din förståelse av nyckelbegreppen i denna modul.
          </p>
          {moduleProgress?.quizCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-green-700 text-sm flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Quiz slutfört med {moduleProgress.quizScore}% resultat
              </p>
            </div>
          )}
          <button
            onClick={startQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-md hover:shadow-lg"
          >
            Starta quiz
          </button>
        </div>
      );
    }

    if (showResult) {
      const percentage = Math.round((score / module.quiz.length) * 100);
      return (
        <div className="text-center py-12">
          <div className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 ${
            percentage >= 70 ? 'bg-green-50' : 'bg-yellow-50'
          }`}>
            {percentage >= 70 ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-yellow-600" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Quiz slutfört!</h3>
          <p className="text-gray-600 mb-4">
            Du fick {score} av {module.quiz.length} ({percentage}%)
          </p>
          <p className="text-gray-600 mb-8">
            {percentage >= 70 ? 'Utmärkt arbete! Du har en stark förståelse av denna modul.' : 'Överväg att granska materialet och försöka igen.'}
          </p>
          <button
            onClick={resetQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-md hover:shadow-lg inline-flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Gör om quiz</span>
          </button>
        </div>
      );
    }

    const question = module.quiz[currentQuestion];
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quiz Section */}
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Fråga {currentQuestion + 1} av {module.quiz.length}
                </span>
                <div className="text-sm text-gray-500">
                  Resultat: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / module.quiz.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>
              
              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedAnswer === index ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className={`font-bold py-3 px-8 rounded-full transition duration-300 ${
                    selectedAnswer !== null
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentQuestion === module.quiz.length - 1 ? 'Avsluta quiz' : 'Nästa fråga'}
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Results Notes */}
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-2">
                <StickyNote className="w-6 h-6 text-blue-600" />
                <span>Quizresultat</span>
              </h3>
              <p className="text-gray-600">
                Dina quizförsök sparas här för framtida referens.
              </p>
            </div>

            {quizNotes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {quizNotes.map((note) => (
                  <PostItNote
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <StickyNote className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Inga quizresultat än. Slutför quizet för att se dina resultat här!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderReflection = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {getModuleProgress(module.id)?.reflectionCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Reflektionsfrågor slutförda! Dina insikter har sparats.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reflection Questions */}
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reflektionsfrågor</h3>
            <p className="text-gray-600">
              Ta dig tid att djupt överväga dessa frågor och skriv dina genomtänkta svar.
            </p>
          </div>

          {module.reflectionQuestions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                {index + 1}. {question.question}
              </h4>
              <textarea
                rows={4}
                placeholder={question.placeholder}
                value={reflectionAnswers[index] || ''}
                onChange={(e) => handleReflectionChange(index, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          ))}

          <div className="text-center">
            <button 
              onClick={handleSaveReflections}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-md hover:shadow-lg"
            >
              Spara reflektioner
            </button>
          </div>
        </div>

        {/* Saved Reflection Notes */}
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-2">
              <StickyNote className="w-6 h-6 text-yellow-600" />
              <span>Sparade reflektioner</span>
            </h3>
            <p className="text-gray-600">
              Dina tidigare reflektioner sparas här som post-it-lappar.
            </p>
          </div>

          {reflectionNotes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {reflectionNotes.map((note) => (
                <PostItNote
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <StickyNote className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Inga sparade reflektioner än. Slutför frågorna ovan för att skapa din första anteckning!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50">
      {/* SEO Schema */}
      <ModuleSchema
        moduleId={module.id}
        title={module.title}
        description={module.description}
        timeRequired="PT2H"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://kongmindset.com/" },
          { name: "Course Modules", url: "https://kongmindset.com/modules" },
          { name: module.title, url: `https://kongmindset.com/modules/${module.id}` }
        ]}
      />
      
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
             <span>Tillbaka till kursen</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent text-center">
             {module.title} | Napoleon Hills Tänk och Bli Rik Modul {module.id}
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide pb-1">
            {[
              { id: 'lesson', label: 'Lektion' },
              { id: 'reflection', label: 'Reflektion' },
              { id: 'quiz', label: 'Quiz' },
              { id: 'overview', label: 'Översikt' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 sm:py-4 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm lg:text-base transition-all duration-200 whitespace-nowrap min-h-[44px] flex items-center flex-shrink-0 active:bg-gray-100 ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="sm:hidden bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">Modul {module.id} av 13</span>
          <div className="flex items-center space-x-2">
            <span>{activeTab === 'lesson' ? 'Lektion' : activeTab === 'reflection' ? 'Reflektion' : activeTab === 'quiz' ? 'Quiz' : 'Översikt'}</span>
            <button
              onClick={() => onSignOut()}
              className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium min-h-[32px] min-w-[60px] active:scale-95"
              title="Logga ut"
            >
              Ut
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {activeTab === 'lesson' && renderLesson()}
        {activeTab === 'reflection' && renderReflection()}
        {activeTab === 'quiz' && renderQuiz()}
        {activeTab === 'overview' && renderOverview()}
      </div>

      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-4 right-4 z-[10000]">
        {/* Only show chatbot button on larger screens to prevent mobile crashes */}
        <div className="hidden md:block">
          <button
            onClick={toggleChatbot}
            className={`bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 flex items-center space-x-2 ring-4 ring-blue-300/50 backdrop-blur-sm ${
              isChatbotExpanded 
                ? 'w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-4 border-white text-white shadow-2xl' 
                : 'p-5 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
            }`}
            title={isChatbotExpanded ? 'Minimera Napoleon Hill AI' : 'Fråga Napoleon Hill AI - Din personliga framgångsmentor'}
          >
            {isChatbotExpanded ? (
              <div className="flex flex-col items-center">
                <X className="w-6 h-6" />
                <span className="text-xs font-bold">STÄNG</span>
              </div>
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
            <div className="absolute -top-16 right-0 bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-2 rounded-lg shadow-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              <div className="text-sm font-bold">🧠 Napoleon Hill AI</div>
              <div className="text-xs opacity-90">Din personliga framgångsmentor</div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-900"></div>
            </div>
          )}
        </div>
        
        {/* Mobile Help Button (Alternative to chatbot) */}
        <div className="md:hidden">
          <button
            onClick={() => {
              alert('💡 Mobilhjälp:\n\n• Använd reflektionsfrågorna för djupare förståelse\n• Ta quizen för att testa din kunskap\n• Napoleon Hill AI fungerar bäst på desktop\n• Alla moduler är optimerade för mobil läsning');
            }}
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 p-4 w-14 h-14 flex items-center justify-center active:scale-95"
            title="Mobilhjälp och tips"
          >
            <span className="text-2xl">💡</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;