import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center bg-[#0B0D12] text-[#E8EAF0] p-6">
          <div className="text-center max-w-sm">
            <div className="grid place-items-center w-14 h-14 rounded-2xl bg-rose-500/15 mx-auto mb-4"><AlertTriangle size={26} className="text-rose-400" /></div>
            <h1 className="font-display text-xl font-bold">Something went wrong</h1>
            <p className="text-sm text-[#8B91A3] mt-2">An unexpected error occurred while rendering the dashboard.</p>
            <button onClick={() => location.reload()} className="mt-5 h-10 px-5 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#5457e0] transition-all duration-200">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}