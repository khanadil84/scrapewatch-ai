import { useState, useCallback, useRef } from 'react';
import { Bell, Menu, Play, Users, CircleDot, Check, X } from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  onMenuClick: () => void;
}

const tabLabels: Record<string, string> = {
  overview: 'Overview',
  scrapers: 'Live Scrapers',
  data: 'Data Explorer',
  changes: 'Change Detection',
  healing: 'Self-Healing',
  activity: 'Activity',
  settings: 'Settings',
  docs: 'Documentation',
};

type RunState = 'idle' | 'running' | 'success' | 'error';

export default function TopNav({ activeTab, onMenuClick }: TopNavProps) {
  const [runState, setRunState] = useState<RunState>('idle');
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef(false);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const pollForCompletion = useCallback((collId: string) => {
    let attempts = 0;
    const maxAttempts = 30;

    const poll = async () => {
      if (abortRef.current) return;
      attempts++;

      try {
        const res = await fetch(`/api/scraper/poll?collectionId=${collId}`);
        if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        if (data.status === 'done') {
          setRunState('success');
          setCollectionId(collId);
          // Notify all data hooks to refresh
          window.dispatchEvent(new CustomEvent('scraper-run-complete'));
          // Reset to idle after showing success
          setTimeout(() => {
            setRunState('idle');
            setCollectionId(null);
          }, 4000);
          return;
        }

        if (data.status === 'failed') {
          throw new Error('Collection failed on Bright Data side');
        }

        // Still running, poll again
        if (attempts < maxAttempts && !abortRef.current) {
          pollingRef.current = setTimeout(poll, 5000);
        } else if (attempts >= maxAttempts) {
          throw new Error('Timed out waiting for collection');
        }
      } catch (err) {
        if (!abortRef.current) {
          setRunState('error');
          setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
          setTimeout(() => {
            setRunState('idle');
            setErrorMessage(null);
          }, 5000);
        }
      }
    };

    poll();
  }, []);

  const handleRunScraper = useCallback(async () => {
    if (runState === 'running') return;

    abortRef.current = false;
    clearPolling();
    setRunState('running');
    setErrorMessage(null);
    setCollectionId(null);

    try {
      const res = await fetch('/api/scraper/run', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Server returned ${res.status}`);
      }

      setCollectionId(data.collectionId);
      // Start polling for completion
      pollForCompletion(data.collectionId);
    } catch (err) {
      setRunState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to start scraper');
      setTimeout(() => {
        setRunState('idle');
        setErrorMessage(null);
      }, 5000);
    }
  }, [runState, clearPolling, pollForCompletion]);

  const isRunning = runState === 'running';

  return (
    <header className="h-16 border-b border-white/5 bg-surface-1/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-surface-3 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-white">{tabLabels[activeTab] || 'Overview'}</h1>
          <p className="text-xs text-gray-500">ScrapeWatch AI / {tabLabels[activeTab] || 'Overview'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* System status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CircleDot size={10} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">All systems operational</span>
        </div>

        {/* Collector count */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-3 border border-white/5">
          <Users size={14} className="text-gray-400" />
          <span className="text-xs text-gray-300">3 collectors</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-surface-3 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" style={{ boxShadow: '0 0 6px rgba(34,211,238,0.5)' }} />
        </button>

        {/* Profile avatar */}
        <div className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 items-center justify-center text-white text-xs font-bold cursor-pointer hover:shadow-lg hover:shadow-violet-500/20 transition-shadow">
          SW
        </div>

        {/* Run Scraper */}
        <button
          onClick={handleRunScraper}
          disabled={isRunning}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${
            runState === 'success'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : runState === 'error'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
          }`}
        >
          {runState === 'running' && <Play size={14} className="animate-spin" />}
          {runState === 'success' && <Check size={14} />}
          {runState === 'error' && <X size={14} />}
          {runState === 'idle' && <Play size={14} />}
          <span>
            {runState === 'running' && 'Running...'}
            {runState === 'success' && 'Collection started'}
            {runState === 'error' && (errorMessage || 'Failed')}
            {runState === 'idle' && 'Run Scraper'}
          </span>
        </button>
      </div>
    </header>
  );
}
