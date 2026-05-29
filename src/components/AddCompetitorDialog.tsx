import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompetitors } from '../hooks/useCompetitors';
import { COMPETITOR_CATEGORIES } from '../lib/sampleData';
import toast from 'react-hot-toast';

const COLORS = ['#6366F1', '#F24E1E', '#34d399', '#FCB400', '#1F8DED', '#F06A6A'];

export default function AddCompetitorDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(COMPETITOR_CATEGORIES[0]);
  const { addCompetitor } = useCompetitors();

  const submit = () => {
    if (!name.trim() || !url.trim()) { toast.error('Name and pricing URL required'); return; }
    addCompetitor({
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name, category, logoColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      pricingUrl: url, lastChange: new Date().toISOString(), health: 'healthy',
      plans: [
        { id: 'free', name: 'Free', priceMonthly: 0, priceAnnual: 0, features: ['Basic features'] },
        { id: 'pro', name: 'Pro', priceMonthly: 12, priceAnnual: 120, highlight: true, features: ['Advanced features', 'API access'] },
        { id: 'biz', name: 'Business', priceMonthly: 30, priceAnnual: 300, features: ['SSO', 'Audit logs'] },
      ],
      features: [],
    });
    toast.success(`${name} added to monitoring`);
    setName(''); setUrl(''); setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5457e0] transition-all duration-200">
        <Plus size={16} strokeWidth={2} /> <span className="hidden sm:inline">Add Competitor</span><span className="sm:hidden">Add</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#232838] bg-[#12151C] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold">Add Competitor</h2>
                <button onClick={() => setOpen(false)} className="text-[#8B91A3] hover:text-white transition-colors duration-200"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#8B91A3] font-medium">Tool name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Loom" className="mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0E1016] border border-[#232838] text-sm focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200" />
                </div>
                <div>
                  <label className="text-xs text-[#8B91A3] font-medium">Pricing page URL</label>
                  <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0E1016] border border-[#232838] text-sm focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200" />
                </div>
                <div>
                  <label className="text-xs text-[#8B91A3] font-medium">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full h-10 px-3 rounded-lg bg-[#0E1016] border border-[#232838] text-sm focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200">
                    {COMPETITOR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setOpen(false)} className="flex-1 h-10 rounded-lg border border-[#232838] text-sm font-medium hover:bg-white/5 transition-colors duration-200">Cancel</button>
                <button onClick={submit} className="flex-1 h-10 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5457e0] transition-colors duration-200">Add</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}