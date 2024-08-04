import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ORDER_DETAILS_MAPPER, STATUS_MAPPER } from 'constants/order';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { View, Text, Separator } from 'tamagui';
import { avatarFb } from 'utils/avatarUrlFallback';
import { copyText } from 'utils/clipboard';
import { transformPhone } from 'utils/common';
import { formatDateToUkrainian } from 'utils/date';
import { fetcher } from 'utils/fetcher';

const formatTrackingNumber = (trackingNumber: string) => {
  return trackingNumber.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

const getOrderDate = (createdAt: string) => {
  const orderCreatedAtToDate = new Date(createdAt);

  const dateInMinutes = orderCreatedAtToDate.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${formatDateToUkrainian(orderCreatedAtToDate)} ${dateInMinutes}`;
};

export default function OrderScreen() {
  const queryClient = useQueryClient();
  const { orderId } = useLocalSearchParams();
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetcher({ body: { orderId }, route: '/order/get' }),
  });

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isSuccess) queryClient.invalidateQueries({ queryKey: ['auth_me'] });
  }, [isSuccess, queryClient]);

  const copyTrackingNumber = async (text: string) => {
    await copyText(text);
    setModalVisible(false);
  };

  const openTrackingPage = async () => {
    await WebBrowser.openBrowserAsync(
      `https://novaposhta.ua/tracking/?cargo_number=${order.trackingNumber}`
    );
    setModalVisible(false);
  };

  if (error) throw error;
  if (isLoading) return null;
  const { order, orderType } = data;

  const dealPerson = orderType === 'buy' ? order.seller : order.buyer;
  const { statusColor, statusText } = STATUS_MAPPER[order.status];

  return (
    <ScrollView className="flex-1 px-3 py-2">
      <Stack.Screen
        options={{
          headerRight: () => <Text>{getOrderDate(order.createdAt)}</Text>,
        }}
      />
      <ReactNativeModal
        style={{ justifyContent: 'flex-end', margin: 0 }}
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        backdropOpacity={0.2}
        swipeDirection={['down']}>
        <View className="mx-4 mb-16 rounded-2xl bg-white">
          <TouchableOpacity
            onPress={() => copyTrackingNumber(order.trackingNumber)}
            className="flex-row justify-center gap-x-2 border-b-2 border-b-[#eeeeee] p-3.5">
            <Ionicons name="copy-outline" size={25} />
            <Text className="mr-8 text-xl">Скопіювати</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openTrackingPage}
            className="flex-row items-center justify-center gap-x-1.5 p-2">
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../../../../assets/images/novaposhta.png')}
            />
            <Text className="mr-10 text-xl">Відстежити</Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
      <Link
        asChild
        href={{
          pathname: '/listingr',
          params: { listingId: order.Listing.id },
        }}>
        <View className="flex-row gap-x-3">
          <Image
            className="aspect-[0.83] w-20 rounded-lg"
            source={order.Listing.imageUrls[0]}
            alt="item"
            contentFit="cover"
            transition={200}
          />
          <View className="w-full flex-1">
            <Text className="text-base font-semibold">{order.Listing.designer}</Text>
            <Text className="mt-2" numberOfLines={2}>
              {order.Listing.title}
            </Text>
            <Text className="mt-auto text-base font-bold">{order.Listing.price} грн</Text>
          </View>
        </View>
      </Link>
      <Separator borderColor="$gray7Light" className="mt-3" />
      <View className="mt-2">
        <Text className="text-lg">
          <Text className="text-[#737373]">Статус: </Text>
          <Text className={statusColor}>{statusText}</Text>
        </Text>
        <Text className="mt-1 text-lg">
          <Text className="text-[#737373]">Номер накладної: </Text>
          <Text
            pressStyle={{ opacity: 0.7 }}
            onPress={() => setModalVisible(true)}
            style={{ textDecorationLine: 'underline' }}
            className="font-semibold text-blue-600">
            {formatTrackingNumber(order.trackingNumber)}
          </Text>
        </Text>
      </View>
      <Separator borderColor="$gray7Light" className="mt-3" />
      <View className="mt-2">
        <Text className="text-lg font-semibold">
          {orderType === 'buy' ? 'Продавець' : 'Покупець'}
        </Text>
        <Link asChild href={{ pathname: '/userg', params: { nickname: dealPerson.nickname } }}>
          <Pressable className="mt-4 flex-row gap-x-3">
            <Image
              className="h-16 w-16 rounded-full object-cover"
              source={{ uri: avatarFb(dealPerson.avatarUrl) }}
              alt="dealperson"
            />
            <View className="flex-1">
              <Text className="text-lg">{dealPerson.nickname}</Text>
              <Text
                onLongPress={() => copyText(dealPerson.phone)}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => Linking.openURL(`tel:+${dealPerson.phone}`)}
                style={{ textDecorationLine: 'underline' }}
                className="mt-1.5 text-base font-semibold text-[#507493]">
                {transformPhone.output('+' + dealPerson.phone)}
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>
      {ORDER_DETAILS_MAPPER[order.status] && ORDER_DETAILS_MAPPER[order.status][orderType] && (
        <>
          <Separator borderColor="$gray7Light" className="mt-3" />
          <View className="mb-10 mt-2">
            <Text className="text-lg font-semibold">Деталі</Text>
            <Text className="text-base">{ORDER_DETAILS_MAPPER[order.status][orderType]}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}
