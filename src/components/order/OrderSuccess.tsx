import { Ionicons } from '@expo/vector-icons';
import { mainColor } from 'constants/colors';
import { Link, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Button } from 'tamagui';

const OrderSuccess = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="ml-5 flex-row items-center">
          <Text className="text-lg font-semibold">Замовлення створено</Text>
          <View className="ml-2">
            <Ionicons name="checkmark-circle-sharp" size={25} color={mainColor} />
          </View>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-3">
        <Text className="text-base">
          <Text className=" font-medium">
            Зараз Ви отримаєте сповіщення у мобільному додатку Нової Пошти.{'\n'}Будь ласка,
            оплатіть замовлення та доставку. Після цього продавець має надіслати товар протягом 48
            годин.{'\n'}
          </Text>
          {'\n'}
          Якщо товар не буде відправлено, кошти повернуться в повному обсязі.{'\n'}
          {'\n'}
          Якщо Ви відмовитесь від товару у поштовому відділенні, кошти буде повернено лише за товар.
          Оплата послуг доставки не повертається.{'\n'}
          {'\n'}
        </Text>
      </View>
      <View className="mb-3 gap-y-3 px-3">
        <Link href="/" asChild>
          <Button size="$4" fontSize="$6" borderRadius="$main">
            На головну
          </Button>
        </Link>
        <Link href="/orders/" asChild>
          <Button size="$4" theme="active" fontSize="$6" borderRadius="$main">
            Перейти до замовлень
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccess;
