import { Stack, useLocalSearchParams } from 'expo-router';
import { InstantSearch } from 'react-instantsearch-core';

import User from '../../../../components/user/User';
import { LISTINGS_COLLECTION } from '../../../../constants/listing';
import { searchClient } from '../../../../utils/searchClient';

export default function UserScreen() {
  const params = useLocalSearchParams<{ nickname: string }>();

  return (
    <InstantSearch
      future={{ preserveSharedStateOnUnmount: true }}
      indexName={LISTINGS_COLLECTION}
      searchClient={searchClient}>
      <Stack.Screen
        options={{
          headerTitle: params.nickname,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 19 },
        }}
      />
      <User />
    </InstantSearch>
  );
}
