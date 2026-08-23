import { Play, ExternalLink, Clock, BarChart3, Database, RefreshCw } from 'lucide-react';
import { collectors as mockCollectors } from '@/data/mock';
import { useLiveScrapedData } from '@/hooks/useLiveScrapedData';
import type { Collector } from '@/types';

const statusColors: Record<string, string> = {
  healthy: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
  healing: 'bg-violet-400',
  idle: 'bg-gray-400',
};

const statusShadows: Record<string, string> = {
  healthy: '0 0 8px rgba(16,185,129,0.6)',
  warning: '0 0 8px rgba(251,191,36,0.6)',
  error: '0 0 8px rgba(239,68,68,0.6)',
  healing: '0 0 8px rgba(139,92,246,0.6)',
};

const statusTextColors: Record<string, string> = {
  healthy: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
  healing: 'text-violet-400',
  idle: 'text-gray-400',
};

const statusBorderColors: Record<string, string> = {
  healthy: 'border-emerald-500/20',
  warning: 'border-amber-500/20',
  error: 'border-red-500/20',
  healing: 'border-violet-500/20',
};

function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-surface-4 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function LiveScrapers() {
  const { recordCount, loading, source } = useLiveScrapedData();

  // Build the live collector entry
  const liveCollector: Collector = {
    id: 'c_mt5ryoya2bepdq2a8c',
    name: 'Book Scraper — Live',
    target: 'books.toscrape.com',
    status: source === 'local' ? 'healthy' : 'healthy',
    lastRun: source ? 'Just now' : 'Waiting...',
    recordsCollected: recordCount,
    successRate: recordCount > 0 ? 100 : 0,
    schedule: 'Manual',
  };

  // Combine: live collector first, then mock collectors
  const allCollectors = [liveCollector, ...mockCollectors];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Live Scrapers</h3>
          <p className="text-sm text-gray-400 mt-1">
            Active collector monitoring
            {source && (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-surface-3 border border-white/5">
                <Database size={9} />
                {source === 'live' ? 'Bright Data connected' : 'Live Bright Data'}
              </span>
            )}
          </p>
        </div>
        <button className="btn-secondary text-sm">View All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allCollectors.map((collector, i) => (
          <div
            key={collector.id}
            className={`glass-card-hover p-5 animate-fade-in border-l-2 ${statusBorderColors[collector.status]} ${
              i === 0 ? 'ring-1 ring-cyan-500/20' : ''
            }`}
            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">{collector.name}</h4>
                  {i === 0 && source ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-500 border border-gray-500/20 font-medium">
                      DEMO DATA
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">{collector.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {loading && i === 0 ? (
                  <RefreshCw size={12} className="text-cyan-400 animate-spin" />
                ) : (
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${statusColors[collector.status]}`}
                    style={{ boxShadow: statusShadows[collector.status] }}
                  />
                )}
                <span className={`text-xs font-medium capitalize ${statusTextColors[collector.status]}`}>{collector.status}</span>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <BarChart3 size={10} /> Target
                </span>
                <span className="text-gray-300 font-mono">{collector.target}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Clock size={10} /> Last Run
                </span>
                <span className="text-gray-300">{collector.lastRun}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Records</span>
                <span className="text-gray-300 font-semibold">{collector.recordsCollected.toLocaleString()}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Success Rate</span>
                  <span className="text-gray-300">{collector.successRate}%</span>
                </div>
                <MiniBar value={collector.successRate} color={collector.status === 'healthy' ? '#10b981' : '#fbbf24'} />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/5">
              <button className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs py-2">
                <Play size={12} />
                Run
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 text-xs py-2 px-3">
                <ExternalLink size={12} />
                Data
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
