import { useEffect, useState } from 'react';
import { Database, CheckCircle, Wrench, Layers, TrendingUp } from 'lucide-react';
import { kpiData as mockKpi } from '@/data/mock';
import { useLiveScrapedData } from '@/hooks/useLiveScrapedData';

const icons: Record<string, typeof Database> = {
  database: Database,
  'check-circle': CheckCircle,
  wrench: Wrench,
  layers: Layers,
};

const sparklineData: Record<string, number[]> = {
  database: [40, 45, 42, 55, 50, 65, 60, 72, 68, 80, 75, 85],
  'check-circle': [95, 96, 97, 96, 98, 97, 99, 98, 99, 99, 99, 100],
  wrench: [0, 1, 0, 2, 1, 0, 1, 0, 0, 1, 0, 0],
  layers: [8, 8.5, 9, 9.2, 9.8, 10, 10.5, 11, 11.2, 11.8, 12, 12.4],
};

const accentColors: Record<string, string> = {
  database: '#22d3ee',
  'check-circle': '#10b981',
  wrench: '#a78bfa',
  layers: '#fbbf24',
};

function AnimatedCounter({ target, duration = 1200 }: { target: string; duration?: number }) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const numericPart = target.replace(/[^0-9.]/g, '');
    const suffix = target.replace(/[0-9.,]/g, '');
    const hasComma = target.includes(',');
    const num = parseFloat(numericPart);
    if (isNaN(num)) { setDisplay(target); return; }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;

      if (target.includes('.')) {
        setDisplay(current.toFixed(1) + suffix);
      } else if (hasComma) {
        setDisplay(Math.round(current).toLocaleString() + suffix);
      } else {
        setDisplay(Math.round(current) + suffix);
      }

      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{display}</>;
}

function MiniSparkline({ data, color, width = 80, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="2.5" fill={color}>
        <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function KPICards() {
  const { recordCount, source } = useLiveScrapedData();

  // Override the first KPI with real data if available
  const kpiItems = [...mockKpi];
  if (source && recordCount > 0) {
    kpiItems[0] = {
      ...kpiItems[0],
      value: recordCount.toLocaleString(),
      trend: source === 'live' ? 'From Bright Data API' : 'From local snapshot',
    };
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiItems.map((kpi, i) => {
        const Icon = icons[kpi.icon];
        const color = accentColors[kpi.icon];
        const sparkData = sparklineData[kpi.icon];
        return (
          <div
            key={kpi.label}
            className="glass-card-hover p-5 animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}10` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              {sparkData && (
                <MiniSparkline data={sparkData} color={color} />
              )}
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-mono">
              <AnimatedCounter target={kpi.value} />
            </p>
            <p className="text-xs text-gray-400 mb-2">{kpi.label}</p>
            <div className="flex items-center gap-1">
              <TrendingUp size={10} className="text-emerald-400" />
              <p className="text-xs text-emerald-400">{kpi.trend}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
