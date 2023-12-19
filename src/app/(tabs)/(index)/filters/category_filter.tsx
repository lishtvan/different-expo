import { Stack } from 'expo-router';
import React from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'tamagui';

const DesignerFilter = () => {
  const { items, refine } = useRefinementList({ attribute: 'category' });

  const { canRefine, refine: clearAllCategories } = useClearRefinements({
    includedAttributes: ['category'],
  });

  return (
    <View>
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
      {items.map((i) => (
        <TouchableOpacity
          onPress={() => {
            refine(i.value);
          }}
          className="p-2"
          key={i.value}>
          <Text>
            {i.label} {i.isRefined && 'X'}
            {'    '} {i.count}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const DesignerFilterScreen = () => {
  return (
    <View>
      <DesignerFilter />
    </View>
  );
};

export default DesignerFilterScreen;
