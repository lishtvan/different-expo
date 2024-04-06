import { useQuery } from '@tanstack/react-query';
import SaveListing from 'components/sell/SaveListing';
import { fetcher } from 'utils/fetcher';

export default function SellScreen() {
  const user = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });
  if (user.isLoading || !user.data) return null;

  return (
    <SaveListing listing={{}} user={{ cardNumber: user.data.cardNumber, phone: user.data.phone }} />
  );
}
