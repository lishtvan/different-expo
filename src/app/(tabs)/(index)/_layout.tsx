import { Stack } from 'expo-router';
import { InstantSearch } from 'react-instantsearch-core';

import { VirtualFilter } from './filters/current_filters';
import { LISTINGS_COLLECTION } from '../../../constants/listing';
import { searchClient } from '../../../utils/searchClient';

export const unstable_settings = { initialRouteName: 'index' };

export default function IndexLayoutNav() {
  return (
    <InstantSearch
      future={{ preserveSharedStateOnUnmount: true }}
      indexName={LISTINGS_COLLECTION}
      searchClient={searchClient}>
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
          name="create_order"
          options={{
            headerBackTitleVisible: false,
            headerTitle: 'Створіть замовлення',
          }}
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
    </InstantSearch>
  );
}
