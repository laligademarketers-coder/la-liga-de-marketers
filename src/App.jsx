import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LaLiga from './LaLiga';
import Diagnostico from './pages/Diagnostico';
import DiagnosticoDashboard from './pages/DiagnosticoDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaLiga />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/dashboard-diagnosticos" element={<DiagnosticoDashboard />} />
      </Routes>
    </Router>
  );
}
