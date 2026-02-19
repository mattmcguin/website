import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityBar from '../features/workbench/components/ActivityBar.jsx';
import StatusBar from '../features/workbench/components/StatusBar.jsx';
import TopBar from '../features/workbench/components/TopBar.jsx';
import { githubUsername } from '../features/workbench/constants/workbenchData.js';
import TrailSidebar from '../features/oregonTrail/components/TrailSidebar.jsx';
import TrailTerminal from '../features/oregonTrail/components/TrailTerminal.jsx';
import { useTrailGame } from '../features/oregonTrail/hooks/useTrailGame.js';

export default function OregonTrailPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    state,
    transcript,
    leaderboard,
    isStreaming,
    error,
    awaitingName,
    scoreSaved,
    gameOver,
    scorePreview,
    submitCommand,
    submitLeaderboardName,
    startNewGame
  } = useTrailGame();

  const language = state?.flags?.won
    ? 'Victory'
    : state?.flags?.lost
      ? 'Defeat'
      : 'TrailOS';

  return (
    <main className={`githubdev-page trail-page theme-${theme}`}>
      <div className="githubdev-app">
        <TopBar
          githubUsername={githubUsername}
          onOpenQuickOpen={startNewGame}
          onOpenTrail={() => navigate('/oregon-trail')}
          trailActive
          theme={theme}
          onSetTheme={setTheme}
          commandLabel="Start new trail run"
        />

        <div className={`workbench trail-workbench ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <ActivityBar
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
          />

          <TrailSidebar
            className="sidebar trail-sidebar"
            state={state}
            leaderboard={leaderboard}
            gameOver={gameOver}
            awaitingName={awaitingName}
            scoreSaved={scoreSaved}
            scorePreview={scorePreview}
            onSubmitName={submitLeaderboardName}
            onStartNewGame={startNewGame}
          />

          <TrailTerminal
            transcript={transcript}
            onSubmitCommand={submitCommand}
            isStreaming={isStreaming}
            disabled={!state}
            gameOver={gameOver}
            error={error}
          />
        </div>

        <StatusBar language={language} cursor={{ line: state?.turn?.index || 1, column: 1 }} />
      </div>
    </main>
  );
}
