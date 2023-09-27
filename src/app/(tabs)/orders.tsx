import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";
import { View } from "tamagui";
import { fetcher } from "../../utils/fetcher";

export default function OrdersScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetcher({ route: "/order/getMany" }),
  });
  if (isLoading) return null;
  if (!data) return null;
  return (
    <View>
      <Text>order tab</Text>
    </View>
  );
}
