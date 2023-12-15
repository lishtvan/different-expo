import React from 'react';
import { useConfigure, useRefinementList } from 'react-instantsearch-core';
import { View, Text } from 'react-native';
import { Checkbox } from 'tamagui';

import SearchInstance from '../../../components/wrappers/SearchInstance';

const Filters = () => {
  const { refine, items } = useRefinementList({ attribute: 'designer' });

  useConfigure({ filters: 'designer:=[`Loro Piana`]' });

  return (
    <View className="p-4">
      {items.map((i) => (
        <View key={i.label} className=" flex-row gap-x-2">
          <Checkbox onPress={() => refine(i.value)} checked={i.isRefined}>
            <Checkbox.Indicator>
              <Text>X</Text>
            </Checkbox.Indicator>
          </Checkbox>
          <Text>{i.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default function FiltersScreen() {
  return (
    <SearchInstance>
      <Filters />
    </SearchInstance>
  );
}
