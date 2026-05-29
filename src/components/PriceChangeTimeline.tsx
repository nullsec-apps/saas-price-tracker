import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Sparkles, History } from 'lucide-react';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { relativeDate } from '../lib/format';
import { cn } from '../lib/utils';

const seedEvents = [
  { id: 's1', type: 'increase', competitorName: 'Slack', planName: 'Pro', from: 7.25, to: 8.75, percent: 20.7, summary: 'Slack raised its Pro plan from $7.25 to $8.75/mo (+20.7%).', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: 's2', type: 'decrease', competitorName: 'Figma', planName: 'Pro', from: 15, to: 16, percent: 6.7, summary: 'Figma adjusted its Pro plan to $16/mo.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString() },
];

export default function PriceChangeTimeline() {
  const { events } = usePriceHistory();
  const all = events.length ? events : (seedEvents as any[]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="rounded-xl border border-[#232838] bg-[#12151C] p-4 sm:p-5 h-full">
      <h2 className="font-display text-base sm:text-lg font-bold mb-4 flex items-center gap-2"><History size={18} className="text-[#6366F1]" /> Recent Changes</h2>
      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {all.length === 0 && <div className="text-sm text-[#8B91A3] py-8 text-center">No changes detected yet. Run a scan.</div>}
          {all.map((e: any) => {
            const isInc = e.type === 'increase';
            const isNew = e.type === 'new_plan';
            return (
              <motion.div key={e.id} layout initial={{ opacity: 0, x: 20, backgroundColor: isInc ? 'rgba(244,63,94,0.15)' : 'rgba(52,211,153,0.15)' }} animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(23,27,36,1)' }} transition={{ duration: 0.5 }}
                className="rounded-lg border border-[#232838] p-3 hover:border-[#2e3550] transition-colors duration-200">
                <div className="flex items-start gap-2.5">
                  <div className={cn('grid place-items-center w-7 h-7 rounded-md shrink-0', isNew ? 'bg-[#6366F1]/15 text-[#A5A8FF]' : isInc ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400')}>
                    {isNew ? <Sparkles size={14} /> : isInc ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold truncate">{e.competitorName}</span>
                      {e.percent !== undefined && (
                        <span className={cn('text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0', isInc ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400')}>
                          {e.percent > 0 ? '+' : ''}{e.percent}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8B91A3] mt-0.5 leading-relaxed">{e.summary}</p>
                    <div className="text-[10px] text-[#5c6478] mt-1">{relativeDate(e.timestamp)}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}