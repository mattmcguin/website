import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SimplePage from './pages/SimplePage.jsx';
import WorkbenchPage from './pages/WorkbenchPage.jsx';

const developerModeStorageKey = 'developer_mode_enabled';
const developerModeBackGuardKey = '__developer_mode_back_guard__';

function shouldArmDeveloperBackGuard() {
  if (typeof window === 'undefined') return false;

  const state = window.history.state;
  const historyIndex = typeof state?.idx === 'number' ? state.idx : null;
  if (historyIndex !== null && historyIndex > 0) {
    return false;
  }

  const referrer = document.referrer;
  if (!referrer) {
    return true;
  }

  try {
    const referrerOrigin = new URL(referrer).origin;
    return referrerOrigin !== window.location.origin;
  } catch (_error) {
    return true;
  }
}

export default function App() {
  const [developerMode, setDeveloperMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(developerModeStorageKey) === 'true';
    } catch (_error) {
      return false;
    }
  });
  const backGuardArmedRef = useRef(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(developerModeStorageKey, developerMode ? 'true' : 'false');
    } catch (_error) {
      // Ignore storage errors and keep app functional.
    }
  }, [developerMode]);

  useEffect(() => {
    if (!developerMode || typeof window === 'undefined') return;
    if (backGuardArmedRef.current) return;

    if (!shouldArmDeveloperBackGuard()) return;

    const currentState = window.history.state && typeof window.history.state === 'object'
      ? window.history.state
      : {};

    window.history.pushState(
      { ...currentState, [developerModeBackGuardKey]: true },
      '',
      window.location.href
    );
    backGuardArmedRef.current = true;
  }, [developerMode]);

  useEffect(() => {
    function onPopState(event) {
      if (!developerMode || !backGuardArmedRef.current) return;

      const nextState = event.state;
      const isBackGuardState = Boolean(
        nextState && typeof nextState === 'object' && nextState[developerModeBackGuardKey]
      );
      if (isBackGuardState) return;

      backGuardArmedRef.current = false;
      setDeveloperMode(false);
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
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
