import { Navigate, Route, Routes } from 'react-router-dom';
import WorkbenchPage from './pages/WorkbenchPage.jsx';
import OregonTrailPage from './pages/OregonTrailPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkbenchPage />} />
      <Route path="/oregon-trail" element={<OregonTrailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
