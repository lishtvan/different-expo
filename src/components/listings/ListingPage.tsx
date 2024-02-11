import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { FC, useState } from 'react';
import { Dimensions, Pressable, ScrollView } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
// @ts-expect-error pwdq
import Pinchable from 'react-native-pinchable';
import Carousel from 'react-native-reanimated-carousel';
import { Button, Separator, Text, View } from 'tamagui';

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
  const { data, isLoading } = useQuery<{
    listing: TListing;
    isOwnListing: boolean;
    sellerSoldListingsCount: boolean;
    sellerAvailableListingsCount: boolean;
  }>({
    queryKey: ['listing', listingId],
    queryFn: () => fetcher({ body: { listingId }, route: '/listing/get' }),
  });

  if (isLoading || !data) return null;

  const { listing, isOwnListing, sellerAvailableListingsCount, sellerSoldListingsCount } = data;

  return (
    <View className="flex-1">
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
          <View className="mt-2 flex-row justify-between">
            <Text className="text-lg">
              <Text className="text-[#737373]">Стан:</Text>
              {'  '} {listing.condition}
            </Text>
            <Text className="text-xl font-bold">{listing.price} грн</Text>
          </View>
          <Separator className="mt-2" />
          {listing.description && (
            <View className="mt-2">
              <Text className="text-lg text-[#737373]">Опис</Text>
              <Text className="text-lg mt-1">{listing.description}</Text>
            </View>
          )}
          {listing.tags.length > 0 && (
            <View className="flex flex-row  gap-x-2 mt-3">
              {listing.tags.map((tag) => (
                <View
                  key={tag}
                  className="rounded-lg border border-main px-2 py-1 text-lg text-main">
                  <Text className="text-main">{tag}</Text>
                </View>
              ))}
            </View>
          )}
          <Link asChild href={isOwnListing ? '/profile' : `/user/${listing.User.nickname}`}>
            <Pressable className="flex-row mt-4 gap-x-3">
              <Image
                className="h-14 w-14 rounded-full object-cover"
                source={{
                  uri:
                    listing.User.avatarUrl ||
                    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
                }}
                alt="selleravatar"
              />
              <View className="flex-1">
                <Text className="text-lg">{listing.User.nickname}</Text>
                <View className="flex-row gap-x-2 mt-1.5">
                  <Text className="text-[#737373]">{sellerAvailableListingsCount} оголошень</Text>
                  <Text className="text-[#737373]">{sellerSoldListingsCount} продано</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 w-full flex flex-row gap-x-4 justify-between px-4 py-2">
        <Button
          icon={() => <AntDesign name="message1" size={20} />}
          size="$4"
          fontSize="$6"
          className="w-[47.5%]"
          borderRadius="$main">
          Написати
        </Button>
        <Button
          icon={() => <SimpleLineIcons name="bag" color="white" size={20} />}
          size="$4"
          theme="active"
          className="w-[47.5%]"
          fontSize="$6"
          borderRadius="$main">
          Замовити
        </Button>
      </View>
    </View>
  );
}
