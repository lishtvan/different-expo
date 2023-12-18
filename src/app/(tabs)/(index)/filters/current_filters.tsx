import { Entypo } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import React from 'react';
import { useClearRefinements, useHits, useRefinementList } from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { ListItem, Separator, View } from 'tamagui';

import SearchInstance from '../../../../components/wrappers/SearchInstance';
import SearchSynchonization from '../../../../components/wrappers/SearchSynchonization';
import { useFilterStore } from '../../../../store/store';

const CurrentFilters = () => {
  const { canRefine } = useClearRefinements();
  const { results } = useHits();
  useRefinementList({ attribute: 'designer' });
  const clearAll = useFilterStore((state) => state.clearAll);
  const designers = useFilterStore((state) => state.designers);

  return (
    <View className="px-4 py-3">
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

      <Link href="/filters/designer_filter" className="mb-1">
        <View className="w-full ">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Дизайнер</ListItem.Text>
            <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle>
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>
      <Link href="/filters/designer_filter" className="mb-1">
        <View className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Категорія</ListItem.Text>
            <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle>
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>
      <Link href="/filters/designer_filter" className="mb-1">
        <View className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Розмір</ListItem.Text>
            <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle>
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>
      <Link href="/filters/designer_filter" className="mb-1">
        <View className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Стан речі</ListItem.Text>
            <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle>
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>
      <Link href="/filters/designer_filter" className="mb-1">
        <View className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Ціна</ListItem.Text>
            <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle>
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>
      <Link href="/filters/designer_filter" className="mb-1">
        <View className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Теги</ListItem.Text>
            <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle>
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>

      <View className="mt-32">
        <Text>Переглянути {results?.nbHits} оголошень</Text>
      </View>
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
