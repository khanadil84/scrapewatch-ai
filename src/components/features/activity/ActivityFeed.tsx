import { CheckCircle, GitCompare, Wrench, Database, Shield, Activity, Clock } from 'lucide-react';
import { activityEvents } from '@/data/mock';

const typeConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  collector_completed: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  change_detected: { icon: GitCompare, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  healing_generated: { icon: Wrench, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  collector_healed: { icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  schema_verified: { icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  records_collected: { icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
};

const REAL_COLLECTOR = 'c_mt5ryoya2bepdq2a8c';

export default function ActivityFeed() {
  return (
    <section className="glass-card p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        <p className="text-sm text-gray-400 mt-1">System events and collector activity</p>
      </div>

      <div className="space-y-1">
        {activityEvents.map((event, i) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;
          const isReal = event.collectorId === REAL_COLLECTOR;
          return (
            <div
              key={event.id}
              className="flex items-start gap-3 py-3 px-3 rounded-lg hover:bg-surface-3/30 transition-all duration-200 group animate-fade-in"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                <Icon size={14} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{event.message}</p>
                  {isReal ? (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold shrink-0">LIVE</span>
                  ) : event.collectorId ? (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-gray-500/10 text-gray-500 border border-gray-500/20 font-bold shrink-0">DEMO</span>
                  ) : null}
                </div>
                {event.collectorId && (
                  <span className="text-[11px] font-mono text-cyan-400/60">{event.collectorId}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                <Clock size={10} className="text-gray-600" />
                <span className="text-[11px] text-gray-500">{event.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
