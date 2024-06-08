import { Stack } from 'expo-router';

export { ErrorBoundary } from 'components/errors/ErrorBoundary';
export const unstable_settings = { initialRouteName: 'index' };

export default function SellLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'simple_push',
        headerTitleAlign: 'center',
        fullScreenGestureEnabled: true,
      }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Створіть нове оголошення' }} />
      <Stack.Screen
        name="designer_search"
        options={{
          headerBackTitleVisible: false,
          headerTitle: 'Оберіть дизайнера',
        }}
      />
      <Stack.Screen
        name="select_category_and_size"
        options={{
          headerBackTitleVisible: false,
          headerTitle: 'Оберіть категорію та розмір',
        }}
      />
    </Stack>
  );
}
