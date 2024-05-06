import React from 'react';
import { Text, View } from 'tamagui';

const BuyerSFDetailsScreen = () => {
  return (
    <View className="flex-1 p-3">
      <Text className="text-base">
        1. Cтворюєте замовлення, вам надходить push-сповіщення у мобільному додатку Нової Пошти.
      </Text>
      <Text className="mt-4 text-base">
        2. Оплачуєте замовлення та доставку в додатку. Після цього продавець має надіслати товар
        протягом 48 годин.
      </Text>
      <View className="mt-2 flex-row items-start">
        <Text className=" text-base font-medium">-</Text>
        <Text className="ml-1 text-base font-medium">
          Якщо товар не буде відправлено, кошти повернуться Вам в повному обсязі.
        </Text>
      </View>
      <View className="mt-1 flex-row items-start">
        <Text className=" text-base font-medium">-</Text>
        <Text className="ml-1 text-base font-medium">
          Якщо Ви відмовитесь від товару у поштовому відділенні, кошти буде повернено лише за товар.
          Оплата послуг доставки не повертається.
        </Text>
      </View>
    </View>
  );
};

export default BuyerSFDetailsScreen;
