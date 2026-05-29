import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AppShell from './components/AppShell';
import DashboardOverview from './components/DashboardOverview';
import CompetitorGrid from './components/CompetitorGrid';
import PricingComparisonMatrix from './components/PricingComparisonMatrix';
import AlertsPanel from './components/AlertsPanel';
import AiInsightsPanel from './components/AiInsightsPanel';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardOverview />} />
          <Route path="competitors" element={<CompetitorGrid />} />
          <Route path="comparison" element={<PricingComparisonMatrix />} />
          <Route path="alerts" element={<AlertsPanel />} />
          <Route path="insights" element={<AiInsightsPanel />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}