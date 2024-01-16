import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React, { memo } from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { Separator, View } from 'tamagui';

import Delayed from '../../../../components/wrappers/Delayed';

const Clear = () => {
  const { canRefine, refine: clearAllCategories } = useClearRefinements({
    includedAttributes: ['category'],
  });

  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <TouchableOpacity
            className={`${canRefine ? '' : 'hidden'} `}
            onPress={clearAllCategories}>
            <Text className="text-base">Видалити всe</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

interface RefinementListItem {
  value: string;
  label: string;
  isRefined: boolean;
  count: number;
}

const RenderItem = ({
  item,
  refine,
}: {
  item: RefinementListItem;
  refine: (value: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        refine(item.value);
      }}
      className="flex-row justify-between px-2 py-2.5">
      <Text className={`text-base ${item.isRefined ? 'font-semibold text-main' : 'text-black'}`}>
        {item.label}
      </Text>
      <View className="flex-row gap-x-2.5">
        <View className={`rounded-full px-2 ${item.isRefined ? 'bg-main' : 'bg-[#ebebeb]'}`}>
          <Text className={`mr-0.5 text-base ${item.isRefined ? 'text-white' : 'text-black'}`}>
            {item.count}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MemoizedItem = memo(RenderItem);

const CategoryFilter = () => {
  const { items, refine, toggleShowMore, isShowingMore } = useRefinementList({
    attribute: 'category',
    limit: 30,
    showMore: true,
    showMoreLimit: 522,
  });

  return (
    <View className="h-full pb-10 pt-2">
      <FlashList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        estimatedItemSize={50}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        data={items}
        renderItem={(object) => <MemoizedItem refine={refine} item={object.item} />}
        keyExtractor={(item) => item.value}
        ItemSeparatorComponent={() => <Separator />}
        onEndReached={() => {
          if (!isShowingMore) toggleShowMore();
        }}
      />
    </View>
  );
};

const CategoryFilterScreen = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <View>
        <Clear />
        <CategoryFilter />
      </View>
    </Delayed>
  );
};

export default CategoryFilterScreen;
