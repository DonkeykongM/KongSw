import { PostItNote, ReflectionNote, QuizNote } from '../types/notes';

const NOTES_STORAGE_KEY = 'think-and-grow-rich-notes';

export const loadNotes = (): PostItNote[] => {
  try {
    const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes);
      // Convert date strings back to Date objects
      return parsedNotes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const saveNotes = (notes: PostItNote[]): void => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const addNote = (note: PostItNote): void => {
  const notes = loadNotes();
  notes.push(note);
  saveNotes(notes);
};

export const updateNote = (noteId: string, updates: Partial<PostItNote>): void => {
  const notes = loadNotes();
  const index = notes.findIndex(note => note.id === noteId);
  if (index !== -1) {
    notes[index] = { ...notes[index], ...updates, updatedAt: new Date() };
    saveNotes(notes);
  }
};

export const deleteNote = (noteId: string): void => {
  const notes = loadNotes();
  const filteredNotes = notes.filter(note => note.id !== noteId);
  saveNotes(filteredNotes);
};

export const getNotesForModule = (moduleId: number): PostItNote[] => {
  const notes = loadNotes();
  return notes.filter(note => note.moduleId === moduleId);
};

export const getReflectionNotes = (moduleId: number): ReflectionNote[] => {
  const notes = getNotesForModule(moduleId);
  return notes.filter(note => note.type === 'reflection') as ReflectionNote[];
};

export const getQuizNotes = (moduleId: number): QuizNote[] => {
  const notes = getNotesForModule(moduleId);
  return notes.filter(note => note.type === 'quiz') as QuizNote[];
};

export const generateNoteId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};