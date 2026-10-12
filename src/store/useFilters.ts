import { create } from 'zustand';
import { parseFilterSearch } from '../lib/filterUrl';
import type { DashboardFilters } from '../lib/filterUrl';

interface FilterState extends DashboardFilters {
  set: (p: Partial<DashboardFilters>) => void;
  resetPage: () => void;
}

const initialFilters =
  typeof window === 'undefined' ? parseFilterSearch('') : parseFilterSearch(window.location.search);

export const useFilters = create<FilterState>((set) => ({
  ...initialFilters,
  set: (filters) => set(filters),
  resetPage: () => set({ page: 0 }),
}));
