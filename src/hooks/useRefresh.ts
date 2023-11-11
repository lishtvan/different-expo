import { useCallback, useState } from 'react';

export function useRefresh<T>(refetch: () => Promise<T>) {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, []);
  return { refreshing, handleRefresh };
}
