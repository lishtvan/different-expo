import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { View } from "tamagui";
import { fetcher } from "../utils/fetcher";

export default function OrdersScreen() {
  const { listingId } = useLocalSearchParams();
  const { data: listingData, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => fetcher({ body: { listingId }, route: "/listing/get" }),
  });
  if (isLoading) return null;

  return (
    <View className="px-2">
      <Text>{listingData.listing.title}</Text>
      <Text>{listingData.listing.designer}</Text>
      <Text>{listingData.listing.condition}</Text>
      <Text>{listingData.listing.category}</Text>
      <Text>{listingData.listing.size}</Text>
      <Text>Listing</Text>
    </View>
  );
}

const a = {
  isOwnListing: true,
  listing: {
    User: { avatarUrl: null, id: 1, nickname: "different_user_1" },
    cardNumber: "5375 4114 1869 7863",
    category: "Футболки",
    condition: "Новий",
    createdAt: "2023-07-29T13:32:26.609Z",
    description: null,
    designer: "Nike",
    id: 1,
    imageUrls: [
      "https://s3.eu-central-1.amazonaws.com/different.dev/XYqLjrlOQd2byMXNXE6DpQ-0000000000:w=480&h=640",
    ],
    phone: "380965134969",
    price: 1000,
    size: "US XXS / EU 40",
    status: "AVAILABLE",
    tags: [],
    title: "Куртка Nike",
    userId: 1,
  },
  sellerAvailableListingsCount: 2,
  sellerSoldListingsCount: 0,
};
