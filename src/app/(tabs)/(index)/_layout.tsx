import { Stack } from 'expo-router';

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
      <Stack.Screen name="filters" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}
