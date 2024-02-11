import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { FC, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
// @ts-expect-error pwdq
import Pinchable from 'react-native-pinchable';
import Carousel from 'react-native-reanimated-carousel';
import { Separator, Text, View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import { TListing } from '../../types';
import { fetcher } from '../../utils/fetcher';

interface ListingImagesProps {
  imageUrls: string[];
}

const ListingImages: FC<ListingImagesProps> = ({ imageUrls }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const screenWidth = Dimensions.get('window').width;

  return (
    <View>
      <Carousel
        loop={imageUrls.length > 1}
        width={screenWidth}
        height={screenWidth}
        data={imageUrls}
        scrollAnimationDuration={300}
        onScrollEnd={(i) => setCurrentImageIndex(i)}
        renderItem={({ item }) => (
          <Pinchable maximumZoomScale={6} className="flex-1">
            <Image className="flex-1" source={{ uri: item }} alt="item" />
          </Pinchable>
        )}
      />

      {imageUrls.length > 1 && (
        <View className="absolute w-full">
          <View className="mx-auto mt-4">
            <AnimatedDotsCarousel
              length={imageUrls.length}
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
};

export default function ListingPage() {
  const { listingId } = useLocalSearchParams();
  const { data, isLoading } = useQuery<{ listing: TListing }>({
    queryKey: ['listing', listingId],
    queryFn: () => fetcher({ body: { listingId }, route: '/listing/get' }),
  });

  if (isLoading || !data) return null;

  const { listing } = data;

  return (
    <ScrollView className="flex-1">
      <ListingImages imageUrls={listing.imageUrls} />
      <View className="mt-4 px-3 mb-20">
        <Text className="text-lg">{listing.title}</Text>
        <Separator className="mt-2" />
        <Text className="mt-3 text-lg">
          <Text className="text-[#737373]">Дизайнер:</Text>
          {'  '} Takahiromiyashita The Soloist.
        </Text>
        <Text className="mt-2 text-lg">
          <Text className="text-[#737373]">Розмір:</Text>
          {'  '} {listing.size}
        </Text>
        <Text className="mt-2 text-lg">
          <Text className="text-[#737373]">Стан:</Text>
          {'  '} {listing.condition}
        </Text>
        <Separator className="mt-2" />
        {listing.description && (
          <View className="mt-2">
            <Text className="text-lg text-[#737373]">Опис</Text>
            <Text className="text-lg mt-1">
              Розмір Л фіт Л-ХЛ Стан дуже хороший Вся фурнітура YKK
            </Text>
          </View>
        )}
        {listing.tags.length > 0 && (
          <View className="flex flex-row  gap-x-2 mt-3">
            {listing.tags.map((tag) => (
              <View key={tag} className="rounded-lg border border-main px-2 py-1 text-lg text-main">
                <Text className="text-main text-base">{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
