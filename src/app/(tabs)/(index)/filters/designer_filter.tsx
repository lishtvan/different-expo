import { Stack } from 'expo-router';
import React from 'react';
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'tamagui';

import Delayed from '../../../../components/wrappers/Delayed';

const Clear = () => {
  const { canRefine, refine: clearAllDesigners } = useClearRefinements({
    includedAttributes: ['designer'],
  });
  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <TouchableOpacity className={`${canRefine ? '' : 'hidden'} `} onPress={clearAllDesigners}>
            <Text className="text-base">Видалити всe</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

const DesignerFilter = () => {
  const { items, refine } = useRefinementList({ attribute: 'designer' });

  return (
    <View>
      <Clear />
      {items.map((i) => (
        <TouchableOpacity
          onPress={() => {
            refine(i.value);
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
    <Delayed waitBeforeShow={0}>
      <View>
        <DesignerFilter />
      </View>
    </Delayed>
  );
};

export default DesignerFilterScreen;
