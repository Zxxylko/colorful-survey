import { useState, useEffect } from 'react';
import { useSurvey } from '../context/useSurvey';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Star, Send, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Survey = () => {
  const { questions, submitSurvey, isSurveyActive, surveyTitle } = useSurvey();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isSurveyActive) {
      navigate('/');
    }
  }, [isSurveyActive, navigate]);

  const currentQuestion = questions[currentStep];

  const handleAnswer = (value: string | string[]) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleCheckbox = (option: string) => {
    const currentAnswers = (answers[currentQuestion.id] || []) as string[];
    if (currentAnswers.includes(option)) {
      handleAnswer(currentAnswers.filter((a) => a !== option));
    } else {
      handleAnswer([...currentAnswers, option]);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitSurvey(answers);
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const isQuestionAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.required) {
      if (currentQuestion.type === 'checkbox') return Array.isArray(answer) && answer.length > 0;
      if (currentQuestion.type === 'rating' || currentQuestion.type === 'multiple' || currentQuestion.type === 'dropdown') return !!answer;
      if (currentQuestion.type === 'text') return typeof answer === 'string' && answer.trim().length > 0;
    }
    return true;
  };

  if (questions.length === 0) {
    return (
      <div className="page-container">
        <div className="blob blob-1"></div>
        <div className="glass p-8 rounded-lg text-center">
          <h2 className="mb-6">Belum ada pertanyaan aktif.</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Kembali Ke Home</button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="page-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass p-12 text-center"
          style={{ maxWidth: '500px', width: '100%', borderRadius: 'var(--radius-lg)' }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto d-flex align-items-center justify-content-center"
              style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 200, 83, 0.1)' }}
            >
              <CheckCircle2 size={48} color="var(--success)" />
            </motion.div>
          </div>
          <h2 className="gradient-text mb-4 fs-xl fw-bold">Terima Kasih!</h2>
          <p className="text-secondary mb-12" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Kontribusi Anda sangat berharga bagi kami. Kami akan terus berusaha memberikan yang terbaik.
          </p>
          <button className="btn btn-primary w-100" onClick={() => navigate('/')}>
            Selesai
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ justifyContent: 'flex-start', paddingTop: '8vh' }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-3"></div>

      <div className="w-100" style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div className="mb-8 d-flex justify-content-between align-items-center gap-3">
          <button 
            className="btn btn-secondary flex-shrink-0" 
            style={{ width: '40px', height: '40px', padding: 0 }} 
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="fs-md fw-bold gradient-text text-truncate px-2" style={{ letterSpacing: '1px' }}>
            {surveyTitle}
          </div>
          <div className="fs-sm fw-semibold text-accent flex-shrink-0" style={{ letterSpacing: '1px' }}>
            {currentStep + 1} / {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12" style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div 
            className="h-100" 
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            style={{ 
              background: '#ffffff',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)'
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass p-8 p-12"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <div className="fs-sm fw-semibold text-muted mb-4 uppercase" style={{ letterSpacing: '2px' }}>
              Pertanyaan {currentStep + 1}
            </div>
            <h3 className="mb-12 fs-xl fw-bold" style={{ lineHeight: '1.4' }}>
              {currentQuestion.text}
              {currentQuestion.required && <span className="text-danger ml-2">*</span>}
            </h3>

            <div className="mb-12">
              {currentQuestion.type === 'text' && (
                <textarea 
                  className="input" 
                  rows={4} 
                  placeholder="Ketik jawaban Anda..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  style={{ resize: 'none' }}
                />
              )}

              {currentQuestion.type === 'multiple' && (
                <div className="d-flex flex-column gap-3">
                  {currentQuestion.options?.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id] === option;
                    return (
                      <button 
                        key={idx}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} text-left justify-content-start`}
                        onClick={() => handleAnswer(option)}
                        style={{ padding: '1rem 1.25rem' }}
                      >
                        <span 
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: isSelected ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)',
                            marginRight: '0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'checkbox' && (
                <div className="d-flex flex-column gap-3">
                  {currentQuestion.options?.map((option, idx) => {
                    const isSelected = (answers[currentQuestion.id] || []).includes(option);
                    return (
                      <button 
                        key={idx}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} text-left justify-content-start`}
                        onClick={() => handleCheckbox(option)}
                        style={{ padding: '1rem 1.25rem' }}
                      >
                        <div style={{ 
                          width: '18px', height: '18px', 
                          border: `1.5px solid ${isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`, 
                          borderRadius: '4px',
                          marginRight: '0.75rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isSelected ? 'white' : 'transparent'
                        }}>
                          {isSelected && <div style={{ width: '8px', height: '8px', background: '#000', borderRadius: '1px' }} />}
                        </div>
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'dropdown' && (
                <div className="position-relative">
                  <select 
                    className="input" 
                    value={answers[currentQuestion.id] || ''} 
                    onChange={(e) => handleAnswer(e.target.value)}
                    style={{ appearance: 'none', background: 'rgba(15, 23, 42, 0.6)' }}
                  >
                    <option value="" disabled style={{ background: '#1e1b4b', color: '#94a3b8' }}>Pilih opsi...</option>
                    {currentQuestion.options?.map((option, idx) => (
                      <option key={idx} value={option} style={{ background: '#1e1b4b' }}>{option}</option>
                    ))}
                  </select>
                  <div className="position-absolute" style={{ right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              )}

              {currentQuestion.type === 'rating' && (
                <div>
                  <div className="d-flex justify-content-between gap-2">
                    {Array.from({ length: currentQuestion.ratingMax || 5 }, (_, i) => i + 1).map((val) => {
                      const ratingValue = Number(answers[currentQuestion.id]);
                      const isSelected = ratingValue === val;
                      const isHighlighted = ratingValue >= val;
                      return (
                        <button 
                          key={val}
                          className={`btn rounded-lg flex-column gap-2 ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ height: '80px', flex: 1, position: 'relative' }}
                          onClick={() => handleAnswer(val.toString())}
                        >
                          <Star 
                            size={20} 
                            fill={isHighlighted ? (isSelected ? '#000' : 'rgba(255,255,255,1)') : 'transparent'} 
                            strokeWidth={isHighlighted ? 0 : 2}
                          />
                          <span className="fs-sm fw-bold">{val}</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Rating Labels */}
                  {currentQuestion.ratingLabels && Object.keys(currentQuestion.ratingLabels).length > 0 && (
                    <div className="d-flex justify-content-between mt-2" style={{ padding: '0 0.25rem' }}>
                      {Array.from({ length: currentQuestion.ratingMax || 5 }, (_, i) => i + 1).map((val) => {
                        const label = currentQuestion.ratingLabels?.[String(val)];
                        return (
                          <div key={val} style={{ flex: 1, textAlign: 'center' }}>
                            <span className="fs-sm text-muted" style={{ fontSize: '0.7rem' }}>
                              {label || ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn btn-primary w-100" 
              disabled={!isQuestionAnswered()}
              onClick={handleNext}
              style={{ padding: '1rem', opacity: isQuestionAnswered() ? 1 : 0.5 }}
            >
              {currentStep === questions.length - 1 ? (
                <span className="d-flex align-items-center gap-2">Kirim Survey <Send size={16} /></span>
              ) : 'Lanjutkan'}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Survey;
