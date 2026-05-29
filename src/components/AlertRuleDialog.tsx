import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlerts } from '../hooks/useAlerts';
import { useCompetitors } from '../hooks/useCompetitors';
import toast from 'react-hot-toast';

export default function AlertRuleDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [condition, setCondition] = useState<'price_change' | 'new_plan' | 'feature_change'>('price_change');
  const [threshold, setThreshold] = useState(5);
  const [channel, setChannel] = useState<'email' | 'slack' | 'inapp'>('inapp');
  const [scope, setScope] = useState<string[]>([]);
  const { addRule } = useAlerts();
  const { competitors } = useCompetitors();

  const submit = () => {
    if (!name.trim()) { toast.error('Rule name required'); return; }
    addRule({ id: 'r-' + Date.now(), name, competitorIds: scope, condition, threshold, channel, enabled: true });
    toast.success('Alert rule created');
    setName(''); setScope([]); setOpen(false);
  };

  const toggleScope = (id: string) => setScope((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5457e0] transition-all duration-200">
        <Plus size={16} strokeWidth={2} /> <span className="hidden sm:inline">New Rule</span><span className="sm:hidden">Rule</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#232838] bg-[#12151C] p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold">New Alert Rule</h2>
                <button onClick={() => setOpen(false)} className="text-[#8B91A3] hover:text-white transition-colors duration-200"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#8B91A3] font-medium">Rule name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Watch competitor hikes" className="mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0E1016] border border-[#232838] text-sm focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200" />
                </div>
                <div>
                  <label className="text-xs text-[#8B91A3] font-medium">Condition</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {([['price_change','Price change'],['new_plan','New plan'],['feature_change','Feature change']] as const).map(([v, l]) => (
                      <button key={v} onClick={() => setCondition(v)} className={`h-9 rounded-lg text-xs font-medium border transition-all duration-200 ${condition === v ? 'border-[#6366F1] bg-[#6366F1]/15 text-[#A5A8FF]' : 'border-[#232838] text-[#8B91A3] hover:border-[#2e3550]'}`}>{l}</button>
                    ))}
                  </div>
                </div>
                {condition === 'price_change' && (
                  <div>
                    <label className="text-xs text-[#8B91A3] font-medium flex justify-between"><span>Threshold</span><span className="text-[#A5A8FF] font-semibold">±{threshold}%</span></label>
                    <input type="range" min={1} max={30} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="mt-2 w-full accent-[#6366F1]" />
                  </div>
                )}
                <div>
                  <label className="text-xs text-[#8B91A3] font-medium">Notification channel</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {([['inapp','In-app'],['email','Email'],['slack','Slack']] as const).map(([v, l]) => (
                      <button key={v} onClick={() => setChannel(v)} className={`h-9 rounded-lg text-xs font-medium border transition-all duration-200 ${channel === v ? 'border-[#6366F1] bg-[#6366F1]/15 text-[#A5A8FF]' : 'border-[#232838] text-[#8B91A3] hover:border-[#2e3550]'}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#8B91A3] font-medium">Scope (leave empty for all)</label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {competitors.map((c) => (
                      <button key={c.id} onClick={() => toggleScope(c.id)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 ${scope.includes(c.id) ? 'border-[#6366F1]/50 bg-[#6366F1]/15 text-[#A5A8FF]' : 'border-[#232838] text-[#8B91A3] hover:border-[#2e3550]'}`}>{c.name}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setOpen(false)} className="flex-1 h-10 rounded-lg border border-[#232838] text-sm font-medium hover:bg-white/5 transition-colors duration-200">Cancel</button>
                <button onClick={submit} className="flex-1 h-10 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5457e0] transition-colors duration-200">Create Rule</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}