import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { View } from 'tamagui';

import { fetcher } from '../../utils/fetcher';

export default function ListingPage() {
  const { listingId } = useLocalSearchParams();
  const { data: listingData, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => fetcher({ body: { listingId }, route: '/listing/get' }),
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
      <Link
        className="text-2xl"
        href={listingData.isOwnListing ? '/profile' : `/user/${listingData.listing.User.nickname}`}>
        User link
      </Link>
    </View>
  );
}
