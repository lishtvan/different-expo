import { Link, Stack, router } from 'expo-router';
import React from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'tamagui';

import SearchInstance from '../../../../components/wrappers/SearchInstance';
import SearchSynchonization from '../../../../components/wrappers/SearchSynchonization';
import { useFilterStore } from '../../../../store/store';

const CurrentFilters = () => {
  const { items } = useRefinementList({ attribute: 'designer' });
  const { canRefine } = useClearRefinements();
  const clearAll = useFilterStore((state) => state.clearAll);
  return (
    <View>
      <Stack.Screen
        options={{
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-base">Закрити</Text>
              </TouchableOpacity>
            );
          },
          headerRight: () => (
            <TouchableOpacity className={`${canRefine ? '' : 'hidden'} `} onPress={clearAll}>
              <Text className="text-base">Видалити всe</Text>
            </TouchableOpacity>
          ),
        }}
      />
      {items
        .filter((i) => i.isRefined)
        .map((i) => (
          <Text key={i.label}>{i.label}</Text>
        ))}
      <Link href="/filters/designer_filter">filter designer</Link>
    </View>
  );
};

const CurrentFiltersScreen = () => {
  return (
    <SearchInstance>
      <SearchSynchonization>
        <CurrentFilters />
      </SearchSynchonization>
    </SearchInstance>
  );
};

export default CurrentFiltersScreen;
