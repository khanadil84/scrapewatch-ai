import { AlertTriangle, CheckCircle, Eye, ArrowRight } from 'lucide-react';
import { changeEvents } from '@/data/mock';

const severityColors: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const severityDotColors: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-gray-400',
  critical: 'bg-red-400',
};

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string; bg: string }> = {
  repaired: { icon: CheckCircle, color: 'text-emerald-400', label: 'Automatically repaired', bg: 'bg-emerald-500/10' },
  monitoring: { icon: Eye, color: 'text-amber-400', label: 'Monitoring', bg: 'bg-amber-500/10' },
  pending: { icon: AlertTriangle, color: 'text-gray-400', label: 'Pending review', bg: 'bg-gray-500/10' },
};

export default function ChangeDetection() {
  return (
    <section className="glass-card p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">Website Changes</h3>
        <p className="text-sm text-gray-400 mt-1">Detected structural changes on monitored sites</p>
      </div>

      <div className="space-y-3">
        {changeEvents.map((event, i) => {
          const statusInfo = statusConfig[event.status];
          const StatusIcon = statusInfo.icon;
          return (
            <div
              key={event.id}
              className="p-4 rounded-xl bg-surface-3/40 border border-white/5 hover:border-white/10 transition-all duration-200 hover:bg-surface-3/60 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${severityDotColors[event.severity]}`} />
                    <span className="text-sm font-medium text-white">{event.domain}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${severityColors[event.severity]}`}>
                      {event.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{event.changeDescription}</p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-500">
                    <span>Detected {event.detectedAt}</span>
                    {event.selector && (
                      <code className="font-mono text-gray-400 bg-surface-2 px-1.5 py-0.5 rounded text-[10px]">{event.selector}</code>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg ${statusInfo.bg} ${statusInfo.color}`}>
                  <StatusIcon size={12} />
                  <span className="text-[11px] font-medium">{statusInfo.label}</span>
                </div>
              </div>
              {event.status === 'repaired' && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                  <ArrowRight size={10} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400/70">Auto-repaired by AI in 2.1 seconds</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
