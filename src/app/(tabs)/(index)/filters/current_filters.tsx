import { Entypo } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import React, { useRef } from 'react';
import {
  useClearRefinements,
  useCurrentRefinements,
  useHits,
  useRefinementList,
} from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { ListItem, Separator, View } from 'tamagui';

const CurrentDesignerFilter = () => {
  const designers = useCurrentRefinements({ includedAttributes: ['designer'] });

  return (
    <Link href="/filters/designer_filter" asChild className="mb-1">
      <TouchableOpacity activeOpacity={0.5} className="w-full">
        <ListItem className="px-0.5 py-3">
          <ListItem.Text className="text-base w-[35%]">Дизайнер</ListItem.Text>
          <ListItem.Subtitle
            textAlign="right"
            className="mr-2 text-main text-base font-medium"
            opacity={1}>
            {designers.items.length > 0 &&
              designers.items[0].refinements.map((r) => r.label).join(', ')}
          </ListItem.Subtitle>
          <Entypo name="chevron-thin-right" size={15} />
        </ListItem>
        <Separator borderColor="$gray7Light" />
      </TouchableOpacity>
    </Link>
  );
};

const ShowListingsButton = () => {
  const { results } = useHits();

  return (
    <View>
      <Text>Переглянути {results?.nbHits} оголошень</Text>
    </View>
  );
};

const Clear = () => {
  const { canRefine, refine: clearAllFilters } = useClearRefinements();

  return (
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
          <TouchableOpacity className={`${canRefine ? '' : 'hidden'} `} onPress={clearAllFilters}>
            <Text className="text-base">Видалити всe</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

const CurrentFilters = () => {
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;

  return (
    <View className="px-4 py-3">
      <Clear />
      <CurrentDesignerFilter />
      <Link href="/filters/category_filter" className="mb-1">
        <View className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Категорія</ListItem.Text>
            <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {/* {categories.items.length > 0 &&
                categories.items[0].refinements.map((r) => r.label).join(', ')} */}
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
            {/* <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle> */}
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>
      <Link href="/filters/designer_filter" className="mb-1">
        <View className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Стан речі</ListItem.Text>
            {/* <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle> */}
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>
      <Link href="/filters/designer_filter" className="mb-1">
        <View className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Ціна</ListItem.Text>
            {/* <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle> */}
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </View>
      </Link>
      <Link href="/filters/designer_filter" className="mb-1">
        <TouchableOpacity className="w-full">
          <ListItem className="px-0.5 py-3">
            <ListItem.Text className="text-base w-[35%]">Теги</ListItem.Text>
            {/* <ListItem.Subtitle
              textAlign="right"
              className="mr-2 text-main text-base font-medium"
              opacity={1}>
              {designers.length > 0 && designers.join(', ')}
            </ListItem.Subtitle> */}
            <Entypo name="chevron-thin-right" size={15} />
          </ListItem>
          <Separator borderColor="$gray7Light" />
        </TouchableOpacity>
      </Link>
      <View className="mt-32">
        <Text className="text-lg"> renders count: {renderCounter.current}</Text>
      </View>
      <ShowListingsButton />
    </View>
  );
};

export const VirtualFilter = () => {
  useRefinementList({ attribute: 'category' });
  useRefinementList({ attribute: 'designer' });
  return null;
};

const CurrentFiltersScreen = () => {
  return <CurrentFilters />;
};

export default CurrentFiltersScreen;
