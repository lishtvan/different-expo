import { Entypo } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import React, { FC, useRef } from 'react';
import {
  useClearRefinements,
  useCurrentRefinements,
  useHits,
  useRefinementList,
} from 'react-instantsearch-core';
import { TouchableOpacity } from 'react-native';
import { Button, ListItem, Separator, Text, View } from 'tamagui';

interface FilterListItemProps {
  attribute: string;
  routeName: string;
  title: string;
}

const FilterListItem: FC<FilterListItemProps> = ({ attribute, routeName, title }) => {
  const categories = useCurrentRefinements({ includedAttributes: [attribute] });

  return (
    <Link href={`/filters/${routeName}`} asChild className="mb-1">
      <TouchableOpacity activeOpacity={0.5} className="w-full">
        <ListItem className="px-0.5 py-3">
          <ListItem.Text className="text-base w-[35%]">{title}</ListItem.Text>
          <ListItem.Subtitle
            textAlign="right"
            className="mr-2 text-main text-base font-medium"
            opacity={1}>
            {categories.items.length > 0 &&
              categories.items[0].refinements.map((r) => r.label).join(', ')}
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
    <Button
      theme="active"
      fontSize="$5"
      borderRadius="$main"
      onPress={() => router.push({ pathname: '/' })}>
      {`Переглянути ${results?.nbHits} оголошень`}
    </Button>
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
    <View className="px-4 pt-3 mb-16 flex flex-col justify-between  flex-1">
      <Clear />
      <View>
        <FilterListItem attribute="designer" title="Дизайнер" routeName="designer_filter" />
        <FilterListItem attribute="category" title="Категорія" routeName="category_filter" />
        <FilterListItem attribute="designer" title="Розмір" routeName="designer_filter" />
        <FilterListItem attribute="designer" title="Стан речі" routeName="designer_filter" />
        <FilterListItem attribute="designer" title="Ціна" routeName="designer_filter" />
        <FilterListItem attribute="designer" title="Теги" routeName="designer_filter" />
      </View>
      <View className="mb-30">
        <View>
          <Text className="text-lg"> renders count: {renderCounter.current}</Text>
        </View>
        <ShowListingsButton />
      </View>
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

// const focused = useIsFocused();
//   useEffect(() => {
//     console.log('use effect', focused);
//   }, [results?.nbHits]);
