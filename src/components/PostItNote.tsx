import React, { useState } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { PostItNote as PostItNoteType, ReflectionNote, QuizNote } from '../types/notes';

interface PostItNoteProps {
  note: PostItNoteType;
  onEdit: (noteId: string, newContent: string) => void;
  onDelete: (noteId: string) => void;
}

const PostItNote: React.FC<PostItNoteProps> = ({ note, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(note.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPostItColor = (type: string) => {
    switch (type) {
      case 'reflection':
        return 'bg-yellow-200 border-yellow-300';
      case 'quiz':
        return 'bg-blue-200 border-blue-300';
      default:
        return 'bg-yellow-200 border-yellow-300';
    }
  };

  const renderQuizContent = (quizNote: QuizNote) => (
    <div className="space-y-2">
      <div className="text-sm font-medium">Quizresultat</div>
      <div className="text-lg font-bold">
        Resultat: {quizNote.score}/{quizNote.totalQuestions} ({quizNote.percentage}%)
      </div>
      <div className="text-sm text-gray-600">
        {quizNote.percentage >= 70 ? '✅ Godkänt' : '❌ Behöver ses över'}
      </div>
    </div>
  );

  const renderReflectionContent = (reflectionNote: ReflectionNote) => (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700">
        Fråga {reflectionNote.questionIndex + 1}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {reflectionNote.question}
      </div>
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded resize-none bg-white"
          rows={4}
        />
      ) : (
        <div className="text-sm">{note.content}</div>
      )}
    </div>
  );

  return (
    <div className={`${getPostItColor(note.type)} p-4 rounded-lg border-2 shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-200 relative group`}>
      {/* Header with controls */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs text-gray-600">
          {formatDate(note.createdAt)}
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1 hover:bg-green-300 rounded"
                title="Spara"
              >
                <Save className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-red-300 rounded"
                title="Avbryt"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <>
              {note.type === 'reflection' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-blue-300 rounded"
                  title="Redigera"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 hover:bg-red-300 rounded"
                title="Ta bort"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {note.type === 'quiz' ? 
        renderQuizContent(note as QuizNote) : 
        renderReflectionContent(note as ReflectionNote)
      }

      {/* Module reference */}
      <div className="text-xs text-gray-500 mt-2 border-t pt-2">
        {note.moduleTitle}
      </div>
    </div>
  );
};

export default PostItNote;