import { Stack } from 'expo-router';

export const unstable_settings = { initialRouteName: 'index' };

export default function SellLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'simple_push',
      }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Створіть нове оголошення' }} />
      <Stack.Screen
        name="designer_search"
        options={{
          headerBackTitleVisible: false,
          headerTitle: 'Оберіть дизайнера',
        }}
      />
    </Stack>
  );
}
