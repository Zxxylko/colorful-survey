import { useState } from 'react';
import { useSurvey } from '../context/useSurvey';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useSurvey();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="page-container">
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass p-8 p-12 rounded-lg w-100" 
        style={{ maxWidth: '440px', borderRadius: 'var(--radius-lg)' }}
      >
        <div className="text-center mb-10">
          <div className="mb-6 d-inline-block">
            <div className="p-4 rounded-full" style={{ background: 'var(--primary)', boxShadow: '0 0 30px var(--primary-glow)' }}>
              <Lock size={32} color="white" />
            </div>
          </div>
          <h2 className="fw-bold fs-2xl mb-2">Login Admin</h2>
          <p className="text-secondary">Gunakan kata sandi kontrol panel.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="d-block mb-3 fs-sm text-muted fw-bold uppercase" style={{ letterSpacing: '1.5px' }}>Password Sistem</label>
            <div className="position-relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input" 
                placeholder="Masukkan password admin..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                style={{ paddingRight: '3.5rem' }}
              />
              <button 
                type="button"
                className="position-absolute d-flex align-items-center justify-content-center"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  right: '0.5rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-secondary)',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-8 p-4 rounded-md d-flex align-items-center gap-3" 
              style={{ background: 'rgba(255, 23, 68, 0.05)', border: '1px solid rgba(255, 23, 68, 0.1)', color: 'var(--danger)' }}
            >
              <AlertCircle size={18} />
              <span className="fs-sm fw-semibold">{error}</span>
            </motion.div>
          )}

          <div className="d-flex flex-column gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn btn-primary w-100"
              style={{ padding: '1.1rem' }}
            >
              Masuk Sekarang
            </motion.button>
            
            <button 
              type="button" 
              className="btn btn-secondary w-100"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={18} /> Kembali ke Home
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
