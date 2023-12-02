import { Stack } from 'expo-router';

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
    </Stack>
  );
}
