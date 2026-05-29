import { AnimatePresence, motion } from 'framer-motion';
import { Radar, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAgentScan } from '../hooks/useAgentScan';

export default function ScanProgressToast() {
  const { scanning, progress, currentTool, changesDetected } = useAgentScan();
  const [showDone, setShowDone] = useState(false);
  const [prevScanning, setPrevScanning] = useState(false);

  useEffect(() => {
    if (prevScanning && !scanning) {
      setShowDone(true);
      const t = setTimeout(() => setShowDone(false), 3500);
      return () => clearTimeout(t);
    }
    setPrevScanning(scanning);
  }, [scanning, prevScanning]);

  return (
    <AnimatePresence>
      {(scanning || showDone) && (
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 rounded-xl border border-[#232838] bg-[#12151C] shadow-2xl shadow-black/40 p-4">
          {scanning ? (
            <>
              <div className="flex items-center gap-2.5">
                <Radar size={18} className="text-[#6366F1] animate-spin" style={{ animationDuration: '2s' }} />
                <span className="font-semibold text-sm">Scanning pricing pages…</span>
                <span className="ml-auto text-xs text-[#8B91A3]">{progress}%</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[#0E1016] overflow-hidden">
                <motion.div className="h-full bg-[#6366F1]" animate={{ width: `${progress}%` }} transition={{ duration: 0.25 }} />
              </div>
              <div className="mt-2 text-xs text-[#8B91A3]">{currentTool ? `Crawling ${currentTool}…` : 'Initializing…'}</div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <div>
                <div className="font-semibold text-sm">Scan complete</div>
                <div className="text-xs text-[#8B91A3]">{changesDetected} pricing {changesDetected === 1 ? 'change' : 'changes'} detected</div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}