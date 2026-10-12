import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseFilterSearch, serializeFilterSearch } from '../lib/filterUrl';
import { useFilters } from '../store/useFilters';

export function FilterUrlSync() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const parsed = parseFilterSearch(location.search);
    const current = useFilters.getState();
    if (
      current.period !== parsed.period ||
      current.startDate !== parsed.startDate ||
      current.endDate !== parsed.endDate ||
      current.category !== parsed.category ||
      current.sortBy !== parsed.sortBy ||
      current.page !== parsed.page ||
      current.limit !== parsed.limit ||
      current.months !== parsed.months
    ) {
      current.set({
        ...parsed,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        category: parsed.category,
      });
    }
  }, [location.search]);

  useEffect(() => {
    const unsubscribe = useFilters.subscribe((state) => {
      const search = serializeFilterSearch(state);
      const currentSearch = location.search.replace(/^\?/, '');
      if (search !== currentSearch) {
        navigate(
          { pathname: location.pathname, search: search ? `?${search}` : '' },
          { replace: true },
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, [location.pathname, location.search, navigate]);

  return null;
}
