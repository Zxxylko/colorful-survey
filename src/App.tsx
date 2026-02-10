import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SurveyProvider } from './context/SurveyContext';
import { useSurvey } from './context/useSurvey';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Background from './components/Background';
import './index.css';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAdmin } = useSurvey();
  return isAdmin ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ToastProvider>
      <SurveyProvider>
        <Background />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </SurveyProvider>
    </ToastProvider>
  );
}

export default App;
