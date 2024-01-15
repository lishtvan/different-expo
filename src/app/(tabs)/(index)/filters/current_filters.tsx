import { AntDesign, Entypo } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import React, { FC, useState } from 'react';
import {
  useClearRefinements,
  useCurrentRefinements,
  useHits,
  useRefinementList,
} from 'react-instantsearch-core';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, ListItem, Separator, Switch, Text, View } from 'tamagui';

import { mainColor } from '../../../../../tamagui.config';
import Delayed from '../../../../components/wrappers/Delayed';
import { getDynamicEndingShowButton } from '../../../../utils/common';

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
          <ListItem.Text className="w-[35%] text-base">{title}</ListItem.Text>
          <ListItem.Subtitle
            textAlign="right"
            className="mr-2 text-base font-medium text-main"
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
      fontSize="$6"
      size="$5"
      borderRadius="$main"
      onPress={() => router.push({ pathname: '/' })}>
      {results && `Переглянути ${getDynamicEndingShowButton(results.nbHits)}`}
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

const SortBy = () => {
  const [sort, setSort] = useState(() =>
    ['Спочатку нові', 'Спочатку дешеві', 'Спочатку дорогі'].map((tag) => ({
      label: tag,
      value: tag,
    }))
  );
  const [selectedSort, setSelectedSort] = useState('Спочатку нові');

  const [open, setOpen] = useState(false);

  return (
    <View className="mt-32 flex-row items-center justify-between">
      <Text className="text-lg">Сортування</Text>
      <View className="w-3/5">
        <DropDownPicker
          open={open}
          dropDownDirection="TOP"
          showBadgeDot={false}
          arrowIconStyle={{ marginRight: 6 }}
          dropDownContainerStyle={{ borderColor: '#ebebeb', borderRadius: 16, width: '100%' }}
          style={{
            width: '100%',
            maxWidth: '100%',
            backgroundColor: '#f8f8f8',
            borderRadius: 16,
            borderColor: '#ebebeb',
          }}
          textStyle={{ fontSize: 16 }}
          listItemLabelStyle={{ fontSize: 18 }}
          listItemContainerStyle={{ marginVertical: 5 }}
          badgeDotColors={[mainColor]}
          containerStyle={{ borderRadius: 16, backgroundColor: 'white' }}
          TickIconComponent={() => <AntDesign color={mainColor} name="check" size={23} />}
          value={selectedSort}
          items={sort}
          props={{ activeOpacity: 0.5 }}
          setOpen={setOpen}
          setValue={setSelectedSort}
          setItems={setSort}
          listMode="SCROLLVIEW"
        />
      </View>
    </View>
  );
};

const StatusFilter = () => {
  const { refine, items } = useRefinementList({ attribute: 'status' });

  return (
    <View className="mt-4 flex-row items-center justify-between">
      <Text className="text-lg">Показати продані</Text>
      <Switch
        size="$3.5"
        checked={items.length === 2}
        backgroundColor={items.length === 2 ? mainColor : '$gray7'}
        onCheckedChange={() => refine('SOLD')}>
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
          <FilterListItem attribute="designer" title="Розмір" routeName="designer_filter" />
          <FilterListItem attribute="designer" title="Стан речі" routeName="designer_filter" />
          <FilterListItem attribute="designer" title="Ціна" routeName="designer_filter" />
          <FilterListItem attribute="designer" title="Теги" routeName="designer_filter" />
          <SortBy />
          <StatusFilter />
        </View>
        <View className="mb-30">
          <ShowListingsButton />
        </View>
      </View>
    </Delayed>
  );
};

export const VirtualFilter = () => {
  useRefinementList({ attribute: 'category' });
  useRefinementList({ attribute: 'designer' });
  useRefinementList({ attribute: 'status' });

  return null;
};

const CurrentFiltersScreen = () => {
  return <CurrentFilters />;
};

export default CurrentFiltersScreen;
