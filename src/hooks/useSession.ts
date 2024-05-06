import { useMemo } from 'react';
import { getSessionSync } from 'utils/secureStorage';

export const useSession = () => {
  const session = useMemo(() => {
    return getSessionSync();
  }, []);
  return session;
};
