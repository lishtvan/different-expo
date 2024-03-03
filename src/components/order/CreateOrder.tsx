import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'tamagui';

type CreateOrderParams = {
  listingId: string;
  CityRecipient: string;
  RecipientAddress: string;
};

export default function CreateOrder() {
  const params = useLocalSearchParams<CreateOrderParams>();

  return (
    <View className="flex-1">
      <Text>Замовлення {params.listingId}</Text>
    </View>
  );
}
