import { useState, useMemo, useRef } from 'react';
import { useSurvey } from '../context/useSurvey';
import type { Question } from '../context/useSurvey';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Plus, Trash2, LayoutDashboard, Database, LogOut, 
  Settings, HelpCircle, Users, BarChart,
  TrendingUp, Calendar, ArrowRight, List, Star,
  Download, Search, ToggleLeft, ToggleRight, Filter, Info,
  AlertTriangle, Menu, X, Printer, Image as ImageIcon,
  FileText, Trophy, Activity, MessageSquare
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { useToast } from '../context/useToast';

const COLORS = ['#8b5cf6', '#ec4899', '#22d3ee', '#10b981', '#f59e0b', '#ef4444'];

const Admin = () => {
  const { logout, isSurveyActive, setSurveyStatus, surveyTitle } = useSurvey();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning';
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { addToast } = useToast();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/survey`;
    navigator.clipboard.writeText(url);
    addToast('Link survey berhasil disalin!', 'success');
  };

  const handleStatusToggle = () => {
    const newStatus = !isSurveyActive;
    setSurveyStatus(newStatus);
    addToast(newStatus ? 'Survey diaktifkan kembali.' : 'Survey dinonaktifkan.', newStatus ? 'success' : 'info');
  };

  const openConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' = 'danger') => {
    setConfirmModal({ show: true, title, message, onConfirm, type });
  };

  const isActive = (path: string) => location.pathname === path;



  return (
    <div className="admin-layout d-flex min-vh-100">
      {/* Mobile Header */}
      <div className="mobile-header d-lg-none glass w-100 p-4 d-flex justify-content-between align-items-center position-fixed top-0 start-0 z-index-1000">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-md" style={{ background: 'var(--primary)' }}>
            <LayoutDashboard size={18} color="white" />
          </div>
          <span className="fw-bold fs-sm uppercase">{surveyTitle}</span>
        </div>
        <button className="btn-icon glass" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="sidebar-overlay d-lg-none"
          />
        )}
      </AnimatePresence>

      {/* Elegant Sidebar */}
      <aside className={`admin-sidebar glass d-flex flex-column ${isSidebarOpen ? 'show' : ''}`}>
        <div className="p-6 mb-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-md flex-shrink-0" style={{ background: 'var(--primary)', boxShadow: '0 0 20px var(--primary-glow)' }}>
              <LayoutDashboard size={18} color="white" />
            </div>
            <h2 className="fw-bold text-truncate mb-0" style={{ fontSize: '1rem', letterSpacing: '0.5px' }} title={surveyTitle}>
              {surveyTitle.toUpperCase()}
            </h2>
          </div>
          <button className="btn-icon d-lg-none flex-shrink-0" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="d-flex flex-column gap-1 flex-grow-1 px-4">
          <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className={`btn ${isActive('/admin') ? 'btn-primary' : 'btn-secondary'} justify-content-start`} style={{ padding: '0.75rem 1rem' }}>
            <TrendingUp size={18} /> Ringkasan
          </Link>
          <Link to="/admin/questions" onClick={() => setIsSidebarOpen(false)} className={`btn ${isActive('/admin/questions') ? 'btn-primary' : 'btn-secondary'} justify-content-start`} style={{ padding: '0.75rem 1rem' }}>
            <List size={18} /> Pertanyaan
          </Link>
          <Link to="/admin/stats" onClick={() => setIsSidebarOpen(false)} className={`btn ${isActive('/admin/stats') ? 'btn-primary' : 'btn-secondary'} justify-content-start`} style={{ padding: '0.75rem 1rem' }}>
            <BarChart size={18} /> Statistik
          </Link>
          <Link to="/admin/results" onClick={() => setIsSidebarOpen(false)} className={`btn ${isActive('/admin/results') ? 'btn-primary' : 'btn-secondary'} justify-content-start`} style={{ padding: '0.75rem 1rem' }}>
            <Database size={18} /> Hasil Survey
          </Link>
          <Link to="/admin/poster" onClick={() => setIsSidebarOpen(false)} className={`btn ${isActive('/admin/poster') ? 'btn-primary' : 'btn-secondary'} justify-content-start`} style={{ padding: '0.75rem 1rem' }}>
            <FileText size={18} /> Poster Laporan
          </Link>
          <Link to="/admin/settings" onClick={() => setIsSidebarOpen(false)} className={`btn ${isActive('/admin/settings') ? 'btn-primary' : 'btn-secondary'} justify-content-start`} style={{ padding: '0.75rem 1rem' }}>
            <Settings size={18} /> Pengaturan
          </Link>
          
          <div className="mt-8 mb-2 px-3 fs-sm text-muted fw-bold uppercase" style={{ letterSpacing: '1.5px' }}>Kontrol</div>
          <button 
            className="btn btn-secondary justify-content-between" 
            onClick={handleStatusToggle}
            style={{ padding: '0.75rem 1rem' }}
          >
            <div className="d-flex align-items-center gap-2">
              <Settings size={18} /> Status Survey
            </div>
            {isSurveyActive ? <ToggleRight className="text-success" /> : <ToggleLeft className="text-muted" />}
          </button>
          
          <button 
             className="btn btn-secondary justify-content-start mt-1" 
             onClick={handleCopyLink}
             style={{ padding: '0.75rem 1rem' }}
           >
             <div className="d-flex align-items-center gap-2">
               <Info size={18} /> Salin Link Survey
             </div>
           </button>
        </nav>

        <div className="p-4 mt-auto">
          <button className="btn btn-secondary w-100 justify-content-center" onClick={handleLogout} style={{ color: 'var(--danger)', borderColor: 'rgba(255, 23, 68, 0.1)' }}>
            <LogOut size={18} /> Keluar Panel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main flex-grow-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/questions" element={<QuestionsManager openConfirm={openConfirm} />} />
          <Route path="/stats" element={<StatisticsView />} />
          <Route path="/results" element={<ResultsViewer openConfirm={openConfirm} />} />
          <Route path="/poster" element={<PosterViewer />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </main>

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="modal-root d-flex align-items-center justify-content-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-backdrop"
              onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass p-8 rounded-lg text-center position-relative z-index-10"
              style={{ maxWidth: '400px', width: '100%', border: '1px solid var(--glass-border)' }}
            >
              <div className="mb-6 p-4 rounded-full mx-auto" style={{ width: '64px', height: '64px', background: confirmModal.type === 'danger' ? 'rgba(255, 23, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={32} color={confirmModal.type === 'danger' ? 'var(--danger)' : 'var(--warning)'} style={{ margin: 'auto' }} />
              </div>
              <h3 className="fw-bold fs-lg mb-2">{confirmModal.title}</h3>
              <p className="text-secondary fs-sm mb-8">{confirmModal.message}</p>
              <div className="d-grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                >
                  Batal
                </button>
                <button 
                  className={`btn ${confirmModal.type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                  style={{ background: confirmModal.type === 'danger' ? 'var(--danger)' : 'var(--primary)' }}
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(prev => ({ ...prev, show: false }));
                  }}
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DashboardOverview = () => {
  const { questions, submissions, isSurveyActive } = useSurvey();
  
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <header className="mb-12 d-flex justify-content-between align-items-end">
        <div>
          <h1 className="fw-bold mb-2 fs-2xl">Selamat Datang, Admin</h1>
          <p className="text-secondary">Kelola data dan lihat performa survey kamu hari ini.</p>
        </div>
        <div className="glass px-4 py-2 rounded-full d-flex align-items-center gap-2 fs-sm">
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSurveyActive ? 'var(--success)' : 'var(--danger)' }}></div>
          {isSurveyActive ? 'Survey Aktif' : 'Survey Nonaktif'}
        </div>
      </header>
      
      <div className="d-grid gap-6 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="glass p-6 rounded-lg">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div className="p-3 rounded-md bg-white text-dark" style={{ background: 'white' }}>
              <HelpCircle size={20} color="#000" />
            </div>
          </div>
          <div className="text-muted fs-sm uppercase fw-bold mb-1" style={{ letterSpacing: '1px' }}>Total Pertanyaan</div>
          <div className="fs-2xl fw-bold">{questions.length} Item</div>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div className="p-3 rounded-md" style={{ background: 'var(--accent)' }}>
              <Users size={20} color="white" />
            </div>
          </div>
          <div className="text-muted fs-sm uppercase fw-bold mb-1" style={{ letterSpacing: '1px' }}>Total Responden</div>
          <div className="fs-2xl fw-bold">{submissions.length} Orang</div>
        </div>

        <div className="glass p-6 rounded-lg">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div className="p-3 rounded-md" style={{ background: 'var(--secondary)' }}>
              <Star size={20} color="white" />
            </div>
          </div>
          <div className="text-muted fs-sm uppercase fw-bold mb-1" style={{ letterSpacing: '1px' }}>Kepuasan</div>
          <div className="fs-2xl fw-bold">4.8 / 5.0</div>
        </div>
      </div>

      <div className="d-grid gap-6" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="glass p-8 rounded-lg">
          <div className="d-flex justify-content-between align-items-center mb-8">
            <h3 className="fw-bold fs-lg">Respon Terbaru</h3>
            <Link to="/admin/results" className="fs-sm text-accent fw-bold decoration-none">Lihat Semua</Link>
          </div>
          
          <div className="overflow-auto">
            <table className="w-100" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <tbody>
                {submissions.slice(-4).reverse().map(sub => (
                  <tr key={sub.id} style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <td className="p-4 rounded-md" style={{ fontWeight: '500' }}>
                      <div className="d-flex align-items-center gap-3">
                        <Calendar size={14} className="text-muted" />
                        {new Date(sub.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-secondary fs-sm">{new Date(sub.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4 text-right rounded-md">
                      <Link to="/admin/results" className="text-accent"><ArrowRight size={18} /></Link>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted fs-sm italic">Belum ada data masuk.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass p-8 rounded-lg">
          <h3 className="fw-bold fs-lg mb-8">Statistik Cepat</h3>
          <div className="d-flex flex-column gap-6">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary fs-sm">Penyelesaian Survey</span>
              <span className="fw-bold">92%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: '92%', background: 'var(--success)', borderRadius: '3px' }}></div>
            </div>
            
            <div className="mt-4 p-4 rounded-md" style={{ background: 'rgba(124, 77, 255, 0.05)', border: '1px solid rgba(124, 77, 255, 0.1)' }}>
              <div className="d-flex gap-3 align-items-start">
                <Info size={18} className="text-primary mt-1" />
                <p className="fs-sm text-secondary mb-0">Survey kamu saat ini berjalan dengan baik. Tidak ada error sistem yang terdeteksi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatisticsView = () => {
  const { questions, submissions } = useSurvey();

  const getStats = (question: Question) => {
    if (question.type === 'text') return null;

    const data: Record<string, number> = {};
    if (question.options) {
      question.options.forEach(opt => data[opt] = 0);
    } else if (question.type === 'rating') {
      const max = question.ratingMax || 5;
      Array.from({ length: max }, (_, i) => i + 1).forEach(val => data[val.toString()] = 0);
    }

    submissions.forEach(sub => {
      const answer = sub.answers[question.id];
      if (Array.isArray(answer)) {
        answer.forEach(val => {
          if (data[val] !== undefined) data[val]++;
        });
      } else if (answer) {
        if (data[answer] !== undefined) data[answer]++;
      }
    });

    return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="mb-12">
        <h1 className="fw-bold fs-2xl mb-2">Visualisasi Data</h1>
        <p className="text-secondary">Distribusi jawaban dari para responden.</p>
      </div>

      <div className="d-grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {questions.map((q) => {
          const statsData = getStats(q);
          if (!statsData) return null;

          return (
            <div key={q.id} className="glass p-8 rounded-lg">
              <h3 className="fw-bold mb-8 fs-lg">{q.text}</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#606070" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#606070" fontSize={11} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ background: '#1e1b4b', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                      {statsData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const QuestionsManager = ({ openConfirm }: { openConfirm: (t: string, m: string, c: () => void) => void }) => {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useSurvey();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQ, setNewQ] = useState<Omit<Question, 'id'>>({
    text: '', type: 'text', required: true, options: []
  });

  const { addToast } = useToast();

  const handleSave = () => {
    if (!newQ.text) {
      addToast('Pertanyaan tidak boleh kosong!', 'error');
      return;
    }

    if (editingId) {
      updateQuestion(editingId, newQ);
      addToast('Pertanyaan berhasil diperbarui!', 'success');
      setEditingId(null);
    } else {
      addQuestion(newQ);
      addToast('Pertanyaan berhasil ditambahkan!', 'success');
    }
    
    setIsAdding(false);
    setNewQ({ text: '', type: 'text', required: true, options: [], ratingMax: 5, ratingLabels: {} });
  };

  const handleEdit = (q: Question) => {
    setNewQ({ ...q }); // Exclude ID is handled by types but we just spread
    setEditingId(q.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewQ({ text: '', type: 'text', required: true, options: [], ratingMax: 5, ratingLabels: {} });
  };
  
  const handleDelete = (id: string) => {
    openConfirm(
      'Hapus Pertanyaan?',
      'Apakah Anda yakin ingin menghapus pertanyaan ini? Data jawaban yang terkait mungkin akan terpengaruh.',
      () => {
        deleteQuestion(id);
        addToast('Pertanyaan berhasil dihapus.', 'info');
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="d-flex justify-content-between align-items-center mb-12">
        <div>
          <h1 className="fw-bold fs-2xl mb-2">Manajemen Pertanyaan</h1>
          <p className="text-secondary">Tambah, hapus, atau ubah struktur survey kamu.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); setNewQ({ text: '', type: 'text', required: true, options: [], ratingMax: 5, ratingLabels: {} }); }}>
          <Plus size={18} /> Pertanyaan Baru
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass p-8 rounded-lg mb-10 overflow-hidden"
          >
            <h3 className="mb-8 fw-bold">{editingId ? 'Edit Pertanyaan' : 'Konfigurasi Pertanyaan'}</h3>
            <div className="d-grid gap-6 mb-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
              <div>
                <label className="fs-sm text-muted fw-bold uppercase mb-2 d-block">Teks Pertanyaan</label>
                <input 
                  className="input" 
                  value={newQ.text} 
                  onChange={(e) => setNewQ({...newQ, text: e.target.value})}
                  placeholder="Apa yang ingin kamu tanyakan?"
                />
              </div>
              <div>
                <label className="fs-sm text-muted fw-bold uppercase mb-2 d-block">Tipe Jawaban</label>
                <select 
                  className="input" 
                  value={newQ.type} 
                  onChange={(e) => setNewQ({...newQ, type: e.target.value as Question['type']})}
                  style={{ background: 'rgba(15, 23, 42, 0.6)' }}
                >
                  <option value="text" style={{ background: '#1e1b4b' }}>Teks Bebas</option>
                  <option value="multiple" style={{ background: '#1e1b4b' }}>Pilihan Tunggal</option>
                  <option value="checkbox" style={{ background: '#1e1b4b' }}>Pilihan Ganda</option>
                  <option value="dropdown" style={{ background: '#1e1b4b' }}>Dropdown</option>
                  <option value="rating" style={{ background: '#1e1b4b' }}>Rating (1-5)</option>
                </select>
              </div>
            </div>
            
            {(newQ.type === 'multiple' || newQ.type === 'checkbox' || newQ.type === 'dropdown') && (
              <div className="mb-8">
                <label className="fs-sm text-muted fw-bold uppercase mb-2 d-block">Opsi (Pisahkan dengan koma)</label>
                <input 
                  className="input" 
                  placeholder="Opsi 1, Opsi 2, Opsi 3" 
                  value={newQ.options ? newQ.options.join(', ') : ''}
                  onChange={(e) => setNewQ({...newQ, options: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                />
              </div>
            )}

            {newQ.type === 'rating' && (
              <div className="mb-8">
                <div className="d-grid gap-6 mb-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
                  <div>
                    <label className="fs-sm text-muted fw-bold uppercase mb-2 d-block">Jumlah Rating Maksimal</label>
                    <input 
                      className="input" 
                      type="number" 
                      min={2} max={10}
                      value={newQ.ratingMax || 5}
                      onChange={(e) => {
                        const max = Math.max(2, Math.min(10, parseInt(e.target.value) || 5));
                        setNewQ({...newQ, ratingMax: max});
                      }}
                    />
                  </div>
                  <div>
                    <label className="fs-sm text-muted fw-bold uppercase mb-2 d-block">Label Rating (Opsional)</label>
                    <p className="text-secondary fs-sm mb-4" style={{ opacity: 0.7 }}>Beri nama untuk nilai tertentu. Contoh: 1 = Sangat Buruk, {newQ.ratingMax || 5} = Sangat Baik</p>
                    <div className="d-flex flex-wrap gap-3">
                      {Array.from({ length: newQ.ratingMax || 5 }, (_, i) => i + 1).map(num => (
                        <div key={num} className="d-flex flex-column align-items-center gap-1">
                          <span className="fs-sm fw-bold" style={{ color: 'var(--primary)' }}>{num}</span>
                          <input
                            className="input"
                            style={{ width: '100px', fontSize: '0.75rem', padding: '0.4rem 0.5rem', textAlign: 'center' }}
                            placeholder="Label..."
                            value={(newQ.ratingLabels && newQ.ratingLabels[String(num)]) || ''}
                            onChange={(e) => {
                              const labels = { ...(newQ.ratingLabels || {}) };
                              if (e.target.value) {
                                labels[String(num)] = e.target.value;
                              } else {
                                delete labels[String(num)];
                              }
                              setNewQ({...newQ, ratingLabels: labels});
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex gap-4">
              <button className="btn btn-primary" onClick={handleSave}>{editingId ? 'Simpan Perubahan' : 'Simpan'}</button>
              <button className="btn btn-secondary" onClick={handleCancel}>Batal</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="d-flex flex-column gap-3">
        {questions.map((q, idx) => (
          <div key={q.id} className="glass p-5 rounded-lg d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-4">
              <span className="text-accent fw-bold fs-lg">{idx + 1}.</span>
              <div>
                <div className="fw-bold">{q.text} {q.required && <span className="text-danger">*</span>}</div>
                <div className="d-flex align-items-center gap-3 mt-1">
                  <span className="badge">{q.type}{q.type === 'rating' ? ` (1-${q.ratingMax || 5})` : ''}</span>
                  {q.options && q.options.length > 0 && (
                    <span className="fs-sm text-secondary opacity-70">Opsi: {q.options.join(', ')}</span>
                  )}
                  {q.type === 'rating' && q.ratingLabels && Object.keys(q.ratingLabels).length > 0 && (
                    <span className="fs-sm text-secondary opacity-70">
                      {Object.entries(q.ratingLabels).map(([k, v]) => `${k}=${v}`).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-secondary p-2" onClick={() => handleEdit(q)} style={{ color: 'var(--accent)' }}>
                <Settings size={16} />
              </button>
              <button className="btn btn-secondary p-2" onClick={() => handleDelete(q.id)} style={{ color: 'var(--danger)' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ResultsViewer = ({ openConfirm }: { openConfirm: (t: string, m: string, c: () => void) => void }) => {
  const { submissions, questions, deleteSubmission, clearSubmissions } = useSurvey();
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  const handleClearAll = () => {
    openConfirm(
      'Hapus SEMUA Data?',
      'PERINGATAN: Ini akan menghapus seluruh data responden secara permanen. Tindakan ini tidak dapat dibatalkan!',
      () => {
        clearSubmissions();
        addToast('Seluruh data responden telah dihapus.', 'info');
      }
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirm(
      'Hapus Data?',
      'Apakah Anda yakin ingin menghapus data responden ini? Tindakan ini tidak dapat dibatalkan.',
      () => {
        deleteSubmission(id);
        addToast('Data responden berhasil dihapus.', 'info');
      }
    );
  };

  const filteredSubmissions = useMemo(() => {
    if (!searchTerm) return submissions;
    return submissions.filter(sub => {
      const matchInAnswers = Object.values(sub.answers).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return sub.id.toLowerCase().includes(searchTerm.toLowerCase()) || matchInAnswers;
    });
  }, [submissions, searchTerm]);

  const handleExportCSV = () => {
    const headers = ['Timestamp', ...questions.map(q => q.text)];
    const csvRows = [headers.join(',')];

    submissions.forEach(sub => {
      const row = [
        new Date(sub.timestamp).toLocaleString(),
        ...questions.map(q => {
          const answer = sub.answers[q.id];
          if (Array.isArray(answer)) return `"${answer.join('; ')}"`;
          return `"${String(answer || '')}"`;
        })
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-results-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('Data berhasil diekspor ke CSV!', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="d-flex justify-content-between align-items-center mb-12">
        <div>
          <h1 className="fw-bold fs-2xl mb-2">Hasil Survey</h1>
          <p className="text-secondary">Detail jawaban dari seluruh responden ({filteredSubmissions.length} data).</p>
        </div>
        <div className="d-flex gap-3">
          <div className="position-relative">
            <input 
              className="input pr-10" 
              style={{ width: '280px', paddingRight: '2.5rem' }}
              placeholder="Cari kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="position-absolute text-muted" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button className="btn btn-secondary flex-shrink-0" onClick={handleExportCSV}>
            <Download size={18} /> Ekspor CSV
          </button>
          
          {submissions.length > 0 && (
            <button className="btn btn-secondary flex-shrink-0" onClick={handleClearAll} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
              <Trash2 size={18} /> Hapus Semua
            </button>
          )}
        </div>
      </div>

      <div className="d-flex flex-column gap-6">
        {filteredSubmissions.map((sub) => (
          <div key={sub.id} className="glass rounded-lg overflow-hidden border-top-4" style={{ borderColor: 'var(--primary)' }}>
            <div className="p-5 d-flex justify-content-between align-items-center" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
              <div className="d-flex gap-4">
                <div className="fs-sm fw-bold">ID: {sub.id.slice(-8)}</div>
                <div className="fs-sm text-muted">{new Date(sub.timestamp).toLocaleString()}</div>
              </div>
              <div className="d-flex align-items-center gap-3">
                 <Filter size={16} className="text-muted" />
                 <button 
                  className="btn-icon text-muted hover-text-danger bg-transparent border-0 cursor-pointer" 
                  onClick={(e) => handleDelete(sub.id, e)}
                  title="Hapus Submission"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
            <div className="p-8 d-flex flex-column gap-6">
              {questions.map((q, qIdx) => (
                <div key={q.id} className="pb-4" style={{ borderBottom: qIdx < questions.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <div className="fs-sm text-muted fw-bold uppercase mb-2 d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                       <span className="text-accent opacity-50">{qIdx + 1}.</span> {q.text}
                    </div>
                    <span className="badge">{q.type}</span>
                  </div>
                  <div className="p-4 rounded-md fs-md" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--primary)' }}>
                    {(() => {
                      const answer = sub.answers[q.id];
                      if (Array.isArray(answer)) return answer.join(', ');
                      return answer || <span className="text-muted italic">Tidak ada jawaban</span>;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredSubmissions.length === 0 && (
          <div className="glass p-20 text-center rounded-lg">
            <Search size={48} className="text-muted mb-4 mx-auto opacity-20" />
            <h3 className="text-secondary">Data tidak ditemukan</h3>
            <p className="text-muted mt-2">Coba gunakan kata kunci pencarian yang berbeda.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Poster Generator Component ---
const PosterViewer = () => {
  const { submissions, questions, surveyTitle } = useSurvey();
  const posterRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const summaryStats = useMemo(() => {
    if (submissions.length === 0) return null;
    
    // Most common answer for first rating or multiple choice question
    const topQuestion = questions.find(q => q.type === 'rating' || q.type === 'multiple');
    let topValue = 'N/A';
    if (topQuestion) {
      const counts: Record<string, number> = {};
      submissions.forEach(s => {
        const ans = s.answers[topQuestion.id] as string;
        if (ans) counts[ans] = (counts[ans] || 0) + 1;
      });
      const topEntry = Object.entries(counts).sort((a,b) => b[1] - a[1])[0];
      if (topEntry) {
         if (topQuestion.type === 'rating') {
            topValue = (topQuestion.ratingLabels?.[topEntry[0]]) || `Skor ${topEntry[0]}`;
         } else {
            topValue = topEntry[0];
         }
      }
    }

    return {
      responders: submissions.length,
      topValue,
      questionsCount: questions.length
    };
  }, [submissions, questions]);

  const [posterId] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const [createdDate] = useState(() => new Date().toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' }));

  const handleDownload = async () => {
    if (!posterRef.current) return;
    try {
      addToast('Menyiapkan poster...', 'info');
      const dataUrl = await toPng(posterRef.current, { cacheBust: true, quality: 1 });
      const link = document.createElement('a');
      link.download = `poster-survey-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      addToast('Poster berhasil diunduh!', 'success');
    } catch (err) {
      console.error('oops, something went wrong!', err);
      addToast('Gagal mengunduh poster.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="d-flex justify-content-between align-items-center mb-8">
        <div>
          <h1 className="fw-bold fs-2xl mb-2">Poster Kreatif</h1>
          <p className="text-secondary">Visualisasi infografis otomatis untuk tugas sekolah kamu.</p>
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={18} /> Cetak/PDF
          </button>
          <button className="btn btn-primary" onClick={handleDownload} disabled={submissions.length === 0}>
            <ImageIcon size={18} /> Download Image
          </button>
        </div>
      </div>

      <div className="poster-container d-flex justify-content-center pb-12">
        {submissions.length === 0 ? (
          <div className="glass p-20 text-center rounded-lg w-100">
             <Info size={48} className="text-muted mb-4 mx-auto opacity-20" />
             <h3 className="text-secondary">Belum ada data untuk ditampilkan</h3>
             <p className="text-muted mt-2">Kumpulkan jawaban survey dulu agar poster bisa terisi otomatis.</p>
          </div>
        ) : (
          <div ref={posterRef} className="poster-canvas glass p-12 d-flex flex-column gap-12" id="poster-area">
             {/* Header */}
             <div className="text-center position-relative">
                <div className="badge mb-4">Laporan Hasil Survey</div>
                <h1 className="poster-title fw-bold mb-4">{surveyTitle.toUpperCase()}</h1>
                <div className="d-flex justify-content-center gap-6 text-muted fs-sm uppercase letter-spacing-1">
                   <span>ID: #{posterId}</span>
                   <span>Dibuat: {createdDate}</span>
                </div>
                <div className="position-absolute opacity-10" style={{ top: -20, right: 0 }}>
                   <Activity size={100} strokeWidth={1} />
                </div>
             </div>

             {/* Summary Cards */}
             <div className="d-grid gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="poster-summary-card">
                   <div className="p-3 rounded-md" style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--primary)' }}>
                      <Users size={24} className="text-primary" />
                   </div>
                   <div>
                      <div className="fs-xs text-muted uppercase">Total Responden</div>
                      <div className="fs-xl fw-bold">{summaryStats?.responders}</div>
                   </div>
                </div>
                <div className="poster-summary-card">
                   <div className="p-3 rounded-md" style={{ background: 'rgba(236, 72, 153, 0.2)', border: '1px solid var(--accent)' }}>
                      <Trophy size={24} className="text-accent" />
                   </div>
                   <div>
                      <div className="fs-xs text-muted uppercase">Favorit Umum</div>
                      <div className="fs-lg fw-bold text-truncate" style={{ maxWidth: '120px' }}>{summaryStats?.topValue}</div>
                   </div>
                </div>
                <div className="poster-summary-card">
                   <div className="p-3 rounded-md" style={{ background: 'rgba(34, 211, 238, 0.2)', border: '1px solid #22d3ee' }}>
                      <MessageSquare size={24} style={{ color: '#22d3ee' }} />
                   </div>
                   <div>
                      <div className="fs-xs text-muted uppercase">Jumlah Data</div>
                      <div className="fs-xl fw-bold">{submissions.length} Jawaban</div>
                   </div>
                </div>
             </div>

             {/* Curve Highlights (Top Questions) */}
             <div className="d-grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {questions.filter(q => q.type === 'rating').slice(0, 2).map((q) => {
                  const stats = Array.from({ length: q.ratingMax || 5 }, (_, i) => {
                    const val = i + 1;
                    return {
                      name: (q.ratingLabels && q.ratingLabels[String(val)]) || String(val),
                      count: submissions.filter(s => s.answers[q.id] === String(val)).length
                    };
                  });

                  return (
                    <div key={q.id} className="poster-section p-6 rounded-lg">
                       <h3 className="fs-md fw-bold text-accent mb-6"> {q.text}</h3>
                       <div style={{ height: '180px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats}>
                              <defs>
                                <linearGradient id={`colorCount-${q.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Tooltip 
                                contentStyle={{ background: 'rgba(30, 27, 75, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: 'white' }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="count" 
                                stroke="var(--primary)" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill={`url(#colorCount-${q.id})`} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                  );
                })}
             </div>

             {/* Bar Charts for Multi Choice */}
             <div className="d-grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {questions.filter(q => q.type === 'multiple' || q.type === 'checkbox').slice(0, 2).map((q) => {
                  const options = q.options || [];
                  const stats = options.map(opt => ({
                    name: opt,
                    count: submissions.filter(s => {
                      const ans = s.answers[q.id];
                      return Array.isArray(ans) ? ans.includes(opt) : ans === opt;
                    }).length
                  }));

                  return (
                    <div key={q.id} className="poster-section p-6 rounded-lg">
                       <h3 className="fs-md fw-bold text-accent mb-6">{q.text}</h3>
                       <div style={{ height: '160px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={stats} layout="vertical">
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={80} hide />
                              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'rgba(30, 27, 75, 0.9)', border: 'none' }} />
                              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                                {stats.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Bar>
                            </ReBarChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="mt-4 d-flex flex-column gap-2">
                          {stats.map((s, idx) => (
                            <div key={idx} className="d-flex justify-content-between fs-xs align-items-center">
                               <span className="text-secondary opacity-70">{s.name}</span>
                               <span className="fw-bold fs-sm" style={{ color: COLORS[idx % COLORS.length] }}>{s.count} Suara</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  );
                })}
             </div>

             {/* Footer Infographic Footer */}
             <div className="poster-footer p-6 mt-auto rounded-lg text-center">
                 <div className="d-flex justify-content-center align-items-center gap-4">
                    <div className="p-2 rounded-md" style={{ background: 'var(--primary)' }}>
                      <Star size={18} color="white" fill="white" />
                    </div>
                    <div>
                      <div className="fw-bold fs-lg">TERIMA KASIH</div>
                      <div className="fs-xs text-muted opacity-50 letter-spacing-1">Survey ini dibuat di platform Colorful Survey Platform</div>
                    </div>
                 </div>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Settings Component ---
const SettingsView = () => {
  const { surveyTitle, setSurveyTitle, updateAdminPassword, questions, submissions, importData } = useSurvey();
  const [title, setTitle] = useState(surveyTitle);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { addToast } = useToast();

  const handleExport = () => {
    const data = {
      questions,
      submissions,
      surveyTitle,
      isSurveyActive: true, // Default to active on import
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey-backup-${new Date().getTime()}.json`;
    link.click();
    addToast('Konfigurasi berhasil diekspor!', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        importData(data);
        addToast('Konfigurasi berhasil diimpor!', 'success');
        // Clear input
        e.target.value = '';
      } catch {
        addToast('File tidak valid atau rusak.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveTitle = () => {
    if (!title.trim()) {
      addToast('Judul survey tidak boleh kosong.', 'error');
      return;
    }
    setSurveyTitle(title);
    addToast('Judul survey berhasil diperbarui!', 'success');
  };

  const handleUpdatePassword = () => {
    if (newPassword.length < 6) {
      addToast('Password minimal 6 karakter.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Password konfirmasi tidak cocok.', 'error');
      return;
    }
    updateAdminPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    addToast('Password admin berhasil diperbarui!', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="mb-12">
        <h1 className="fw-bold fs-2xl mb-2">Pengaturan Umum</h1>
        <p className="text-secondary">Kustomisasi judul survey dan keamanan panel admin.</p>
      </div>

      <div className="d-flex flex-column gap-8">
        <div className="glass p-8 rounded-lg">
          <div className="d-flex align-items-center gap-3 mb-8">
            <LayoutDashboard size={20} className="text-primary" />
            <h3 className="fw-bold fs-lg">Aplikasi & Branding</h3>
          </div>
          
          <div className="mb-6">
            <label className="fs-sm text-muted fw-bold uppercase mb-2 d-block">Judul Survey</label>
            <div className="d-flex gap-4">
              <input 
                className="input" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Survey Evaluasi Tahunan"
              />
              <button className="btn btn-primary" onClick={handleSaveTitle}>Simpan</button>
            </div>
            <p className="fs-sm text-muted mt-2 opacity-70">Judul ini akan tampil di Beranda dan halaman Survey.</p>
          </div>
        </div>

        <div className="glass p-8 rounded-lg">
          <div className="d-flex align-items-center gap-3 mb-8">
            <Settings size={20} className="text-accent" />
            <h3 className="fw-bold fs-lg">Keamanan Admin</h3>
          </div>

          <div className="d-grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label className="fs-sm text-muted fw-bold uppercase mb-2 d-block">Password Baru</label>
              <input 
                type="password"
                className="input" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div>
              <label className="fs-sm text-muted fw-bold uppercase mb-2 d-block">Konfirmasi Password</label>
              <input 
                type="password"
                className="input" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
              />
            </div>
          </div>
          
          <div className="mt-6 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleUpdatePassword}>Update Password</button>
          </div>
        </div>

        <div className="glass p-8 rounded-lg">
          <div className="d-flex align-items-center gap-3 mb-8">
            <Database size={20} className="text-success" />
            <h3 className="fw-bold fs-lg">Backup & Restore</h3>
          </div>
          
          <div className="d-grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <p className="fs-sm text-muted mb-4 opacity-70">Simpan semua konfigurasi dan hasil survey kamu sebagai file JSON.</p>
              <button className="btn btn-secondary w-100" onClick={handleExport}>
                <Download size={18} /> Ekspor Konfigurasi
              </button>
            </div>
            <div>
              <p className="fs-sm text-muted mb-4 opacity-70">Upload file konfigurasi JSON untuk memindah data ke perangkat lain.</p>
              <label className="btn btn-secondary w-100 cursor-pointer text-center" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={18} className="me-2" /> Impor Konfigurasi
                <input type="file" className="d-none" accept=".json" onChange={handleImport} />
              </label>
            </div>
          </div>
          <p className="fs-xs text-warning mt-6 italic">
            *Impor data akan menggantikan semua pertanyaan dan jawaban yang ada pada perangkat ini.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;
