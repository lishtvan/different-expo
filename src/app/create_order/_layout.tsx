import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { mainColor } from '../../../tamagui.config';

export const unstable_settings = { initialRouteName: 'index' };

export default function CreateOrderLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'simple_push',
        headerTitleAlign: 'center',
        fullScreenGestureEnabled: true,
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Feather size={30} color={mainColor} name="chevron-left" />
            </TouchableOpacity>
          ),
          headerTitle: 'Створіть замовлення',
        }}
      />
      <Stack.Screen
        name="select_city"
        options={{
          headerBackTitleVisible: false,
          headerTitle: 'Оберіть населений пункт',
        }}
      />
      <Stack.Screen
        name="select_department"
        options={{
          headerBackTitleVisible: false,
          headerTitle: 'Оберіть відділення Нової Пошти',
        }}
      />
    </Stack>
  );
}
