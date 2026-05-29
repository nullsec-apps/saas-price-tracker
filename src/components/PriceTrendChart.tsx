import { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { useCompetitors } from '../hooks/useCompetitors';
import { cn } from '../lib/utils';

export default function PriceTrendChart() {
  const { history } = usePriceHistory();
  const { competitors } = useCompetitors();
  const [active, setActive] = useState<string[]>(['slack', 'notion', 'figma', 'linear']);

  const toggle = (id: string) => setActive((a) => a.includes(id) ? a.filter((x) => x !== id) : [...a, id]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="rounded-xl border border-[#232838] bg-[#12151C] p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base sm:text-lg font-bold">Pro Plan Price Trends</h2>
        <div className="text-xs text-[#8B91A3] hidden sm:block">Last 12 months</div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {competitors.map((c) => (
          <button key={c.id} onClick={() => toggle(c.id)}
            className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200',
              active.includes(c.id) ? 'border-[#6366F1]/50 bg-[#6366F1]/15 text-[#A5A8FF]' : 'border-[#232838] text-[#8B91A3] hover:text-[#E8EAF0] hover:border-[#2e3550]')}>
            <span className="w-2 h-2 rounded-full" style={{ background: c.logoColor }} />
            {c.name}
          </button>
        ))}
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c2030" vertical={false} />
            <XAxis dataKey="month" stroke="#8B91A3" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#8B91A3" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip contentStyle={{ background: '#171B24', border: '1px solid #232838', borderRadius: 10, fontSize: 12 }} labelStyle={{ color: '#E8EAF0' }} formatter={(v: number) => `$${v}`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {competitors.filter((c) => active.includes(c.id)).map((c) => (
              <Line key={c.id} type="monotone" dataKey={c.id} name={c.name} stroke={c.logoColor === '#0F0F0F' || c.logoColor === '#24292E' ? '#9aa3b8' : c.logoColor} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}