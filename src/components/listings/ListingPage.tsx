import { EvilIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';
import { MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { useMutation, useQuery } from '@tanstack/react-query';
import MessageButton from 'components/chat/MessageButton';
import { mainColor } from 'constants/colors';
import { Image } from 'expo-image';
import { Link, Stack, router, useLocalSearchParams, useSegments } from 'expo-router';
import { FC, useMemo, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
// @ts-expect-error pinchable problem
import Pinchable from 'react-native-pinchable';
import Carousel from 'react-native-reanimated-carousel';
import { Button, Separator, Text, View } from 'tamagui';
import { ListingResponse, RFunc } from 'types';
import { avatarFb } from 'utils/avatarUrlFallback';
import { openConfirmationModal } from 'utils/confirmationModal';
import { fetcher } from 'utils/fetcher';
import { shareLink } from 'utils/share';

interface ListingImagesProps {
  imageUrls: string[];
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
  ORDER: { text: 'Створено замовлення', color: '#ff8f00' },
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

  const shareListing = () => shareLink(`listing/${listing.id}`);

  const onPressAction = ({ nativeEvent }: NativeActionEvent) => {
    const deleteText = 'Ви впевнені, що хочете видалити оголошення?';
    const menuActions: RFunc = {
      delete: () => openConfirmationModal(deleteText, mutation.mutate),
      edit: () => router.navigate({ pathname: '/edit_listing', params: { listingId: listing.id } }),
      share: shareListing,
    };

    const action = menuActions[nativeEvent.event];
    action();
  };

  const { color, text } = headerTitleStatusMapper[listing.status];
  if (mutation.error) throw mutation.error;

  return (
    <Stack.Screen
      options={{
        headerTitle: text,
        headerTitleStyle: { color },
        headerRight: () => {
          if (isOwnListing && listing.status === 'AVAILABLE') {
            return (
              <MenuView onPressAction={onPressAction} actions={menuActionsUi}>
                <TouchableOpacity className="py-1 pl-2">
                  <SimpleLineIcons name="options" size={22} />
                </TouchableOpacity>
              </MenuView>
            );
          }

          return (
            <TouchableOpacity onPress={shareListing} className="py-1 pl-2">
              <EvilIcons name="share-apple" size={36} />
            </TouchableOpacity>
          );
        },
      }}
    />
  );
};

const screenWidth = Dimensions.get('window').width;
const aspectRatio = 0.83;

const ListingImages: FC<ListingImagesProps> = ({ imageUrls }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <View>
      <Carousel
        loop={imageUrls.length > 1}
        width={screenWidth}
        height={screenWidth / aspectRatio}
        data={imageUrls}
        scrollAnimationDuration={300}
        onScrollEnd={(i) => setCurrentImageIndex(i)}
        renderItem={({ item }) => (
          <Pinchable maximumZoomScale={6} className="flex-1">
            <Image className="flex-1" contentFit="cover" source={{ uri: item }} alt="item" />
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
  const {
    data,
    isLoading,
    error: listingError,
  } = useQuery<ListingResponse>({
    queryKey: ['listing', listingId],
    queryFn: () => fetcher({ body: { listingId }, route: '/listing/get' }),
  });
  const { data: user, error: userError } = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });
  const [, segment] = useSegments();

  const userLink = useMemo(() => {
    if (!data) return;
    if (data.isOwnListing) return '/profile';
    if (segment) return `/${segment}/user/${data.listing.User.nickname}`;
    return { pathname: '/userg', params: { nickname: data.listing.User.nickname } };
  }, [segment, data]);

  if (listingError) throw listingError;
  if (userError) throw userError;
  if (isLoading || !data) return null;

  const { listing, isOwnListing, sellerAvailableListingsCount, sellerSoldListingsCount } = data;

  return (
    <View className="flex-1">
      <ListingMenu listing={listing} isOwnListing={isOwnListing} />
      <ScrollView className="flex-1">
        <ListingImages imageUrls={listing.imageUrls} />
        <View className="mb-20 mt-4 px-3">
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
              <Text className="mt-1 text-lg">{listing.description}</Text>
            </View>
          )}
          {listing.tags.length > 0 && (
            <View className="mt-3 flex  flex-row gap-x-2">
              {listing.tags.map((tag) => (
                <View
                  key={tag}
                  className="rounded-lg border border-main px-2 py-1 text-lg text-main">
                  <Text className="text-main">{tag}</Text>
                </View>
              ))}
            </View>
          )}
          {/* @ts-expect-error expo problem */}
          <Link asChild href={userLink}>
            <Pressable className="mt-4 flex-row gap-x-3">
              <Image
                className="h-14 w-14 rounded-full object-cover"
                source={{
                  uri: avatarFb(listing.User.avatarUrl),
                }}
                alt="selleravatar"
              />
              <View className="flex-1">
                <Text className="text-lg">{listing.User.nickname}</Text>
                <View className="mt-1.5 flex-row gap-x-2">
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
          <MessageButton
            icon={() => <Feather name="send" color="#737373" size={20} />}
            size="$4"
            className="mx-1.5 flex-1"
            fontSize="$6"
            borderRadius="$main"
            pathname="/chatf"
            recipientId={listing.userId}>
            Написати
          </MessageButton>
          {listing.status === 'AVAILABLE' && (
            <Link
              asChild
              href={{
                pathname: user ? '/create_order/' : '/auth',
                params: { listingId: listing.id },
              }}>
              <Button
                icon={() => <SimpleLineIcons name="bag" color="white" size={20} />}
                size="$4"
                className="mx-1.5 flex-1"
                theme="active"
                fontSize="$6"
                borderRadius="$main">
                Замовити
              </Button>
            </Link>
          )}
        </View>
      )}
    </View>
  );
}
