import React from 'react';
import { Text, View } from 'tamagui';

const BuyerSFDetailsScreen = () => {
  return (
    <View className="flex-1 p-3">
      <Text className="text-base">
        1. Після того, як покупець оплатить замовлення та доставку, Ви отримаєте push-сповіщення з
        номером накладної Нової Пошти.
      </Text>
      <Text className="mt-4 text-base">2. Товар потрібно відправити протягом 48 годин.</Text>
      <Text className="mt-4 text-base">
        3. Ви отримаєте кошти після того як покупець забере товар у відділенні.
      </Text>
      <View className="mt-2 flex-row items-start">
        <Text className=" text-base font-medium">-</Text>
        <Text className="ml-1 text-base font-medium">
          Якщо покупець відмовився від товару або не прийшов у відділення - відправлення повернеться
          автоматично і безкоштовно.
        </Text>
      </View>
    </View>
  );
};

export default BuyerSFDetailsScreen;
