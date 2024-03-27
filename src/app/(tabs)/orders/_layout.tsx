import { Stack } from 'expo-router';

export const unstable_settings = { initialRouteName: 'index' };

export default function OrdersLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        animation: 'simple_push',
        fullScreenGestureEnabled: true,
      }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Замовлення' }} />
      <Stack.Screen name="order" options={{ headerBackTitleVisible: false, headerTitle: '' }} />
    </Stack>
  );
}
