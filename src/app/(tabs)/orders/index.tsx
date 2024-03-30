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
          params: { orderId: '379b9bf4-1110-48de-a2ac-ffad57d61555' },
        }}>
        go to order
      </Link>
    </View>
  );
}
