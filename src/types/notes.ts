export interface PostItNote {
  id: string;
  type: 'reflection' | 'quiz';
  moduleId: number;
  moduleTitle: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReflectionNote extends PostItNote {
  type: 'reflection';
  questionIndex: number;
  question: string;
}

export interface QuizNote extends PostItNote {
  type: 'quiz';
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: number[];
}