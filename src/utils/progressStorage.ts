export interface ModuleProgress {
  moduleId: number;
  completed: boolean;
  completedAt?: Date;
  lessonCompleted: boolean;
  reflectionCompleted: boolean;
  quizCompleted: boolean;
  quizScore?: number;
}

const PROGRESS_STORAGE_KEY = 'kongmindset-module-progress';

export const loadProgress = (): ModuleProgress[] => {
  try {
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (storedProgress) {
      const parsedProgress = JSON.parse(storedProgress);
      // Convert date strings back to Date objects
      return parsedProgress.map((progress: any) => ({
        ...progress,
        completedAt: progress.completedAt ? new Date(progress.completedAt) : undefined
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading progress:', error);
    return [];
  }
};

export const saveProgress = (progress: ModuleProgress[]): void => {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const updateModuleProgress = (
  moduleId: number, 
  updates: Partial<Omit<ModuleProgress, 'moduleId'>>
): void => {
  const allProgress = loadProgress();
  const existingIndex = allProgress.findIndex(p => p.moduleId === moduleId);
  
  if (existingIndex >= 0) {
    // Update existing progress
    allProgress[existingIndex] = { 
      ...allProgress[existingIndex], 
      ...updates 
    };
    
    // Check if week is fully completed
    const progress = allProgress[existingIndex];
    if (progress.lessonCompleted && progress.reflectionCompleted && progress.quizCompleted) {
      progress.completed = true;
      progress.completedAt = new Date();
    }
  } else {
    // Create new progress entry
    const newProgress: ModuleProgress = {
      moduleId,
      completed: false,
      lessonCompleted: false,
      reflectionCompleted: false,
      quizCompleted: false,
      ...updates
    };
    
    // Check if week is fully completed
    if (newProgress.lessonCompleted && newProgress.reflectionCompleted && newProgress.quizCompleted) {
      newProgress.completed = true;
      newProgress.completedAt = new Date();
    }
    
    allProgress.push(newProgress);
  }
  
  saveProgress(allProgress);
};

export const getModuleProgress = (moduleId: number): ModuleProgress | null => {
  const allProgress = loadProgress();
  return allProgress.find(p => p.moduleId === moduleId) || null;
};

export const getCompletedWeeksCount = (): number => {
  const allProgress = loadProgress();
  return allProgress.filter(p => p.completed).length;
};

export const getTotalProgress = (): number => {
  const totalWeeks = 13; // We have 13 weeks
  const completedCount = getCompletedWeeksCount();
  return Math.round((completedCount / totalWeeks) * 100);
};

export const markWeekLessonCompleted = (moduleId: number): void => {
  updateModuleProgress(moduleId, { lessonCompleted: true });
};

export const markWeekReflectionCompleted = (moduleId: number): void => {
  updateModuleProgress(moduleId, { reflectionCompleted: true });
};

export const markWeekQuizCompleted = (moduleId: number, score: number, totalQuestions: number): void => {
  const percentage = Math.round((score / totalQuestions) * 100);
  updateModuleProgress(moduleId, { 
    quizCompleted: true, 
    quizScore: percentage 
  });
}