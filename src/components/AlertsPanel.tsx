import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, AlertTriangle, Mail, MessageSquare, Smartphone, Trash2 } from 'lucide-react';
import AlertRuleDialog from './AlertRuleDialog';
import { useAlerts } from '../hooks/useAlerts';
import { relativeDate } from '../lib/format';
import { cn } from '../lib/utils';

const sevStyle = { high: 'border-rose-500/40 bg-rose-500/5', medium: 'border-amber-500/40 bg-amber-500/5', low: 'border-[#232838] bg-[#12151C]' };
const sevDot = { high: 'text-rose-400', medium: 'text-amber-400', low: 'text-[#8B91A3]' };
const channelIcon = { email: Mail, slack: MessageSquare, inapp: Smartphone };

export default function AlertsPanel() {
  const { alerts, rules, dismissAlert, snoozeAlert, toggleRule, removeRule } = useAlerts();
  const active = alerts.filter((a) => !a.snoozed);
  const snoozed = alerts.filter((a) => a.snoozed);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Alerts</h1>
          <p className="text-sm text-[#8B91A3] mt-1">Get notified when competitors change pricing or plans.</p>
        </div>
        <AlertRuleDialog />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-display font-bold flex items-center gap-2"><AlertTriangle size={16} className="text-amber-400" /> Active Alerts ({active.length})</h2>
          <AnimatePresence initial={false}>
            {active.length === 0 && <div className="rounded-xl border border-[#232838] bg-[#12151C] p-8 text-sm text-[#8B91A3] text-center">No active alerts. Run a scan to detect changes.</div>}
            {active.map((a) => (
              <motion.div key={a.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className={cn('rounded-xl border p-4 transition-colors duration-200', sevStyle[a.severity])}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <Bell size={16} className={cn('mt-0.5 shrink-0', sevDot[a.severity])} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{a.title}</span>
                        <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded', sevDot[a.severity], 'bg-white/5')}>{a.severity}</span>
                      </div>
                      <p className="text-xs text-[#8B91A3] mt-1 leading-relaxed">{a.message}</p>
                      <div className="text-[10px] text-[#5c6478] mt-1.5">{relativeDate(a.timestamp)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => snoozeAlert(a.id)} title="Snooze" className="grid place-items-center w-7 h-7 rounded-md hover:bg-white/5 text-[#8B91A3] transition-colors duration-200"><BellOff size={14} /></button>
                    <button onClick={() => dismissAlert(a.id)} title="Dismiss" className="grid place-items-center w-7 h-7 rounded-md hover:bg-white/5 text-[#8B91A3] transition-colors duration-200"><X size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {snoozed.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs text-[#8B91A3] font-medium mb-2">Snoozed ({snoozed.length})</h3>
              {snoozed.map((a) => (
                <div key={a.id} className="rounded-lg border border-[#232838] bg-[#0f1218] p-3 mb-2 flex items-center justify-between opacity-60">
                  <span className="text-xs truncate">{a.title}</span>
                  <button onClick={() => snoozeAlert(a.id)} className="text-[11px] text-[#A5A8FF] hover:underline shrink-0 ml-2">Unsnooze</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="font-display font-bold">Alert Rules ({rules.length})</h2>
          {rules.length === 0 && <div className="rounded-xl border border-[#232838] bg-[#12151C] p-6 text-sm text-[#8B91A3] text-center">No rules. Create one to start.</div>}
          {rules.map((r) => {
            const Ch = channelIcon[r.channel];
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#232838] bg-[#12151C] p-4 hover:border-[#2e3550] transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#8B91A3]">
                      <Ch size={12} />
                      <span className="capitalize">{r.condition.replace('_', ' ')}</span>
                      {r.condition === 'price_change' && <span>· ±{r.threshold}%</span>}
                    </div>
                    <div className="text-[10px] text-[#5c6478] mt-1">{r.competitorIds.length ? `${r.competitorIds.length} tools` : 'All tools'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeRule(r.id)} className="text-[#8B91A3] hover:text-rose-400 transition-colors duration-200"><Trash2 size={14} /></button>
                    <button onClick={() => toggleRule(r.id)} className={cn('relative w-9 h-5 rounded-full transition-colors duration-200', r.enabled ? 'bg-[#6366F1]' : 'bg-[#232838]')}>
                      <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200', r.enabled ? 'translate-x-4' : 'translate-x-0.5')} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}