import { Stack } from 'expo-router';

export { ErrorBoundary } from 'components/errors/ErrorBoundary';
export const unstable_settings = { initialRouteName: 'index' };

export default function MessagesLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        fullScreenGestureEnabled: true,
      }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Повідомлення' }} />
    </Stack>
  );
}
