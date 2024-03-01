import { Stack } from 'expo-router';

export const unstable_settings = { initialRouteName: 'index' };

export default function SellLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        fullScreenGestureEnabled: true,
      }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Повідомлення' }} />
      <Stack.Screen
        name="chat"
        options={{ headerBackTitleVisible: false, headerTitle: '', headerShadowVisible: true }}
      />
      <Stack.Screen
        name="listing/[listingId]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="user/[nickname]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
