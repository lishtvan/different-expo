import { AntDesign, Entypo } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import {
  useClearRefinements,
  useCurrentRefinements,
  useRefinementList,
  useSortBy,
  useToggleRefinement,
} from 'react-instantsearch-core';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ListItem, Separator, Switch, Text, View } from 'tamagui';

import { mainColor } from '../../../../../tamagui.config';
import ShowListingsButton from '../../../../components/home/ShowListingsButton';
import Delayed from '../../../../components/wrappers/Delayed';

interface FilterListItemProps {
  attribute: string;
  routeName: string;
  title: string;
}

const FilterListItem: FC<FilterListItemProps> = ({ attribute, routeName, title }) => {
  const currentFilter = useCurrentRefinements({ includedAttributes: [attribute] });

  return (
    <Link href={`/filters/${routeName}`} asChild className="mb-1">
      <TouchableOpacity activeOpacity={0.5} className="w-full">
        <ListItem className="px-0.5 py-3">
          <ListItem.Text className="w-[35%] text-base">{title}</ListItem.Text>
          <ListItem.Subtitle
            textAlign="right"
            className="mr-2 text-base font-medium text-main"
            opacity={1}>
            {currentFilter.items.length > 0 &&
              currentFilter.items[0].refinements.map((r) => r.label).join(', ')}
          </ListItem.Subtitle>
          <Entypo name="chevron-thin-right" size={15} />
        </ListItem>
        <Separator borderColor="$gray7Light" />
      </TouchableOpacity>
    </Link>
  );
};

const Clear = () => {
  const { canRefine, refine: clearAllFilters } = useClearRefinements();
  const sort = useSortBy({ items: sortItems });

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
          <TouchableOpacity
            className={`${sort.currentRefinement !== 'listings' || canRefine ? '' : 'hidden'} `}
            onPress={() => {
              clearAllFilters();
              sort.refine('listings');
            }}>
            <Text className="text-base">Видалити всe</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

const sortItems = [
  { label: 'Спочатку нові', value: 'listings' },
  { label: 'Спочатку дешеві', value: 'listings/sort/price:asc' },
  { label: 'Спочатку дорогі', value: 'listings/sort/price:desc' },
];

const SortBy = () => {
  const sort = useSortBy({ items: sortItems });
  const [selectedSort, setSelectedSort] = useState('');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedSort(sort.currentRefinement);
  }, [sort.currentRefinement]);

  return (
    <View className="mt-32 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Text className="text-lg">Сортування</Text>
        {sort.currentRefinement !== 'listings' && (
          <View className="ml-2 mt-0.5 h-2.5 w-2.5 rounded-full bg-main" />
        )}
      </View>
      <View className="w-3/5">
        <DropDownPicker
          open={open}
          dropDownDirection="TOP"
          showBadgeDot={false}
          arrowIconStyle={{ marginRight: 6 }}
          dropDownContainerStyle={{ borderColor: '#ebebeb', borderRadius: 16, width: '100%' }}
          style={{
            width: '100%',
            backgroundColor: '#f8f8f8',
            borderRadius: 16,
            borderColor: '#ebebeb',
          }}
          textStyle={{ fontSize: 16 }}
          listItemLabelStyle={{ fontSize: 18 }}
          listItemContainerStyle={{ marginVertical: 5 }}
          containerStyle={{ borderRadius: 16, backgroundColor: 'white' }}
          TickIconComponent={() => <AntDesign color={mainColor} name="check" size={23} />}
          value={selectedSort || sort.currentRefinement}
          items={sortItems}
          props={{ activeOpacity: 0.5 }}
          setOpen={setOpen}
          setValue={setSelectedSort}
          onChangeValue={(value) => sort.refine(value!)}
          setItems={() => {}}
          listMode="SCROLLVIEW"
        />
      </View>
    </View>
  );
};

const StatusFilter = () => {
  const { refine, value } = useToggleRefinement({
    attribute: 'status',
    on: 'SOLD',
    off: 'AVAILABLE',
  });

  return (
    <View className="mt-4 flex-row items-center justify-between">
      <Text className="text-lg">Показати продані</Text>
      <Switch
        size="$3.5"
        checked={value.isRefined}
        backgroundColor={value.isRefined ? mainColor : '$gray7'}
        onCheckedChange={() => refine({ isRefined: value.isRefined })}>
        <Switch.Thumb backgroundColor="white" animation="bouncy" />
      </Switch>
    </View>
  );
};

const CurrentFilters = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <View className="mb-16 flex flex-1 flex-col justify-between px-4 pt-3">
        <Clear />
        <View>
          <FilterListItem attribute="designer" title="Дизайнер" routeName="designer_filter" />
          <FilterListItem attribute="category" title="Категорія" routeName="category_filter" />
          <FilterListItem attribute="size" title="Розмір" routeName="size_filter" />
          <FilterListItem attribute="condition" title="Стан речі" routeName="condition_filter" />
          <FilterListItem attribute="designer" title="Ціна" routeName="designer_filter" />
          <FilterListItem attribute="tags" title="Теги" routeName="tags_filter" />
          <SortBy />
          <StatusFilter />
        </View>
        <View>
          <ShowListingsButton />
        </View>
      </View>
    </Delayed>
  );
};

export const VirtualFilter = () => {
  useRefinementList({ attribute: 'category' });
  useRefinementList({ attribute: 'designer' });
  useRefinementList({ attribute: 'size' });
  useRefinementList({ attribute: 'condition' });
  useRefinementList({ attribute: 'status' });
  useRefinementList({ attribute: 'tags' });
  useSortBy({ items: sortItems });
  useToggleRefinement({
    attribute: 'status',
    on: 'SOLD',
    off: 'AVAILABLE',
  });

  return null;
};

const CurrentFiltersScreen = () => {
  return <CurrentFilters />;
};

export default CurrentFiltersScreen;
