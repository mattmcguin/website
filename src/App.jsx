import { Navigate, Route, Routes } from 'react-router-dom';
import Idea6 from './pages/Idea6.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Idea6 />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
