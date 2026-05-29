import { Search, Play, Loader2 } from 'lucide-react';
import { useAgentScan } from '../hooks/useAgentScan';
import { relativeDate } from '../lib/format';
import { useCompetitors } from '../hooks/useCompetitors';

export default function TopBar() {
  const { scanning, lastScan, startScan } = useAgentScan();
  const { competitors } = useCompetitors();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 sm:gap-4 h-16 px-3 sm:px-6 border-b border-[#232838] bg-[#0B0D12]/80 backdrop-blur-md">
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B91A3]" />
        <input placeholder="Search competitors, plans, features..." className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#12151C] border border-[#232838] text-sm placeholder:text-[#8B91A3] focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200" />
      </div>

      <div className="flex items-center gap-2 text-xs text-[#8B91A3] ml-auto sm:ml-0">
        <span className="relative inline-flex w-2 h-2">
          <span className={`absolute inline-flex w-2 h-2 rounded-full bg-emerald-400 ${scanning ? 'live-ripple' : 'pulse-dot'}`} />
        </span>
        <span className="hidden lg:inline">Monitoring {competitors.length} tools</span>
      </div>

      <div className="hidden xl:block text-xs text-[#8B91A3]">Last scan: {lastScan ? relativeDate(lastScan) : 'never'}</div>

      <button onClick={startScan} disabled={scanning} className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5457e0] disabled:opacity-60 transition-all duration-200">
        {scanning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} strokeWidth={2} />}
        <span className="hidden sm:inline">{scanning ? 'Scanning...' : 'Run Agent Scan'}</span>
        <span className="sm:hidden">{scanning ? '...' : 'Scan'}</span>
      </button>
    </header>
  );
}