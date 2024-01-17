import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { Separator, View } from 'tamagui';

import FilterItem from '../../../../components/home/FilterItem';
import ShowListingsButton from '../../../../components/home/ShowListingsButton';
import Delayed from '../../../../components/wrappers/Delayed';

const Clear = () => {
  const { canRefine, refine: clearAllConditions } = useClearRefinements({
    includedAttributes: ['condition'],
  });

  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <TouchableOpacity
            className={`${canRefine ? '' : 'hidden'} `}
            onPress={clearAllConditions}>
            <Text className="text-base">Видалити всe</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

const ConditionFilter = () => {
  const { items, refine, toggleShowMore, isShowingMore } = useRefinementList({
    attribute: 'condition',
    limit: 30,
    showMore: true,
    showMoreLimit: 522,
  });

  return (
    <View className="flex-1 pb-4 pt-2">
      <FlashList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        estimatedItemSize={50}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        data={items}
        renderItem={(object) => <FilterItem refine={refine} item={object.item} />}
        keyExtractor={(item) => item.value}
        ItemSeparatorComponent={() => <Separator />}
        onEndReached={() => {
          if (!isShowingMore) toggleShowMore();
        }}
      />
    </View>
  );
};

const ConditionFilterScreen = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <View className="mb-8 flex-1 justify-between">
        <Clear />
        <ConditionFilter />
        <View className="px-3">
          <ShowListingsButton />
        </View>
      </View>
    </Delayed>
  );
};

export default ConditionFilterScreen;
