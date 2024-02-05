import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
// @ts-expect-error pwdq
import Pinchable from 'react-native-pinchable';
import Carousel from 'react-native-reanimated-carousel';
import { View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import { TListing } from '../../types';
import { fetcher } from '../../utils/fetcher';

export default function ListingPage() {
  const { listingId } = useLocalSearchParams();
  const { data, isLoading } = useQuery<{ listing: TListing }>({
    queryKey: ['listing', listingId],
    queryFn: () => fetcher({ body: { listingId }, route: '/listing/get' }),
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading || !data) return null;

  const { listing } = data;
  const screenWidth = Dimensions.get('window').width;

  return (
    <View className="flex-1">
      <Carousel
        loop={listing.imageUrls.length > 1}
        width={screenWidth}
        height={screenWidth}
        data={listing.imageUrls}
        scrollAnimationDuration={300}
        onScrollEnd={(i) => setCurrentImageIndex(i)}
        renderItem={({ item }) => (
          <Pinchable maximumZoomScale={6} className="flex-1">
            <Image className="flex-1" source={{ uri: item }} alt="item" />
          </Pinchable>
        )}
      />

      {listing.imageUrls.length > 1 && (
        <View className="absolute w-full">
          <View className="mx-auto mt-4">
            <AnimatedDotsCarousel
              length={listing.imageUrls.length}
              currentIndex={currentImageIndex}
              maxIndicators={4}
              activeIndicatorConfig={{ color: mainColor, margin: 3, opacity: 1, size: 8 }}
              inactiveIndicatorConfig={{ color: 'gray', margin: 3, opacity: 0.5, size: 8 }}
              decreasingDots={[
                { config: { color: 'gray', margin: 3, opacity: 0.5, size: 6 }, quantity: 1 },
                { config: { color: 'gray', margin: 3, opacity: 0.5, size: 4 }, quantity: 1 },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}
