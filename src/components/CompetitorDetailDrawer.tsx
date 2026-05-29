import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowUpRight, ArrowDownRight, Check, Minus } from 'lucide-react';
import { useCompetitors } from '../hooks/useCompetitors';
import { formatCurrency, relativeDate } from '../lib/format';
import { cn } from '../lib/utils';

export default function CompetitorDetailDrawer() {
  const { competitors, selectedId, setSelected } = useCompetitors();
  const comp = competitors.find((c) => c.id === selectedId);

  return (
    <AnimatePresence>
      {comp && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-[480px] bg-[#0E1016] border-l border-[#232838] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-5 border-b border-[#232838] bg-[#0E1016]/90 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center w-10 h-10 rounded-lg font-display font-bold text-white" style={{ background: comp.logoColor }}>{comp.name[0]}</div>
                <div>
                  <div className="font-display text-lg font-bold leading-none">{comp.name}</div>
                  <div className="text-xs text-[#8B91A3] mt-1">{comp.category}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="grid place-items-center w-8 h-8 rounded-lg hover:bg-white/5 text-[#8B91A3] transition-colors duration-200"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-6">
              <a href={comp.pricingUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#A5A8FF] hover:underline break-all">
                <ExternalLink size={14} className="shrink-0" /> {comp.pricingUrl}
              </a>
              <div className="text-xs text-[#8B91A3]">Last change detected {relativeDate(comp.lastChange)}</div>

              <div>
                <h3 className="font-display font-bold mb-3">Plans</h3>
                <div className="space-y-3">
                  {comp.plans.map((p) => {
                    const changed = p.prevPriceMonthly !== undefined && p.prevPriceMonthly !== p.priceMonthly;
                    const inc = changed && p.priceMonthly > (p.prevPriceMonthly ?? 0);
                    return (
                      <div key={p.id} className={cn('rounded-lg border p-4', p.highlight ? 'border-[#6366F1]/40 bg-[#6366F1]/5' : 'border-[#232838] bg-[#12151C]')}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{p.name}</span>
                          <div className="flex items-center gap-2">
                            {changed && (
                              <span className={cn('flex items-center gap-0.5 text-[11px] font-semibold', inc ? 'text-rose-400' : 'text-emerald-400')}>
                                {inc ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                <span className="line-through text-[#5c6478]">{formatCurrency(p.prevPriceMonthly!)}</span>
                              </span>
                            )}
                            <span className="font-display font-bold">{formatCurrency(p.priceMonthly)}<span className="text-xs text-[#8B91A3] font-normal">/mo</span></span>
                          </div>
                        </div>
                        <ul className="mt-3 space-y-1.5">
                          {p.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-xs text-[#8B91A3]"><Check size={13} className="text-emerald-400 shrink-0" /> {f}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {comp.features.length > 0 && (
                <div>
                  <h3 className="font-display font-bold mb-3">Feature Availability (Pro)</h3>
                  <div className="rounded-lg border border-[#232838] divide-y divide-[#232838]">
                    {comp.features.slice(0, 10).map((f) => {
                      const v = f.byPlan['pro'];
                      return (
                        <div key={f.feature} className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="text-[#8B91A3]">{f.feature}</span>
                          {v === 'yes' ? <Check size={14} className="text-emerald-400" /> : v === 'limited' ? <Minus size={14} className="text-amber-400" /> : <X size={14} className="text-rose-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}