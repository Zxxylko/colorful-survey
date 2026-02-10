import { useState, useEffect, type ReactNode } from 'react';
import type { Question, Submission } from './useSurvey';
import { SurveyContext } from './useSurvey';

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('survey_questions');
    if (saved) return JSON.parse(saved);
    
    return [
      { id: '1', text: 'Bagaimana perasaan Anda hari ini?', type: 'rating', required: true, ratingMax: 5, ratingLabels: { '1': 'Sangat Buruk', '3': 'Cukup', '5': 'Sangat Baik' } },
      { id: '2', text: 'Teknologi apa yang Anda gunakan?', type: 'checkbox', options: ['React', 'Vue', 'Next.js', 'Angular', 'Svelte'], required: true },
      { id: '3', text: 'Apa bahasa pemrograman utama Anda?', type: 'multiple', options: ['JavaScript', 'Python', 'Go', 'PHP'], required: true },
      { id: '4', text: 'Pilih lokasi kantor impian Anda:', type: 'dropdown', options: ['Jakarta', 'Bali', 'Singapura', 'Remote'], required: false },
      { id: '5', text: 'Saran untuk platform kami:', type: 'text', required: false }
    ];
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('survey_submissions');
    if (saved) return JSON.parse(saved);
    
    const now = new Date();
    return [
      { id: 's1', timestamp: new Date(now.getTime() - 3600000).toISOString(), answers: { '1': '5', '2': ['React', 'Next.js'], '3': 'JavaScript', '4': 'Bali', '5': 'Keren bgt!' } },
      { id: 's2', timestamp: new Date(now.getTime() - 7200000).toISOString(), answers: { '1': '4', '2': ['React', 'Vue'], '3': 'JavaScript', '4': 'Singapore', '5': 'Mantap' } },
      { id: 's3', timestamp: new Date(now.getTime() - 10800000).toISOString(), answers: { '1': '3', '2': ['Next.js'], '3': 'Python', '4': 'Remote', '5': '' } },
      { id: 's4', timestamp: new Date(now.getTime() - 14400000).toISOString(), answers: { '1': '5', '2': ['React', 'Svelte'], '3': 'Go', '4': 'Bali', '5': 'Lanjutkan' } },
      { id: 's5', timestamp: new Date(now.getTime() - 18000000).toISOString(), answers: { '1': '4', '2': ['React', 'Next.js'], '3': 'JavaScript', '4': 'Remote', '5': 'Good' } }
    ];
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('is_admin') === 'true';
  });
  const [isSurveyActive, setIsSurveyActive] = useState(() => {
    const saved = localStorage.getItem('survey_status');
    return saved ? JSON.parse(saved) : true;
  });

  const [surveyTitle, setSurveyTitleState] = useState(() => {
    return localStorage.getItem('survey_title') || 'Colorful Survey';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('admin_password') || 'admin123';
  });

  useEffect(() => {
    localStorage.setItem('survey_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('survey_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('survey_status', JSON.stringify(isSurveyActive));
  }, [isSurveyActive]);

  useEffect(() => {
    localStorage.setItem('survey_title', surveyTitle);
  }, [surveyTitle]);

  useEffect(() => {
    localStorage.setItem('admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem('is_admin', isAdmin.toString());
  }, [isAdmin]);

  // Real-time synchronization across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'survey_submissions' && e.newValue) {
        setSubmissions(JSON.parse(e.newValue));
      }
      if (e.key === 'survey_questions' && e.newValue) {
        setQuestions(JSON.parse(e.newValue));
      }
      if (e.key === 'is_admin') {
        setIsAdmin(e.newValue === 'true');
      }
      if (e.key === 'survey_title' && e.newValue) {
        setSurveyTitleState(e.newValue);
      }
      if (e.key === 'survey_status' && e.newValue) {
        setIsSurveyActive(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addQuestion = (q: Omit<Question, 'id'>) => {
    const newQ = { ...q, id: Date.now().toString() };
    setQuestions([...questions, newQ]);
  };

  const updateQuestion = (id: string, q: Partial<Question>) => {
    setQuestions(questions.map(item => item.id === id ? { ...item, ...q } : item));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(item => item.id !== id));
  };

  const submitSurvey = (answers: Record<string, string | string[]>) => {
    const newSubmission: Submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      answers
    };
    setSubmissions([...submissions, newSubmission]);
  };

  const setSurveyStatus = (status: boolean) => setIsSurveyActive(status);

  const setSurveyTitle = (title: string) => setSurveyTitleState(title);
  
  const updateAdminPassword = (newPassword: string) => setAdminPassword(newPassword);

  const login = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  const deleteSubmission = (id: string) => {
    setSubmissions(submissions.filter(sub => sub.id !== id));
  };

  const clearSubmissions = () => {
    setSubmissions([]);
  };

  return (
    <SurveyContext.Provider value={{
      questions, submissions, addQuestion, updateQuestion, deleteQuestion, submitSurvey, deleteSubmission, clearSubmissions, isAdmin, isSurveyActive, setSurveyStatus, surveyTitle, setSurveyTitle, updateAdminPassword, login, logout
    }}>
      {children}
    </SurveyContext.Provider>
  );
};
