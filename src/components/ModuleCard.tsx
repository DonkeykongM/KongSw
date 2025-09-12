import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CheckCircle, Lock } from 'lucide-react';
import { ModuleContent } from '../data/courseContent';
import { getModuleProgress } from '../utils/progressStorage';

interface ModuleCardProps {
  module: ModuleContent;
  onModuleStart: (moduleId: number) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onModuleStart }) => {
  const { title, description, icon, id } = module;
  const progress = getModuleProgress(module.id);
  const isCompleted = progress?.completed || false;
  
  // Check if previous module is completed (module 1 is always unlocked)
  const isPreviousModuleCompleted = module.id === 1 || getModuleProgress(module.id - 1)?.completed || false;
  const isLocked = !isPreviousModuleCompleted;
  
  // Dynamically get the icon component
  const IconComponent = LucideIcons[icon as keyof typeof LucideIcons];

  return (
    <div className={`bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center transform transition-all duration-300 border w-full max-w-sm relative ${
      isLocked ? 'opacity-60 border-gray-300' : 
      isCompleted ? 'border-green-300 bg-green-50/50 hover:scale-105 hover:shadow-2xl' : 
      'border-white/20 hover:scale-105 hover:shadow-2xl'
    } ${
      // Enhanced mobile touch experience
      'active:scale-95 touch-manipulation'
    }`}>
      {isCompleted && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-green-500 rounded-full p-1">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      )}
      
      {isLocked && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gray-500 rounded-full p-1">
          <Lock className="w-5 h-5 text-white" />
        </div>
      )}
      
      {/* Week Number Badge */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
        Vecka {id}
      </div>
      
      {IconComponent && (
        <div className={`rounded-full p-3 sm:p-4 mb-4 sm:mb-6 ${
          isLocked ? 'bg-gradient-to-r from-gray-100 to-gray-200' :
          isCompleted 
            ? 'bg-gradient-to-r from-green-100 to-green-200' 
            : 'bg-gradient-to-r from-primary-100 to-primary-200'
        }`}>
          <IconComponent className={`h-7 w-7 sm:h-8 sm:w-8 ${
            isLocked ? 'text-gray-500' :
            isCompleted ? 'text-green-600' : 'text-primary-600'
          }`} />
        </div>
      )}
      <h3 className="text-base sm:text-lg lg:text-xl font-display font-semibold mb-2 sm:mb-3 text-primary-800 text-center leading-tight px-2">{title}</h3>
      <p className={`text-center mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm leading-relaxed flex-grow px-2 ${
        isLocked ? 'text-gray-500' : 'text-neutral-600'
      }`}>{description}</p>
      
      {isLocked && (
        <div className="mb-3 sm:mb-4 text-center">
          <p className="text-gray-500 text-xs sm:text-sm font-semibold">🔒 Låst</p>
          <p className="text-gray-400 text-xs">Slutför vecka {module.id - 1} först</p>
        </div>
      )}
      
      {isCompleted && (
        <div className="mb-3 sm:mb-4 text-center">
          <p className="text-green-600 text-xs sm:text-sm font-semibold">✅ Modul slutförd</p>
          {progress?.quizScore && (
            <p className="text-green-500 text-xs">Quizresultat: {progress.quizScore}%</p>
          )}
        </div>
      )}
      
      <button 
        onClick={() => !isLocked && onModuleStart(module.id)}
        disabled={isLocked}
        className={`font-semibold py-3 px-4 sm:px-6 rounded-full transition-all duration-300 shadow-lg text-sm sm:text-base min-h-[48px] w-full active:scale-95 ${
          isLocked
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 
          isCompleted
            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl transform hover:scale-105 hover:-translate-y-1'
            : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white hover:shadow-xl transform hover:scale-105 hover:-translate-y-1'
        }`}
      >
        {isLocked ? 'Låst' : isCompleted ? 'Granska vecka' : 'Starta vecka'}
      </button>
    </div>
  );
};

export default ModuleCard;