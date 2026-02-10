import { createContext, useContext } from 'react';

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple' | 'rating' | 'checkbox' | 'dropdown';
  options?: string[];
  required: boolean;
  ratingMax?: number;
  ratingLabels?: Record<string, string>;
}

export interface Submission {
  id: string;
  timestamp: string;
  answers: Record<string, string | string[]>;
}

export interface SurveyContextType {
  questions: Question[];
  submissions: Submission[];
  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, q: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  submitSurvey: (answers: Record<string, string | string[]>) => void;
  deleteSubmission: (id: string) => void;
  clearSubmissions: () => void;
  isAdmin: boolean;
  isSurveyActive: boolean;
  setSurveyStatus: (status: boolean) => void;
  surveyTitle: string;
  setSurveyTitle: (title: string) => void;
  updateAdminPassword: (newPassword: string) => void;
  login: (password: string) => boolean;
  logout: () => void;
}

export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) throw new Error('useSurvey must be used within a SurveyProvider');
  return context;
};
