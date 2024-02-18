import { EvilIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';
import { MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { FC, useState } from 'react';
import { Alert, Dimensions, Platform, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
// @ts-expect-error pinchable problem
import Pinchable from 'react-native-pinchable';
import Carousel from 'react-native-reanimated-carousel';
import { Button, Separator, Text, View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import { RFunc, TListing } from '../../types';
import { avatarFb } from '../../utils/avatarUrlFallback';
import { fetcher } from '../../utils/fetcher';
import { shareLink } from '../../utils/share';

interface ListingImagesProps {
  imageUrls: string[];
}

interface ListingResponse {
  listing: TListing<number>;
  isOwnListing: boolean;
  sellerSoldListingsCount: boolean;
  sellerAvailableListingsCount: boolean;
}

const menuActionsUi = [
  {
    id: 'edit',
    title: 'Редагувати',
    imageColor: 'black',
    image: Platform.select({ ios: 'square.and.pencil', android: 'ic_menu_edit' }),
  },
  {
    id: 'share',
    title: 'Поширити',
    imageColor: 'black',
    image: Platform.select({ ios: 'square.and.arrow.up', android: 'ic_menu_share' }),
  },
  {
    id: 'delete',
    title: 'Видалити',
    attributes: { destructive: true },
    image: Platform.select({ ios: 'trash', android: 'ic_menu_delete' }),
  },
];

const headerTitleStatusMapper = {
  ORDER: { text: 'Створено замовлення', color: 'red' },
  SOLD: { text: 'Продано', color: mainColor },
  AVAILABLE: { text: 'В наявності', color: 'black' },
};

const ListingMenu: FC<Pick<ListingResponse, 'listing' | 'isOwnListing'>> = ({
  listing,
  isOwnListing,
}) => {
  const mutation = useMutation({
    mutationFn: () =>
      fetcher({ route: '/listing/delete', method: 'POST', body: { listingId: listing.id } }),
    onSuccess: () => router.back(),
  });

  const openConfirmationModal = () => {
    Alert.alert('Ви впевнені, що хочете видалити оголошення?', '', [
      { text: 'Ні', onPress: () => {}, style: 'cancel' },
      { text: 'Так', onPress: () => mutation.mutate() },
    ]);
  };

  const shareListing = () => shareLink(`listing/${listing.id}`);

  const onPressAction = ({ nativeEvent }: NativeActionEvent) => {
    const menuActions: RFunc = {
      delete: openConfirmationModal,
      edit: () => console.log('edit'),
      share: shareListing,
    };

    const action = menuActions[nativeEvent.event];
    action();
  };

  const { color, text } = headerTitleStatusMapper[listing.status];

  return (
    <Stack.Screen
      options={{
        headerTitle: text,
        headerTitleStyle: { color },
        headerRight: () => {
          if (isOwnListing && listing.status === 'AVAILABLE') {
            return (
              <MenuView onPressAction={onPressAction} actions={menuActionsUi}>
                <TouchableOpacity className="pl-2 py-1">
                  <SimpleLineIcons name="options" size={22} />
                </TouchableOpacity>
              </MenuView>
            );
          }

          return (
            <TouchableOpacity onPress={shareListing} className="pl-2 py-1">
              <EvilIcons name="share-apple" size={36} />
            </TouchableOpacity>
          );
        },
      }}
    />
  );
};

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
  const { data, isLoading } = useQuery<ListingResponse>({
    queryKey: ['listing', listingId],
    queryFn: () => fetcher({ body: { listingId }, route: '/listing/get' }),
  });

  if (isLoading || !data) return null;

  const { listing, isOwnListing, sellerAvailableListingsCount, sellerSoldListingsCount } = data;

  return (
    <View className="flex-1">
      <ListingMenu listing={listing} isOwnListing={isOwnListing} />
      <ScrollView className="flex-1">
        <ListingImages imageUrls={listing.imageUrls} />
        <View className="mt-4 px-3 mb-20">
          <Text className="text-lg">{listing.title}</Text>
          <Separator className="mt-2" />
          <Text className="mt-3 text-lg">
            <Text className="text-[#737373]">Дизайнер:</Text>
            {'  '} {listing.designer}
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
                  uri: avatarFb(listing.User.avatarUrl),
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
      {!isOwnListing && (
        <View flexGrow={1} className="absolute bottom-0 w-full flex-row px-2 py-2">
          <Button
            icon={() => <Feather name="send" color="#737373" size={20} />}
            size="$4"
            className="flex-1 mx-1.5"
            fontSize="$6"
            borderRadius="$main">
            Написати
          </Button>
          {listing.status === 'AVAILABLE' && (
            <Button
              icon={() => <SimpleLineIcons name="bag" color="white" size={20} />}
              size="$4"
              className="flex-1 mx-1.5"
              theme="active"
              fontSize="$6"
              borderRadius="$main">
              Замовити
            </Button>
          )}
        </View>
      )}
    </View>
  );
}
