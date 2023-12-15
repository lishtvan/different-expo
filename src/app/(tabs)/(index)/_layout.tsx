import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';

export const unstable_settings = { initialRouteName: 'index' };

export default function IndexLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="listing/[listingId]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="filters"
        options={{
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-base">Закрити</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-base">Видалити всі</Text>
            </TouchableOpacity>
          ),
          headerTitle: 'Фільтри',
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
