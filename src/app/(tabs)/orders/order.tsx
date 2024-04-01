import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Toast from 'react-native-toast-message';
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

  const [isOpen, setIsOpen] = useState(false);

  const copyTrackingNumber = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({
      visibilityTime: 1500,
      type: 'success',
      text1: 'Текст скопійовано',
    });
    setIsOpen(false);
  };

  const openTrackingPage = async () => {
    await WebBrowser.openBrowserAsync(
      `https://novaposhta.ua/tracking/?cargo_number=${order.trackingNumber}`
    );
    setIsOpen(false);
  };

  if (isLoading) return null;
  const { order, orderType } = data;

  return (
    <View className="flex-1 px-3 py-2">
      <Stack.Screen
        options={{
          headerRight: () => <Text>30 березня 16:45</Text>,
        }}
      />
      <ReactNativeModal
        style={{ justifyContent: 'flex-end', margin: 0 }}
        onBackdropPress={() => setIsOpen(false)}
        isVisible={isOpen}
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
            pressStyle={{ opacity: 0.7 }}
            onPress={() => setIsOpen(true)}
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
        <Link asChild href={`/user/${order.seller.nickname}`}>
          <Pressable className="flex-row mt-4 gap-x-3">
            <Image
              className="h-16 w-16 rounded-full object-cover"
              source={{ uri: avatarFb(order.seller.avatarUrl) }}
              alt="selleravatar"
            />
            <View className="flex-1">
              <Text className="text-lg">{order.seller.nickname}</Text>
              <Text
                onLongPress={async () => {
                  await Clipboard.setStringAsync(order.seller.phone);
                  Toast.show({
                    visibilityTime: 1500,
                    type: 'success',
                    text1: 'Текст скопійовано',
                  });
                }}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => Linking.openURL(`tel:+${order.seller.phone}`)}
                style={{ textDecorationLine: 'underline' }}
                className="font-semibold text-[#507493] text-base mt-1.5">
                {transformPhone.output('+' + order.seller.phone)}
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
