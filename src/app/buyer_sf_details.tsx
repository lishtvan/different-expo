import React from 'react';
import { Text, View } from 'tamagui';

const BuyerSFDetailsScreen = () => {
  return (
    <View className="flex-1 p-3">
      <Text className="text-base">
        1. Cтворюєте замовлення, вам надходить push-сповіщення у мобільному додатку Нової Пошти.
      </Text>
      <Text className="text-base mt-4">
        2. Оплачуєте замовлення та доставку в додатку. Після цього продавець має надіслати товар
        протягом 48 годин.
      </Text>
      <View className="flex-row items-start mt-2">
        <Text className=" text-base font-medium">-</Text>
        <Text className="text-base font-medium ml-1">
          Якщо товар не буде відправлено, кошти повернуться Вам в повному обсязі.
        </Text>
      </View>
      <View className="flex-row items-start mt-1">
        <Text className=" text-base font-medium">-</Text>
        <Text className="text-base font-medium ml-1">
          Якщо Ви відмовитесь від товару у поштовому відділенні, кошти буде повернено лише за товар.
          Оплата послуг доставки не повертається.
        </Text>
      </View>
    </View>
  );
};

export default BuyerSFDetailsScreen;
