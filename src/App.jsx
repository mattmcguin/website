import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SimplePage from './pages/SimplePage.jsx';
import WorkbenchPage from './pages/WorkbenchPage.jsx';

const developerModeStorageKey = 'developer_mode_enabled';

export default function App() {
  const [developerMode, setDeveloperMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(developerModeStorageKey) === 'true';
    } catch (_error) {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(developerModeStorageKey, developerMode ? 'true' : 'false');
    } catch (_error) {
      // Ignore storage errors and keep app functional.
    }
  }, [developerMode]);

  const sharedRouteElement = developerMode
    ? <WorkbenchPage onExitDeveloperMode={() => setDeveloperMode(false)} />
    : <SimplePage onEnterDeveloperMode={() => setDeveloperMode(true)} />;

  return (
    <Routes>
      <Route path="/" element={sharedRouteElement} />
      <Route path="/work/:slug" element={sharedRouteElement} />
      <Route path="/dev" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
