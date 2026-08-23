import {
  LayoutDashboard,
  Database,
  Search,
  GitCompare,
  Wrench,
  Activity,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Wifi,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: 'overview' },
  { label: 'Live Scrapers', icon: Database, path: 'scrapers' },
  { label: 'Data Explorer', icon: Search, path: 'data' },
  { label: 'Change Detection', icon: GitCompare, path: 'changes' },
  { label: 'Self-Healing', icon: Wrench, path: 'healing' },
  { label: 'Activity', icon: Activity, path: 'activity' },
];

const bottomItems = [
  { label: 'Settings', icon: Settings, path: 'settings' },
  { label: 'Documentation', icon: BookOpen, path: 'docs' },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-surface-1/95 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[68px]' : 'w-[240px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <span className="text-white font-bold text-xs">SW</span>
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-white whitespace-nowrap">ScrapeWatch AI</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { onTabChange(item.path); onMobileClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-3 border border-transparent'
                  }
                `}
                style={isActive ? { boxShadow: '0 0 20px rgba(34, 211, 238, 0.12)' } : undefined}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom items */}
        <div className="border-t border-white/5 py-3 px-2 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-surface-3 transition-all duration-200
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Bright Data connection status */}
        <div className={`border-t border-white/5 px-3 py-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <Wifi size={14} className="text-emerald-400" />
              <div>
                <p className="text-xs font-medium text-emerald-400">Bright Data</p>
                <p className="text-[10px] text-gray-500">Connected</p>
              </div>
              <div className="ml-auto">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-3 border border-white/10 items-center justify-center text-gray-400 hover:text-white hover:bg-surface-4 transition-all hover:scale-110"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}
