import { useQuery } from '@tanstack/react-query';
import SaveListing from 'components/sell/SaveListing';
import { useRefreshOnFocus } from 'hooks/useRefreshOnFocus';
import { fetcher } from 'utils/fetcher';

export default function SellScreen() {
  const user = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });
  useRefreshOnFocus(user.refetch);
  if (user.error) throw user.error;
  if (user.isLoading || !user.data) return null;

  return (
    <SaveListing listing={{}} user={{ cardNumber: user.data.cardNumber, phone: user.data.phone }} />
  );
}
