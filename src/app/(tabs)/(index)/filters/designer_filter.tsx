import { EvilIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import React, { memo } from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { Button, Input, Separator, View, XStack } from 'tamagui';

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

const DesignerFilter = () => {
  const { items, refine, searchForItems, toggleShowMore, isShowingMore } = useRefinementList({
    attribute: 'designer',
    limit: 30,
    showMore: true,
    showMoreLimit: 522,
  });
  const iconClassname = isAndroid ? 'p-0 pl-2 pb-1 bg-[#f8f8f8]' : 'p-0 pl-2  bg-[#f8f8f8]';

  return (
    <View className="h-full pb-10 pt-2">
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

const DesignerFilterScreen = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <View>
        <Clear />
        <DesignerFilter />
      </View>
    </Delayed>
  );
};

export default DesignerFilterScreen;
