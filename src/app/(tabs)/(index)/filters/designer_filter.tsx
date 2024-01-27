import { EvilIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { TouchableOpacity } from 'react-native';
import { Button, Input, Separator, Text, View, XStack } from 'tamagui';

import FilterItem from '../../../../components/home/FilterItem';
import ShowListingsButton from '../../../../components/home/ShowListingsButton';
import Delayed from '../../../../components/wrappers/Delayed';
import { isAndroid } from '../../../../utils/platform';

const Clear = () => {
  const { canRefine, refine: clearAllDesigners } = useClearRefinements({
    includedAttributes: ['designer'],
  });
  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <TouchableOpacity className={`${canRefine ? '' : 'hidden'} `} onPress={clearAllDesigners}>
            <Text className="text-base">Видалити всe</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

const DesignerFilter = () => {
  const { items, refine, searchForItems, toggleShowMore, isShowingMore } = useRefinementList({
    attribute: 'designer',
    limit: 30,
    showMore: true,
    showMoreLimit: 522,
  });
  const iconClassname = isAndroid ? 'p-0 pl-2 pb-1 bg-[#f8f8f8]' : 'p-0 pl-2  bg-[#f8f8f8]';

  return (
    <View className="flex-1 pb-4 pt-2">
      <XStack alignItems="center" className="mb-2 px-3">
        <Button
          size="$4"
          icon={<EvilIcons name="search" size={30} />}
          className={iconClassname}
          borderTopLeftRadius="$main"
          borderBottomLeftRadius="$main"
          borderTopRightRadius="$0"
          borderBottomRightRadius="$0"
          borderWidth="$0"
          borderRightWidth="$0"
        />
        <Input
          autoCorrect={false}
          placeholder="Введіть назву дизайнера"
          flex={1}
          paddingLeft={6}
          borderWidth="$0"
          onChangeText={(newText) => searchForItems(newText)}
          borderRadius="$0"
          borderTopRightRadius="$main"
          borderBottomRightRadius="$main"
        />
      </XStack>
      <FlashList
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

const DesignerFilterScreen = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <View className="mb-8 flex-1 justify-between">
        <Clear />
        <DesignerFilter />
        <View className="px-3">
          <ShowListingsButton />
        </View>
      </View>
    </Delayed>
  );
};

export default DesignerFilterScreen;
