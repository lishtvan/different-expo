import { Stack } from 'expo-router';
import React from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'tamagui';

import SearchInstance from '../../../../components/wrappers/SearchInstance';
import SearchSynchonization from '../../../../components/wrappers/SearchSynchonization';
import { useFilterStore } from '../../../../store/store';

const DesignerFilter = () => {
  const { items } = useRefinementList({ attribute: 'designer' });
  const addDesigner = useFilterStore((state) => state.addDesigner);
  const removeDesigner = useFilterStore((state) => state.removeDesigner);
  const clearDesigners = useFilterStore((state) => state.clearDesigners);

  const { canRefine } = useClearRefinements({ includedAttributes: ['designer'] });

  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity className={`${canRefine ? '' : 'hidden'} `} onPress={clearDesigners}>
              <Text className="text-base">Видалити всe</Text>
            </TouchableOpacity>
          ),
        }}
      />
      {items.map((i) => (
        <TouchableOpacity
          onPress={() => {
            if (i.isRefined) removeDesigner(i.value);
            else addDesigner(i.value);
          }}
          className="p-2"
          key={i.value}>
          <Text>
            {i.label} {i.isRefined && 'X'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const DesignerFilterScreen = () => {
  return (
    <View>
      <SearchInstance>
        <SearchSynchonization>
          <DesignerFilter />
        </SearchSynchonization>
      </SearchInstance>
    </View>
  );
};

export default DesignerFilterScreen;
