import { Stack } from 'expo-router';

import { VirtualFilter } from './filters/current_filters';
import SearchClient from '../../../components/wrappers/SearchClient';

export const unstable_settings = { initialRouteName: 'index' };

export default function IndexLayoutNav() {
  return (
    <SearchClient>
      <VirtualFilter />
      <Stack screenOptions={{ headerShadowVisible: false, fullScreenGestureEnabled: true }}>
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
          name="chat"
          options={{ headerBackTitleVisible: false, headerTitle: '', headerShadowVisible: true }}
        />
        <Stack.Screen
          name="user/[nickname]"
          options={{
            headerTitle: '',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="filters" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </SearchClient>
  );
}
