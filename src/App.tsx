import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import HeroSection from '@/components/features/dashboard/HeroSection';
import KPICards from '@/components/features/dashboard/KPICards';
import LiveScrapers from '@/components/features/scrapers/LiveScrapers';
import SelfHealingPanel from '@/components/features/healing/SelfHealingPanel';
import ChangeDetection from '@/components/features/changes/ChangeDetection';
import DataExplorer from '@/components/features/data/DataExplorer';
import ActivityFeed from '@/components/features/activity/ActivityFeed';
import SystemHealth from '@/components/features/dashboard/SystemHealth';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <HeroSection />
            <KPICards />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <LiveScrapers />
              </div>
              <SystemHealth />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SelfHealingPanel />
              <ChangeDetection />
            </div>
            <ActivityFeed />
          </div>
        );
      case 'scrapers':
        return <LiveScrapers />;
      case 'data':
        return <DataExplorer />;
      case 'changes':
        return <ChangeDetection />;
      case 'healing':
        return <SelfHealingPanel />;
      case 'activity':
        return <ActivityFeed />;
      default:
        return (
          <div className="space-y-6">
            <HeroSection />
            <KPICards />
            <LiveScrapers />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-0">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'}`}>
        <TopNav activeTab={activeTab} onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8 max-w-[1600px]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
