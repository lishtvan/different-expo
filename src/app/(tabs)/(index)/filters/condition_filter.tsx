import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { TouchableOpacity } from 'react-native';
import { Separator, Text, View } from 'tamagui';

import FilterItem from '../../../../components/home/FilterItem';
import ShowListingsButton from '../../../../components/home/ShowListingsButton';
import Delayed from '../../../../components/wrappers/Delayed';
import { CONDITIONS } from '../../../../constants/listing';
import { RefinementListItem } from '../../../../types';

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
  const { items, refine } = useRefinementList({ attribute: 'condition' });

  const sortedItems = useMemo(() => {
    const filterItems: RefinementListItem[] = [];
    CONDITIONS.forEach((c) => {
      const filterItem = items.find((i) => i.label === c);
      if (filterItem) filterItems.push(filterItem);
    });
    return filterItems;
  }, [items]);

  return (
    <View className="flex-1 pb-4 pt-2">
      <FlashList
        estimatedItemSize={50}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        data={sortedItems}
        renderItem={(object) => <FilterItem refine={refine} item={object.item} />}
        keyExtractor={(item) => item.value}
        ItemSeparatorComponent={() => <Separator />}
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
