import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';

export const unstable_settings = { initialRouteName: 'index' };

export default function SellLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ headerTitle: '' }} />
      <Stack.Screen
        name="listing/[listingId]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'fullScreenModal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-base">Скасувати</Text>
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
