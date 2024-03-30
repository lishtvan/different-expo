import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable } from 'react-native';
import { View, Text, Separator } from 'tamagui';

import { avatarFb } from '../../../utils/avatarUrlFallback';
import { transformPhone } from '../../../utils/common';
import { fetcher } from '../../../utils/fetcher';

export default function OrderScreen() {
  const { orderId } = useLocalSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetcher({ body: { orderId }, route: '/order/get' }),
  });

  if (isLoading) return null;
  const { order, orderType } = data;

  return (
    <View className="flex-1 px-3 py-2">
      <Stack.Screen
        options={{
          headerRight: () => <Text>30 березня 16:45</Text>,
        }}
      />
      <View className="flex-row gap-x-3">
        <Image
          className="aspect-[0.83] w-20 rounded-lg"
          // source={data.order.Listing.imageUrls[0]}
          source="https://media-assets.grailed.com/prd/listing/34136372/a26812a0f0bd41f5bde6765ac16f8418?w=480&h=640&fit=clip&q=20&auto=format"
          alt="item"
          contentFit="cover"
          transition={200}
        />
        <View className="w-full flex-1">
          <Text className="font-semibold text-base">Alexander McQueen</Text>
          <Text className="mt-2" numberOfLines={2}>
            Vintage Tomie Junji Ito Tее Japanese Horror Anime Mangaka Japanese Horror Anime Mangaka
          </Text>
          <Text className="mt-1 text-base font-bold" numberOfLines={2}>
            {order.Listing.price} грн
          </Text>
        </View>
      </View>
      <Separator borderColor="$gray7Light" className="mt-3" />
      <View className="mt-2">
        <Text className="text-lg">
          <Text className="text-[#737373]">Статус: </Text>
          <Text className="text-orange-600">Очікування на оплату</Text>
        </Text>
        <Text className="text-lg mt-1">
          <Text className="text-[#737373]">Номер накладної: </Text>
          <Text
            style={{ textDecorationLine: 'underline' }}
            className="font-semibold text-blue-600 ">
            {order.trackingNumber}
          </Text>
        </Text>
      </View>
      <Separator borderColor="$gray7Light" className="mt-3" />
      <View className="mt-2">
        <Text className="text-lg font-semibold">
          {orderType === 'buy' ? 'Продавець' : 'Покупець'}
        </Text>
        <Link asChild href={`/user/${order.seller.nickname}`}>
          <Pressable className="flex-row mt-4 gap-x-3">
            <Image
              className=" h-16 w-16 rounded-full object-cover"
              source={{ uri: avatarFb(order.seller.avatarUrl) }}
              alt="selleravatar"
            />
            <View className="flex-1">
              <Text className="text-lg">{order.seller.nickname}</Text>
              <Link
                href="/"
                style={{ textDecorationLine: 'underline' }}
                className="font-semibold text-[#507493] text-base mt-1.5">
                {transformPhone.output('+' + order.seller.phone)}
              </Link>
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
