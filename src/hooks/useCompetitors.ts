import { create } from 'zustand';
import type { Competitor } from '../lib/sampleData';
import { sampleCompetitors } from '../lib/sampleData';

interface CompetitorState {
  competitors: Competitor[];
  selectedId: string | null;
  setSelected: (id: string | null) => void;
  addCompetitor: (c: Competitor) => void;
  removeCompetitor: (id: string) => void;
  setCompetitors: (c: Competitor[]) => void;
}

export const useCompetitors = create<CompetitorState>((set) => ({
  competitors: sampleCompetitors,
  selectedId: null,
  setSelected: (id) => set({ selectedId: id }),
  addCompetitor: (c) => set((s) => ({ competitors: [...s.competitors, c] })),
  removeCompetitor: (id) => set((s) => ({ competitors: s.competitors.filter((x) => x.id !== id) })),
  setCompetitors: (c) => set({ competitors: c }),
}));