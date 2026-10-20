import { create } from 'zustand';
import { parseFilterSearch } from 'Lib/filterUrl';
import { DEFAULT_CUSTOMER_ID } from 'Lib/api';
import { customerIdSchema } from 'Lib/validation';
import type { DashboardFilters } from 'Lib/filterUrl';

interface FilterState extends DashboardFilters {
  customerId: string;
  set: (p: Partial<DashboardFilters>) => void;
  setCustomerId: (customerId: string) => void;
  resetPage: () => void;
}

const initialFilters =
  typeof window === 'undefined' ? parseFilterSearch('') : parseFilterSearch(window.location.search);

export const useFilters = create<FilterState>((set) => ({
  ...initialFilters,
  customerId: DEFAULT_CUSTOMER_ID,
  set: (filters) => set(filters),
  setCustomerId: (customerId) =>
    set((state) => {
      const validatedCustomerId = customerIdSchema.parse(customerId);
      if (validatedCustomerId === state.customerId) return state;
      return {
        ...parseFilterSearch(''),
        startDate: undefined,
        endDate: undefined,
        category: undefined,
        customerId: validatedCustomerId,
      };
    }),
  resetPage: () => set({ page: 0 }),
}));
