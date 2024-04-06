import { useEffect, useState } from 'react';
import { getSession } from 'utils/secureStorage';

export const useSession = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getSessionToken = async () => {
      const sessionToken = await getSession();
      setToken(sessionToken);
    };

    getSessionToken();
  }, []);

  return token;
};
