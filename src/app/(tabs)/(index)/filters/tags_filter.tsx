import { FlashList } from '@shopify/flash-list';
import FilterItem from 'components/home/FilterItem';
import ShowListingsButton from 'components/home/ShowListingsButton';
import Delayed from 'components/wrappers/Delayed';
import { Stack } from 'expo-router';
import React from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Separator, View } from 'tamagui';

const Clear = () => {
  const { canRefine, refine: clearAllTags } = useClearRefinements({
    includedAttributes: ['tags'],
  });

  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <TouchableOpacity className={`${canRefine ? '' : 'hidden'} `} onPress={clearAllTags}>
            <Text className="text-base">Видалити всe</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

const TagsFilter = () => {
  const { items, refine, toggleShowMore, isShowingMore } = useRefinementList({
    attribute: 'tags',
    limit: 30,
    showMore: true,
    showMoreLimit: 522,
  });

  return (
    <View className="flex-1 pb-4 pt-2">
      <FlashList
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

const TagsFilterScreen = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <SafeAreaView className="flex-1">
        <View className="mb-2 flex-1 justify-between">
          <Clear />
          <TagsFilter />
          <View className="px-3">
            <ShowListingsButton />
          </View>
        </View>
      </SafeAreaView>
    </Delayed>
  );
};

export default TagsFilterScreen;
