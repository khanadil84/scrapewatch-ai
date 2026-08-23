import { useEffect, useState } from 'react';

function FloatingParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <circle cx={x} cy={y} r="1.5" fill="#22d3ee" opacity="0">
      <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
      <animate attributeName="cy" values={`${y};${y - 30}`} dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8 md:p-10 lg:p-12">
      {/* Ambient background gradients */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[400px] rounded-full blur-[100px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%)' }} />
      <div className="absolute -bottom-20 right-1/4 w-[400px] h-[350px] rounded-full blur-[80px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[60px] opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      <div className="relative z-10">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'AI-Powered', color: 'cyan' },
            { label: 'Self-Healing', color: 'violet' },
            { label: 'Bright Data', color: 'emerald' },
            { label: 'Real-Time Monitoring', color: 'amber' },
          ].map((badge, i) => (
            <span
              key={badge.label}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } ${
                badge.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                badge.color === 'violet' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                badge.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {badge.label}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1] transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Web Intelligence{' '}
          <span className="gradient-text">That Heals Itself.</span>
        </h2>
        <p className={`text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mb-8 transition-all duration-700 delay-200 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          ScrapeWatch AI watches your collectors, detects when websites change, and restores
          broken extraction before your downstream data pipeline notices.
        </p>

        {/* 3D Isometric SVG Visualization */}
        <div className={`relative w-full max-w-5xl mx-auto transition-all duration-1000 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="perspective-1200">
            <div className="preserve-3d" style={{ transform: 'rotateX(5deg) rotateY(-2deg)' }}>
              <svg viewBox="0 0 900 420" className="w-full h-auto" aria-label="Scraper pipeline visualization showing Website to Collector to AI Detector to Self-Heal to Structured Data flow">
                <defs>
                  <linearGradient id="heroConnectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="heroNodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e1e2e" />
                    <stop offset="100%" stopColor="#12121a" />
                  </linearGradient>
                  <linearGradient id="heroNodeGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#252535" />
                    <stop offset="100%" stopColor="#1a1a28" />
                  </linearGradient>
                  <filter id="heroGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="heroGlowStrong">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="dropShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.4" />
                  </filter>
                  <clipPath id="nodeClip">
                    <rect x="0" y="0" width="130" height="110" rx="14" />
                  </clipPath>
                </defs>

                {/* ===== CONNECTION PATHS ===== */}
                {/* Website -> Collector */}
                <g>
                  <path d="M160,210 C220,210 220,210 280,210" fill="none" stroke="url(#heroConnectionGrad)" strokeWidth="2" strokeDasharray="8,4" opacity="0.5">
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" />
                  </path>
                  <circle r="3" fill="#22d3ee" filter="url(#heroGlow)">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M160,210 C220,210 220,210 280,210" />
                  </circle>
                  <circle r="2" fill="#22d3ee" opacity="0.6">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M160,210 C220,210 220,210 280,210" begin="0.6s" />
                  </circle>
                </g>

                {/* Collector -> AI Detector */}
                <g>
                  <path d="M440,210 C500,210 500,210 540,210" fill="none" stroke="url(#heroConnectionGrad)" strokeWidth="2" strokeDasharray="8,4" opacity="0.5">
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" />
                  </path>
                  <circle r="3" fill="#8b5cf6" filter="url(#heroGlow)">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M440,210 C500,210 500,210 540,210" />
                  </circle>
                </g>

                {/* AI Detector -> Healthy path (top) */}
                <g>
                  <path d="M680,185 C710,185 720,150 740,130" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.4">
                    <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.2s" repeatCount="indefinite" />
                  </path>
                  <circle r="2" fill="#10b981" filter="url(#heroGlow)">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M680,185 C710,185 720,150 740,130" />
                  </circle>
                </g>

                {/* AI Detector -> Self-Heal path (bottom) */}
                <g>
                  <path d="M610,260 C610,290 600,310 590,330" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.4">
                    <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.2s" repeatCount="indefinite" />
                  </path>
                  <circle r="2" fill="#fbbf24" filter="url(#heroGlow)">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M610,260 C610,290 600,310 590,330" />
                  </circle>
                </g>

                {/* Self-Heal -> Structured Data */}
                <g>
                  <path d="M680,345 C720,345 740,300 760,260" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.4">
                    <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.2s" repeatCount="indefinite" />
                  </path>
                  <circle r="2" fill="#10b981" filter="url(#heroGlow)">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M680,345 C720,345 740,300 760,260" />
                  </circle>
                </g>

                {/* Collector -> Structured Data (direct healthy path) */}
                <g>
                  <path d="M440,180 C560,100 700,90 760,110" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" opacity="0.2">
                    <animate attributeName="stroke-dashoffset" from="16" to="0" dur="2s" repeatCount="indefinite" />
                  </path>
                </g>

                {/* ===== NODE: WEBSITE ===== */}
                <g transform="translate(60, 155)" filter="url(#dropShadow)">
                  {/* Isometric top face */}
                  <path d="M0,10 L65,0 L130,10 L65,20 Z" fill="#1e1e30" stroke="#22d3ee" strokeWidth="0.5" opacity="0.6" />
                  {/* Front face */}
                  <rect x="0" y="10" width="130" height="100" rx="4" fill="url(#heroNodeGrad)" stroke="#22d3ee" strokeWidth="1" opacity="0.95" />
                  {/* Content */}
                  <text x="65" y="40" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="Inter" letterSpacing="0.1em">WEBSITE</text>
                  <rect x="18" y="52" width="94" height="7" rx="2" fill="#22d3ee" opacity="0.12" />
                  <rect x="18" y="64" width="70" height="7" rx="2" fill="#22d3ee" opacity="0.08" />
                  <rect x="18" y="76" width="82" height="7" rx="2" fill="#22d3ee" opacity="0.06" />
                  <rect x="18" y="88" width="55" height="7" rx="2" fill="#22d3ee" opacity="0.04" />
                  {/* Pulsing border */}
                  <rect x="0" y="10" width="130" height="100" rx="4" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3">
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                  </rect>
                </g>

                {/* ===== NODE: COLLECTOR (central focal point) ===== */}
                <g transform="translate(290, 145)" filter="url(#dropShadow)">
                  {/* Outer glow ring */}
                  <circle cx="75" cy="65" r="62" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.15">
                    <animate attributeName="r" values="58;65;58" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="4s" repeatCount="indefinite" />
                  </circle>
                  {/* Isometric top face */}
                  <path d="M5,15 L80,3 L155,15 L80,27 Z" fill="#22223a" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.6" />
                  {/* Front face */}
                  <rect x="5" y="15" width="150" height="120" rx="8" fill="url(#heroNodeGrad)" stroke="#8b5cf6" strokeWidth="2" />
                  {/* Rotating orbital ring */}
                  <circle cx="75" cy="55" r="28" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.3" strokeDasharray="5,4">
                    <animateTransform attributeName="transform" type="rotate" from="0 75 55" to="360 75 55" dur="10s" repeatCount="indefinite" />
                  </circle>
                  {/* Inner pulsing core */}
                  <circle cx="75" cy="55" r="18" fill="#8b5cf6" opacity="0.08">
                    <animate attributeName="opacity" values="0.08;0.2;0.08" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="r" values="16;20;16" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="75" cy="55" r="10" fill="#8b5cf6" opacity="0.15">
                    <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Collector ID */}
                  <text x="75" y="59" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="'JetBrains Mono', monospace">c_mt5ryoya2bepdq2a8c</text>
                  {/* Label */}
                  <text x="75" y="100" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="700" fontFamily="Inter" letterSpacing="0.08em">COLLECTOR</text>
                  {/* Status */}
                  <text x="75" y="122" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="600" fontFamily="Inter">
                    HEALTHY
                    <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                  </text>
                  {/* Glow effect */}
                  <rect x="5" y="15" width="150" height="120" rx="8" fill="none" stroke="#8b5cf6" strokeWidth="2" filter="url(#heroGlow)" opacity="0.4" />
                </g>

                {/* ===== NODE: AI DETECTOR ===== */}
                <g transform="translate(550, 155)" filter="url(#dropShadow)">
                  {/* Isometric top */}
                  <path d="M0,10 L55,0 L110,10 L55,20 Z" fill="#2a2520" stroke="#fbbf24" strokeWidth="0.5" opacity="0.5" />
                  {/* Front face */}
                  <rect x="0" y="10" width="110" height="100" rx="8" fill="url(#heroNodeGrad)" stroke="#fbbf24" strokeWidth="1.5" />
                  {/* Scanning animation */}
                  <circle cx="55" cy="55" r="22" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3">
                    <animate attributeName="r" values="15;25;15" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="55" cy="55" r="14" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.2">
                    <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Eye icon */}
                  <circle cx="55" cy="55" r="6" fill="#fbbf24" opacity="0.25">
                    <animate attributeName="opacity" values="0.25;0.45;0.25" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="55" cy="55" r="2.5" fill="#fbbf24" opacity="0.6" />
                  <text x="55" y="40" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700" fontFamily="Inter" letterSpacing="0.08em">AI DETECTOR</text>
                  {/* Branch labels */}
                  <text x="18" y="95" fill="#10b981" fontSize="7" fontWeight="600" fontFamily="Inter" opacity="0.7">HEALTHY</text>
                  <text x="72" y="95" fill="#f59e0b" fontSize="7" fontWeight="600" fontFamily="Inter" opacity="0.7">CHANGE</text>
                </g>

                {/* ===== NODE: SELF-HEAL ===== */}
                <g transform="translate(520, 310)" filter="url(#dropShadow)">
                  <rect x="0" y="0" width="120" height="80" rx="10" fill="url(#heroNodeGrad)" stroke="#10b981" strokeWidth="1.5" />
                  {/* Wrench animation */}
                  <circle cx="60" cy="32" r="16" fill="none" stroke="#10b981" strokeWidth="0.8" opacity="0.2">
                    <animate attributeName="r" values="12;18;12" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="60" y="36" textAnchor="middle" fill="#10b981" fontSize="16" opacity="0.4">&#x2699;</text>
                  <text x="60" y="58" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700" fontFamily="Inter" letterSpacing="0.06em">SELF-HEAL</text>
                  <text x="60" y="72" textAnchor="middle" fill="#10b981" fontSize="7" opacity="0.5" fontFamily="Inter">ADAPT &amp; RECOVER</text>
                </g>

                {/* ===== NODE: STRUCTURED DATA ===== */}
                <g transform="translate(740, 100)" filter="url(#dropShadow)">
                  {/* Isometric top */}
                  <path d="M0,8 L50,0 L100,8 L50,16 Z" fill="#152520" stroke="#10b981" strokeWidth="0.5" opacity="0.5" />
                  {/* Front face */}
                  <rect x="0" y="8" width="100" height="110" rx="8" fill="url(#heroNodeGrad)" stroke="#10b981" strokeWidth="1.5" />
                  <text x="50" y="32" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="Inter" letterSpacing="0.08em">STRUCTURED</text>
                  <text x="50" y="44" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="Inter" letterSpacing="0.08em">DATA</text>
                  {/* Data bars */}
                  <rect x="14" y="54" width="72" height="5" rx="2" fill="#10b981" opacity="0.15">
                    <animate attributeName="width" values="72;50;72" dur="3s" repeatCount="indefinite" />
                  </rect>
                  <rect x="14" y="63" width="55" height="5" rx="2" fill="#10b981" opacity="0.1">
                    <animate attributeName="width" values="55;70;55" dur="3.5s" repeatCount="indefinite" />
                  </rect>
                  <rect x="14" y="72" width="65" height="5" rx="2" fill="#10b981" opacity="0.08" />
                  <rect x="14" y="81" width="40" height="5" rx="2" fill="#10b981" opacity="0.06" />
                  <rect x="14" y="90" width="58" height="5" rx="2" fill="#10b981" opacity="0.05" />
                  <rect x="14" y="99" width="45" height="5" rx="2" fill="#10b981" opacity="0.04" />
                </g>

                {/* ===== FLOATING JSON DATA PACKET ===== */}
                <g transform="translate(740, 260)" opacity="0.7">
                  <rect x="0" y="0" width="120" height="100" rx="8" fill="#12121a" stroke="#22d3ee" strokeWidth="0.5" opacity="0.9" />
                  <text x="10" y="18" fill="#22d3ee" fontSize="7" fontFamily="'JetBrains Mono', monospace" opacity="0.8">{"{"}</text>
                  <text x="14" y="30" fill="#a78bfa" fontSize="6" fontFamily="'JetBrains Mono', monospace">"title":</text>
                  <text x="60" y="30" fill="#10b981" fontSize="6" fontFamily="'JetBrains Mono', monospace">"Laptop"</text>
                  <text x="14" y="42" fill="#a78bfa" fontSize="6" fontFamily="'JetBrains Mono', monospace">"price":</text>
                  <text x="60" y="42" fill="#10b981" fontSize="6" fontFamily="'JetBrains Mono', monospace">"$899"</text>
                  <text x="14" y="54" fill="#a78bfa" fontSize="6" fontFamily="'JetBrains Mono', monospace">"avail":</text>
                  <text x="60" y="54" fill="#10b981" fontSize="6" fontFamily="'JetBrains Mono', monospace">"In Stock"</text>
                  <text x="14" y="66" fill="#a78bfa" fontSize="6" fontFamily="'JetBrains Mono', monospace">"rating":</text>
                  <text x="60" y="66" fill="#10b981" fontSize="6" fontFamily="'JetBrains Mono', monospace">4.8</text>
                  <text x="10" y="82" fill="#22d3ee" fontSize="7" fontFamily="'JetBrains Mono', monospace" opacity="0.8">{"}"}</text>
                  {/* Floating animation */}
                  <animateTransform attributeName="transform" type="translate" values="740,260;740,252;740,260" dur="4s" repeatCount="indefinite" />
                </g>

                {/* ===== FLOATING PARTICLES ===== */}
                <FloatingParticle delay={0} x={200} y={180} />
                <FloatingParticle delay={0.8} x={480} y={170} />
                <FloatingParticle delay={1.5} x={700} y={200} />
                <FloatingParticle delay={2.2} x={350} y={250} />
                <FloatingParticle delay={0.4} x={620} y={280} />
                <FloatingParticle delay={1.8} x={150} y={240} />
                <FloatingParticle delay={2.8} x={820} y={180} />
                <FloatingParticle delay={1.2} x={400} y={150} />

                {/* ===== AMBIENT DATA FLOW LINES ===== */}
                <g opacity="0.08">
                  <line x1="0" y1="100" x2="900" y2="100" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2,8" />
                  <line x1="0" y1="210" x2="900" y2="210" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,8" />
                  <line x1="0" y1="320" x2="900" y2="320" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,8" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
