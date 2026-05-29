import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, Lightbulb, Target, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAiInsights } from '../hooks/useAiInsights';
import { relativeDate } from '../lib/format';
import { cn } from '../lib/utils';

const tagStyle: Record<string, { icon: any; color: string; label: string }> = {
  trend: { icon: TrendingUp, color: 'text-sky-400', label: 'Trend' },
  opportunity: { icon: Lightbulb, color: 'text-emerald-400', label: 'Opportunity' },
  gap: { icon: Target, color: 'text-amber-400', label: 'Gap' },
  answer: { icon: MessageCircle, color: 'text-[#A5A8FF]', label: 'Answer' },
};

const SUGGESTIONS = ['Who has the cheapest Pro plan?', 'What is the average Pro price?', 'How do annual discounts compare?', 'Which features are gated to Business?'];

export default function AiInsightsPanel() {
  const { insights, streaming, streamingText, ask } = useAiInsights();
  const [input, setInput] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => { feedRef.current?.scrollTo({ top: 0 }); }, [insights.length, streamingText]);

  const send = (q?: string) => {
    const text = (q ?? input).trim();
    if (!text || streaming) return;
    ask(text);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-4">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Sparkles size={22} className="text-[#6366F1]" /> AI Insights</h1>
        <p className="text-sm text-[#8B91A3] mt-1">Strategic competitive intelligence from your agent.</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => send(s)} disabled={streaming} className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#232838] text-[#8B91A3] hover:border-[#6366F1]/40 hover:text-[#A5A8FF] transition-all duration-200 disabled:opacity-50">{s}</button>
        ))}
      </div>

      <div ref={feedRef} className="flex-1 rounded-xl border border-[#232838] bg-[#12151C] p-4 sm:p-5 overflow-y-auto space-y-4 flex flex-col-reverse">
        <div className="space-y-4">
          {streaming && (
            <div className="flex gap-3">
              <div className="grid place-items-center w-8 h-8 rounded-lg bg-[#6366F1]/15 shrink-0"><Sparkles size={15} className="text-[#A5A8FF]" /></div>
              <div className="rounded-xl bg-[#171B24] border border-[#232838] px-4 py-3 max-w-[80%]">
                <p className="text-sm leading-relaxed">{streamingText}<span className="inline-block w-1.5 h-4 ml-0.5 bg-[#6366F1] align-middle animate-pulse" /></p>
              </div>
            </div>
          )}
          {insights.map((m) => {
            if (m.role === 'user') {
              return (
                <div key={m.id} className="flex justify-end">
                  <div className="rounded-xl bg-[#6366F1] text-white px-4 py-2.5 max-w-[75%]">
                    <p className="text-sm">{m.text}</p>
                  </div>
                </div>
              );
            }
            const t = m.tag ? tagStyle[m.tag] : tagStyle.answer;
            const Icon = t.icon;
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <div className="grid place-items-center w-8 h-8 rounded-lg bg-[#6366F1]/15 shrink-0"><Sparkles size={15} className="text-[#A5A8FF]" /></div>
                <div className="rounded-xl bg-[#171B24] border border-[#232838] px-4 py-3 max-w-[80%]">
                  <div className={cn('flex items-center gap-1.5 text-[11px] font-semibold mb-1.5', t.color)}><Icon size={12} /> {t.label}</div>
                  <p className="text-sm leading-relaxed text-[#E8EAF0]">{m.text}</p>
                  <div className="text-[10px] text-[#5c6478] mt-1.5">{relativeDate(m.timestamp)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 relative">
        <textarea rows={1} value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask the agent about your competitive set..."
          className="w-full resize-none rounded-xl bg-[#12151C] border border-[#232838] py-3 pl-4 pr-12 text-sm placeholder:text-[#8B91A3] focus:outline-none focus:border-[#6366F1]/60 transition-colors duration-200" />
        <button onClick={() => send()} disabled={streaming || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-lg bg-[#6366F1] text-white hover:bg-[#5457e0] transition-colors duration-200 disabled:opacity-50">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}