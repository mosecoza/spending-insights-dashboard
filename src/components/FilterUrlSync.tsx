import { useEffect } from 'react';
import { parseFilterSearch, serializeFilterSearch } from '../lib/filterUrl';
import { useFilters } from '../store/useFilters';

export function FilterUrlSync() {
  useEffect(() => {
    const syncToUrl = (state: ReturnType<typeof useFilters.getState>) => {
      const search = serializeFilterSearch(state);
      const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextUrl !== currentUrl) window.history.replaceState(window.history.state, '', nextUrl);
    };
    const unsubscribe = useFilters.subscribe((state) => syncToUrl(state));
    const handlePopState = () => useFilters.getState().set(parseFilterSearch(window.location.search));

    syncToUrl(useFilters.getState());
    window.addEventListener('popstate', handlePopState);
    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
}
