import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { View, Text, Separator } from 'tamagui';
import { avatarFb } from 'utils/avatarUrlFallback';
import { copyText } from 'utils/clipboard';
import { transformPhone } from 'utils/common';
import { formatDateToUkrainian } from 'utils/date';
import { fetcher } from 'utils/fetcher';

// LOW_PRIO: add types
const STATUS_MAPPER: any = {
  PAYMENT: {
    statusColor: 'text-orange-600',
    statusText: 'Очікування на оплату',
  },
  HANDLING: {
    statusColor: 'text-amber-500',
    statusText: 'Очікування на відправку',
  },
  SHIPPING: {
    statusColor: 'text-cyan-600',
    statusText: 'Товар в дорозі',
  },
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
  const { orderId } = useLocalSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetcher({ body: { orderId }, route: '/order/get' }),
  });

  const [isModalVisible, setModalVisible] = useState(false);

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

  if (isLoading) return null;
  const { order, orderType } = data;

  const dealPerson = orderType === 'buy' ? order.seller : order.buyer;
  const { statusColor, statusText } = STATUS_MAPPER[order.status];

  return (
    <View className="flex-1 px-3 py-2">
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
            className="flex-row justify-center border-b-2 border-b-[#eeeeee] p-3.5 gap-x-2">
            <Ionicons name="copy-outline" size={25} />
            <Text className="text-xl mr-8">Скопіювати</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openTrackingPage}
            className="flex-row justify-center items-center p-2 gap-x-1.5">
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../../../../assets/images/novaposhta.png')}
            />
            <Text className="text-xl mr-10">Відстежити</Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
      <View className="flex-row gap-x-3">
        <Image
          className="aspect-[0.83] w-20 rounded-lg"
          source={order.Listing.imageUrls[0]}
          alt="item"
          contentFit="cover"
          transition={200}
        />
        <View className="w-full flex-1">
          <Text className="font-semibold text-base">{order.Listing.designer}</Text>
          <Text className="mt-2" numberOfLines={2}>
            {order.Listing.title}
          </Text>
          <Text className="mt-auto text-base font-bold" numberOfLines={2}>
            {order.Listing.price} грн
          </Text>
        </View>
      </View>
      <Separator borderColor="$gray7Light" className="mt-3" />
      <View className="mt-2">
        <Text className="text-lg">
          <Text className="text-[#737373]">Статус: </Text>
          <Text className={statusColor}>{statusText}</Text>
        </Text>
        <Text className="text-lg mt-1">
          <Text className="text-[#737373]">Номер накладної: </Text>
          <Text
            pressStyle={{ opacity: 0.7 }}
            onPress={() => setModalVisible(true)}
            style={{ textDecorationLine: 'underline' }}
            className="font-semibold text-blue-600">
            {order.trackingNumber}
          </Text>
        </Text>
      </View>
      <Separator borderColor="$gray7Light" className="mt-3" />
      <View className="mt-2">
        <Text className="text-lg font-semibold">
          {orderType === 'buy' ? 'Продавець' : 'Покупець'}
        </Text>
        <Link asChild href={`/user/${dealPerson.nickname}`}>
          <Pressable className="flex-row mt-4 gap-x-3">
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
                className="font-semibold text-[#507493] text-base mt-1.5">
                {transformPhone.output('+' + dealPerson.phone)}
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
