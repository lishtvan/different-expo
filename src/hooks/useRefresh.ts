import { useCallback, useState } from 'react';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

export function useRefresh<T>(
  refetch: () => Promise<T>,
  searchClient?: TypesenseInstantsearchAdapter
) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      if (searchClient) {
        searchClient.clearCache();
        setRefreshKey(Date.now());
      }
      setRefreshing(false);
    });
  }, []);
  return { refreshing, refreshKey, handleRefresh };
}
