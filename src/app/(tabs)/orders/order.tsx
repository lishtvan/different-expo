import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'tamagui';

export default function OrderScreen() {
  const { orderId } = useLocalSearchParams();
  return (
    <View>
      <Text>new order {orderId}</Text>
    </View>
  );
}
