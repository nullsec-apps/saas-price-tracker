import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface Props {
  label: string;
  value: string;
  delta?: number;
  spark?: number[];
  index?: number;
}

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={up ? '#34d399' : '#fb7185'} strokeWidth={1.75} points={pts} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KpiStatCard({ label, value, delta, spark, index = 0 }: Props) {
  const up = (delta ?? 0) > 0;
  const flat = (delta ?? 0) === 0;
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.4 }} className="rounded-xl border border-[#232838] bg-[#12151C] p-4 sm:p-5 hover:border-[#2e3550] hover:bg-[#171B24] transition-all duration-200">
      <div className="text-xs text-[#8B91A3] font-medium">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="font-display text-xl sm:text-2xl font-bold">{value}</div>
        {delta !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-semibold', flat ? 'text-[#8B91A3]' : up ? 'text-emerald-400' : 'text-rose-400')}>
            {flat ? <Minus size={14} /> : up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      {spark && <div className="mt-3"><Sparkline data={spark} up={up || flat} /></div>}
    </motion.div>
  );
}