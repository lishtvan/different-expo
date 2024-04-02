import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Text } from 'react-native';
import { View } from 'tamagui';

import { fetcher } from '../../../utils/fetcher';

export default function OrdersScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetcher({ route: '/order/getMany' }),
  });
  if (isLoading) return null;
  if (!data) return null;

  return (
    <View>
      <Text>orders tab</Text>
      <Link
        href={{
          pathname: '/orders/order',
          params: { orderId: '98c140ec-29a1-4f91-9fdd-766920864eeb' },
        }}>
        go to order
      </Link>
    </View>
  );
}
