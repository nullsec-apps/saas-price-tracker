import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Users, Table2, Bell, Sparkles, PanelLeftClose, PanelLeft, Radar } from 'lucide-react';
import { cn } from '../lib/utils';
import TopBar from './TopBar';
import ScanProgressToast from './ScanProgressToast';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/competitors', label: 'Competitors', icon: Users },
  { to: '/comparison', label: 'Comparison Matrix', icon: Table2 },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/insights', label: 'AI Insights', icon: Sparkles },
];

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const wide = location.pathname === '/comparison';

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0D12] text-[#E8EAF0]">
      <Toaster position="top-center" toastOptions={{ style: { background: '#171B24', color: '#E8EAF0', border: '1px solid #232838', fontSize: 13 } }} />
      <aside className={cn('flex flex-col border-r border-[#232838] bg-[#0E1016] transition-all duration-200 shrink-0', collapsed ? 'w-[60px] sm:w-[68px]' : 'w-[64px] sm:w-[240px]')}>
        <div className="flex items-center gap-2.5 px-3 sm:px-4 h-16 border-b border-[#232838]">
          <div className="grid place-items-center w-8 h-8 rounded-lg bg-[#6366F1] shrink-0"><Radar size={18} strokeWidth={2} className="text-white" /></div>
          {!collapsed && <div className="font-display font-bold text-[15px] leading-none hidden sm:block">PriceScout<span className="text-[#6366F1]"> AI</span></div>}
        </div>
        <nav className="flex-1 px-2 sm:px-2.5 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} title={label} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200', isActive ? 'bg-[#6366F1]/15 text-[#A5A8FF]' : 'text-[#8B91A3] hover:bg-white/5 hover:text-[#E8EAF0]')}>
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span className="hidden sm:inline">{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 sm:p-2.5 border-t border-[#232838] hidden sm:block">
          <button onClick={() => setCollapsed((c) => !c)} className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-[#8B91A3] hover:bg-white/5 hover:text-[#E8EAF0] transition-colors duration-200">
            {collapsed ? <PanelLeft size={18} strokeWidth={1.75} /> : <PanelLeftClose size={18} strokeWidth={1.75} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className={cn('flex-1 overflow-y-auto overflow-x-hidden', wide ? 'p-0' : 'p-4 sm:p-6')}>
          <div className={wide ? '' : 'mx-auto max-w-[1400px]'}><Outlet /></div>
        </main>
      </div>
      <ScanProgressToast />
    </div>
  );
}