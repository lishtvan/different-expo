import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { useInstantSearch } from 'react-instantsearch-core';
import { Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Input, View, XStack } from 'tamagui';

import HomeListings from '../../../components/home/Listings';
import { useRefresh } from '../../../hooks/useRefresh';
import { delay } from '../../../utils/common';
import { isAndroid } from '../../../utils/platform';

const HomeListingsWrapper = () => {
  const { refreshing, refreshKey, handleRefresh } = useRefresh(() => delay(50));
  const { refresh } = useInstantSearch();
  return (
    <HomeListings
      key={refreshKey}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            refresh();
            handleRefresh();
          }}
        />
      }
    />
  );
};

const HomeScreen = () => {
  const ScreenWidth = Dimensions.get('window').width;
  const iconClassname = isAndroid ? 'p-0 pl-2 pb-1' : 'p-0 pl-2';

  console.log('render');
  return (
    <View>
      <Stack.Screen
        options={{
          contentStyle: { paddingTop: 7 },
          headerTitle: () => (
            <XStack alignItems="center" style={{ width: ScreenWidth - 30 }}>
              <Button
                size="$4"
                icon={<EvilIcons name="search" size={30} />}
                className={iconClassname}
                borderTopLeftRadius="$main"
                borderBottomLeftRadius="$main"
                borderTopRightRadius="$0"
                backgroundColor="#f8f4f4"
                borderBottomRightRadius="$0"
                borderWidth="$0"
                borderRightWidth="$0"
              />
              <Input
                autoCorrect={false}
                placeholder="Пошук"
                backgroundColor="#f8f4f4"
                flex={1}
                paddingLeft={6}
                borderWidth="$0"
                borderRadius="$0"
                borderTopRightRadius="$main"
                borderBottomRightRadius="$main"
              />
              <TouchableOpacity className="ml-1 p-2" onPress={() => router.push('/filters')}>
                <MaterialCommunityIcons name="tune-variant" size={25} />
              </TouchableOpacity>
            </XStack>
          ),
        }}
      />
      <HomeListingsWrapper />
    </View>
  );
};

export default HomeScreen;
