import { useMemo } from 'react';
import { motion } from 'framer-motion';
import KpiStatCard from './KpiStatCard';
import PriceTrendChart from './PriceTrendChart';
import PriceChangeTimeline from './PriceChangeTimeline';
import { useCompetitors } from '../hooks/useCompetitors';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { useAlerts } from '../hooks/useAlerts';

export default function DashboardOverview() {
  const { competitors } = useCompetitors();
  const { events, history } = usePriceHistory();
  const { alerts } = useAlerts();

  const totalPlans = competitors.reduce((s, c) => s + c.plans.length, 0);
  const activeAlerts = alerts.filter((a) => !a.snoozed).length;

  const spark = useMemo(() => history.slice(-8).map((h) => Number(h['slack']) || 0), [history]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[#8B91A3] mt-1">Competitive pricing intelligence across your tracked SaaS tools.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiStatCard index={0} label="Tools Tracked" value={String(competitors.length)} delta={0} spark={[4,5,5,6,7,8,9,10]} />
        <KpiStatCard index={1} label="Plans Monitored" value={String(totalPlans)} delta={5} spark={[28,30,31,33,34,36,37,totalPlans]} />
        <KpiStatCard index={2} label="Changes This Scan" value={String(events.length || 7)} delta={40} spark={[2,3,3,5,4,6,7,events.length||7]} />
        <KpiStatCard index={3} label="Active Alerts" value={String(activeAlerts)} delta={activeAlerts > 2 ? 12 : -10} spark={spark.length ? spark : [3,3,2,4,3,2,3,activeAlerts]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2"><PriceTrendChart /></div>
        <div className="lg:col-span-1"><PriceChangeTimeline /></div>
      </div>
    </div>
  );
}