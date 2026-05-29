import { useMemo, useState } from 'react';
import { Check, X, Minus, Search } from 'lucide-react';
import { useCompetitors } from '../hooks/useCompetitors';
import { useComparisonFilters } from '../hooks/useComparisonFilters';
import { FEATURE_CATEGORIES } from '../lib/sampleData';
import { cn } from '../lib/utils';

function Cell({ v }: { v?: 'yes' | 'no' | 'limited' }) {
  if (v === 'yes') return <Check size={16} className="text-emerald-400 mx-auto" />;
  if (v === 'limited') return <Minus size={16} className="text-amber-400 mx-auto" />;
  return <X size={16} className="text-rose-400/70 mx-auto" />;
}

export default function FeatureComparisonTable() {
  const { competitors } = useCompetitors();
  const { featureCategory, setFeatureCategory } = useComparisonFilters();
  const [q, setQ] = useState('');

  const withFeatures = competitors.filter((c) => c.features.length > 0).slice(0, 6);
  const featureRows = useMemo(() => {
    const base = withFeatures[0]?.features ?? [];
    return base.filter((f) =>
      (!featureCategory || f.category === featureCategory) &&
      (!q || f.feature.toLowerCase().includes(q.toLowerCase()))
    );
  }, [withFeatures, featureCategory, q]);

  return (
    <div className="rounded-xl border border-[#232838] bg-[#12151C]">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[#232838]">
        <h2 className="font-display text-lg font-bold">Feature Gating (Pro tier)</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B91A3]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search features" className="h-9 pl-8 pr-3 rounded-lg bg-[#0E1016] border border-[#232838] text-sm w-36 sm:w-44 focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200" />
          </div>
          <select value={featureCategory ?? ''} onChange={(e) => setFeatureCategory(e.target.value || null)} className="h-9 px-3 rounded-lg bg-[#0E1016] border border-[#232838] text-sm focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200">
            <option value="">All categories</option>
            {FEATURE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#232838]">
              <th className="text-left font-medium text-[#8B91A3] px-5 py-3 sticky left-0 bg-[#12151C] min-w-[220px]">Feature</th>
              {withFeatures.map((c) => (
                <th key={c.id} className="px-3 py-3 text-center min-w-[90px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-6 h-6 rounded grid place-items-center text-white text-[11px] font-bold font-display" style={{ background: c.logoColor }}>{c.name[0]}</span>
                    <span className="text-[11px] text-[#8B91A3]">{c.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map((f, i) => (
              <tr key={f.feature} className={cn('border-b border-[#1c2030] hover:bg-[#171B24] transition-colors duration-200', i % 2 ? 'bg-[#0f1218]' : '')}>
                <td className="px-5 py-3 sticky left-0 bg-inherit">
                  <div className="text-sm">{f.feature}</div>
                  <div className="text-[10px] text-[#5c6478]">{f.category}</div>
                </td>
                {withFeatures.map((c) => {
                  const cf = c.features.find((x) => x.feature === f.feature);
                  return <td key={c.id} className="px-3 py-3 text-center"><Cell v={cf?.byPlan['pro']} /></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {featureRows.length === 0 && <div className="p-8 text-center text-sm text-[#8B91A3]">No features match.</div>}
      </div>
      <div className="flex items-center gap-4 px-5 py-3 border-t border-[#232838] text-xs text-[#8B91A3]">
        <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Included</span>
        <span className="flex items-center gap-1.5"><Minus size={13} className="text-amber-400" /> Limited</span>
        <span className="flex items-center gap-1.5"><X size={13} className="text-rose-400/70" /> Not available</span>
      </div>
    </div>
  );
}