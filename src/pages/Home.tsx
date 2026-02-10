import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Layout, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSurvey } from '../context/useSurvey';

const Home = () => {
  const navigate = useNavigate();
  const { isSurveyActive, surveyTitle } = useSurvey();

  return (
    <div className="page-container">
      {/* Background Decor */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass p-8 p-12 text-center" 
        style={{ maxWidth: '600px', width: '100%', borderRadius: 'var(--radius-lg)' }}
      >
        <div className="d-flex justify-content-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-4 rounded-full" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid var(--glass-border)',
              display: 'inline-flex'
            }}
          >
            <Layout size={32} className="text-accent" />
          </motion.div>
        </div>

        <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
          <Sparkles size={16} className="text-warning" />
          <span className="fs-sm fw-semibold text-accent uppercase" style={{ letterSpacing: '3px' }}>
            {surveyTitle}
          </span>
        </div>

        <h1 className="fs-2xl fw-bold mb-6 gradient-text" style={{ lineHeight: '1.2' }}>
          Membangun Masa Depan <br /> Lewat Suara Anda
        </h1>
        
        <p className="text-secondary mb-12 mx-auto" style={{ fontSize: '1.1rem', maxWidth: '440px', lineHeight: '1.6' }}>
          Bantu kami memberikan layanan terbaik dengan memberikan umpan balik yang berharga. Hanya memerlukan waktu beberapa menit.
        </p>
        
        {!isSurveyActive && (
          <div className="mb-8 p-4 rounded-md d-flex align-items-center gap-3 justify-content-center" style={{ background: 'rgba(255, 23, 68, 0.05)', border: '1px solid rgba(255, 23, 68, 0.1)', color: 'var(--danger)' }}>
            <AlertCircle size={18} />
            <span className="fs-sm fw-semibold">Mohon maaf, survey saat ini sedang ditutup.</span>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          <motion.button 
            whileHover={isSurveyActive ? { scale: 1.02 } : {}}
            whileTap={isSurveyActive ? { scale: 0.98 } : {}}
            className="btn btn-primary" 
            style={{ padding: '1.1rem', opacity: isSurveyActive ? 1 : 0.5, cursor: isSurveyActive ? 'pointer' : 'not-allowed' }}
            onClick={() => isSurveyActive && navigate('/survey')}
            disabled={!isSurveyActive}
          >
            Mulai Survey <ArrowRight size={18} className="mt-1" />
          </motion.button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/login')}
          >
            Akses Panel Admin
          </button>
        </div>
      </motion.div>


      {/* Footer Info */}
      <footer className="mt-8 text-muted fs-sm" style={{ opacity: 0.5 }}>
        &copy; 2026 {surveyTitle}. Minimalist & Elegant Design.
      </footer>
    </div>
  );
};

export default Home;
