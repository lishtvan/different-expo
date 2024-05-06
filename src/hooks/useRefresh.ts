import { useCallback, useState } from 'react';

export function useRefresh<T>(refetch: () => Promise<T>) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
      setRefreshKey(Date.now());
    });
  }, [refetch]);
  const handleRefreshWithoutSpinner = useCallback(() => {
    refetch().then(() => setRefreshKey(Date.now()));
  }, [refetch]);
  return { refreshing, refreshKey, handleRefresh, handleRefreshWithoutSpinner };
}
