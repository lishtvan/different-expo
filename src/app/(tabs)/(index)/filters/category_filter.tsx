import { Entypo } from '@expo/vector-icons';
import FilterItem from 'components/home/FilterItem';
import ShowListingsButton from 'components/home/ShowListingsButton';
import Delayed from 'components/wrappers/Delayed';
import { CATEGORIES } from 'constants/listing';
import { Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { ScrollView, Separator, Square, Text, View } from 'tamagui';

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

interface CategoriesFilter<T> {
  Верх: T;
  Низ: T;
  'Верхній одяг': T;
  Взуття: T;
  'Офіційний одяг': T;
  Аксесуари: T;
}

const CategoryFilter = () => {
  const { items, refine } = useRefinementList({
    attribute: 'category',
    limit: 60,
  });

  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  const groupedItems = useMemo(() => {
    const categories: CategoriesFilter<typeof items> = {
      Верх: [],
      Низ: [],
      'Верхній одяг': [],
      Взуття: [],
      'Офіційний одяг': [],
      Аксесуари: [],
    };

    const sections = Object.keys(categories);

    items.forEach((item) => {
      sections.some((s) => {
        if (CATEGORIES[s as keyof typeof CATEGORIES].includes(item.label)) {
          categories[s as keyof typeof categories].push(item);
          return true;
        }
      });
    });
    return categories;
  }, [items]);

  const selectSection = (section: string) => {
    if (selectedSections.includes(section)) {
      const categories = selectedSections.filter((c) => c !== section);
      setSelectedSections(categories);
      return;
    }
    setSelectedSections([...selectedSections, section]);
  };

  return (
    <View className="flex-1 pt-2">
      {Object.keys(groupedItems).map(
        (section) =>
          groupedItems[section as keyof typeof groupedItems].length > 0 && (
            <View key={section}>
              <TouchableOpacity className="px-2 mr-2 py-2" onPress={() => selectSection(section)}>
                <View className="px-1 pb-2 flex-row justify-between items-center">
                  <Text className="text-lg">{section}</Text>
                  <Square
                    animation="quick"
                    rotate={selectedSections.includes(section) ? '180deg' : '0deg'}>
                    <Entypo name="chevron-thin-down" size={15} />
                  </Square>
                </View>
                <Separator borderColor="$gray7Light" />
              </TouchableOpacity>

              {selectedSections.includes(section) && (
                <View className=" pr-2 pl-3.5">
                  {groupedItems[section as keyof typeof groupedItems].map((i) => (
                    <View key={i.value}>
                      <FilterItem item={i} refine={refine} />
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

const CategoryFilterScreen = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <SafeAreaView className="flex-1">
        <View className="mb-2 flex-1 gap-y-4">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ justifyContent: 'space-between' }}>
            <Clear />
            <CategoryFilter />
          </ScrollView>
          <View className="px-3">
            <ShowListingsButton />
          </View>
        </View>
      </SafeAreaView>
    </Delayed>
  );
};

export default CategoryFilterScreen;
