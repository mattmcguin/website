import { Navigate, Route, Routes } from 'react-router-dom';
import WorkbenchPage from './pages/WorkbenchPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkbenchPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
