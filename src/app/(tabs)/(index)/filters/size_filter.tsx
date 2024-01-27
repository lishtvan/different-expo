import { Entypo } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { FC, memo, useMemo, useState } from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { ScrollView, Separator, Square, View } from 'tamagui';

import ShowListingsButton from '../../../../components/home/ShowListingsButton';
import Delayed from '../../../../components/wrappers/Delayed';
import { EU_SIZES, SHORT_SIZES, SIZES } from '../../../../constants/listing';
import { RefinementListItem } from '../../../../types';

const Clear = () => {
  const { canRefine, refine: clearAllSizes } = useClearRefinements({
    includedAttributes: ['size'],
  });

  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <TouchableOpacity className={`${canRefine ? '' : 'hidden'} `} onPress={clearAllSizes}>
            <Text className="text-base">Видалити всe</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

interface Props {
  item: RefinementListItem;
  refine: (value: string) => void;
}

const MySizeItem: FC<Props> = ({ item, refine }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        refine(item.value);
      }}
      className={`h-16 w-16 flex-col items-center justify-center rounded-lg border-[0.4px] ${item.isRefined ? 'bg-main' : 'bg-white'}`}>
      <Text
        className={`text-base font-medium ${item.isRefined ? 'font-semibold text-white' : 'text-black'}`}>
        {SHORT_SIZES[item.label as keyof typeof SHORT_SIZES]}
      </Text>

      {EU_SIZES[item.label as keyof typeof EU_SIZES] && (
        <View className="mt-1">
          <Text className={`text-xs  ${item.isRefined ? 'text-white' : 'text-gray-600'}`}>
            {EU_SIZES[item.label as keyof typeof EU_SIZES]}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const SizeItem = memo(MySizeItem);

interface SizesFilter<T> {
  Верх: T;
  Низ: T;
  'Верхній одяг': T;
  Взуття: T;
  'Офіційний одяг': T;
  Аксесуари: T;
}

const SizeFilter = () => {
  const { items, refine } = useRefinementList({
    attribute: 'size',
    limit: 70,
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const groupedItems = useMemo(() => {
    const sizes: SizesFilter<typeof items> = {
      Верх: [],
      Низ: [],
      'Верхній одяг': [],
      Взуття: [],
      'Офіційний одяг': [],
      Аксесуари: [],
    };

    const categories = Object.keys(sizes);

    categories.forEach((category) => {
      SIZES[category as keyof typeof SIZES].forEach((size) => {
        const filterItem = items.find((i) => i.label === size);
        if (filterItem) sizes[category as keyof typeof SIZES].push(filterItem);
      });
    });

    return sizes;
  }, [items]);

  const selectCategory = (section: string) => {
    if (selectedCategories.includes(section)) {
      const categories = selectedCategories.filter((c) => c !== section);
      setSelectedCategories(categories);
      return;
    }
    setSelectedCategories([...selectedCategories, section]);
  };

  return (
    <View className="flex-1 pt-2">
      {Object.keys(groupedItems).map(
        (section) =>
          groupedItems[section as keyof typeof groupedItems].length > 0 && (
            <View key={section}>
              <TouchableOpacity className="px-2 mr-2 py-2" onPress={() => selectCategory(section)}>
                <View className="px-1 pb-2 flex-row justify-between items-center">
                  <Text className="text-lg">{section}</Text>
                  <Square
                    animation="quick"
                    rotate={selectedCategories.includes(section) ? '180deg' : '0deg'}>
                    <Entypo name="chevron-thin-down" size={15} />
                  </Square>
                </View>
                <Separator borderColor="$gray7Light" />
              </TouchableOpacity>

              {selectedCategories.includes(section) && (
                <View className="flex-row flex-wrap gap-2 w-full mx-auto p-1">
                  {groupedItems[section as keyof typeof groupedItems].map((i) => (
                    <View key={i.value}>
                      <SizeItem item={i} refine={refine} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )
      )}
    </View>
  );
};

const SizeFilterScreen = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <SafeAreaView className="flex-1">
        <View className="mb-2 flex-1 gap-y-4">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ justifyContent: 'space-between' }}>
            <Clear />
            <SizeFilter />
          </ScrollView>
          <View className="px-3">
            <ShowListingsButton />
          </View>
        </View>
      </SafeAreaView>
    </Delayed>
  );
};

export default SizeFilterScreen;
