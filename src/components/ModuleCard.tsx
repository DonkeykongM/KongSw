return (
    <div className={`bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-4 sm:p-6 flex flex-col items-center transform transition-all duration-300 border w-full max-w-sm relative ${
      isLocked ? 'opacity-60 border-gray-300' : 
      isCompleted ? 'border-green-300 bg-green-50/50 hover:scale-105 hover:shadow-2xl' : 
      'border-white/20 hover:scale-105 hover:shadow-2xl'
    } ${
      // Enhanced mobile touch experience
      'active:scale-95 touch-manipulation min-h-[280px] sm:min-h-[320px]'
    }`}>
      {isCompleted && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-500 rounded-full p-1.5">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      )}
      
      {isLocked && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-500 rounded-full p-1.5">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      )}
      
      {/* Week Number Badge */}
      <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
        Vecka {id}
      </div>
      
      {IconComponent && (
        <div className={`rounded-full p-3 mb-4 mt-6 ${
          isLocked ? 'bg-gradient-to-r from-gray-100 to-gray-200' :
          isCompleted 
            ? 'bg-gradient-to-r from-green-100 to-green-200' 
            : 'bg-gradient-to-r from-primary-100 to-primary-200'
        }`}>
          <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${
            isLocked ? 'text-gray-500' :
            isCompleted ? 'text-green-600' : 'text-primary-600'
          }`} />
        </div>
      )}
      <h3 className="text-sm sm:text-lg font-display font-semibold mb-2 text-primary-800 text-center leading-tight px-2 line-clamp-2">{title}</h3>
      <p className={`text-center mb-4 text-xs sm:text-sm leading-relaxed flex-grow px-2 line-clamp-3 ${
        isLocked ? 'text-gray-500' : 'text-neutral-600'
      }`}>{description}</p>
      
      {isLocked && (
        <div className="mb-3 text-center">
          <p className="text-gray-500 text-xs font-semibold">🔒 Låst</p>
          <p className="text-gray-400 text-xs">Slutför vecka {module.id - 1}</p>
        </div>
      )}
      
      {isCompleted && (
        <div className="mb-3 text-center">
          <p className="text-green-600 text-xs font-semibold">✅ Slutförd</p>
          {progress?.quizScore && (
            <p className="text-green-500 text-xs">Quiz: {progress.quizScore}%</p>
          )}
        </div>
      )}
      
      <button 
        onClick={() => !isLocked && onModuleStart(module.id)}
        disabled={isLocked}
        className={`font-semibold py-3 px-4 rounded-full transition-all duration-300 shadow-lg text-sm min-h-[48px] w-full active:scale-95 ${
          isLocked
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 
          isCompleted
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-xl'
            : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-xl'
        }`}
      >
        {isLocked ? 'Låst' : isCompleted ? 'Granska' : 'Starta'}
      </button>
    </div>
  );