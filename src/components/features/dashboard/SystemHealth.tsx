import { useEffect, useState } from 'react';
import { systemMetrics } from '@/data/mock';

function MetricRing({ value, max, color, size = 80, delay = 0 }: { value: number; max: number; color: string; size?: number; delay?: number }) {
  const [mounted, setMounted] = useState(false);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <filter id={`ring-glow-${color.replace('#', '')}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="5"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? circumference - progress : circumference}
          strokeLinecap="round"
          filter={`url(#ring-glow-${color.replace('#', '')})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {value}{value === 4.2 ? 's' : '%'}
        </span>
      </div>
    </div>
  );
}

const ringColors = ['#22d3ee', '#10b981', '#8b5cf6', '#fbbf24'];

export default function SystemHealth() {
  return (
    <section className="glass-card p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">System Health</h3>
        <p className="text-sm text-gray-400 mt-1">Observability metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {systemMetrics.map((metric, i) => (
          <div key={metric.label} className="flex flex-col items-center gap-3">
            <MetricRing
              value={metric.value}
              max={metric.label === 'Average Recovery' ? 10 : 100}
              color={ringColors[i]}
              size={80}
              delay={i * 150}
            />
            <div className="text-center">
              <p className="text-xs text-gray-400">{metric.label}</p>
              {metric.trend && (
                <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">{metric.trend}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
