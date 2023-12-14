import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { InstantSearch } from 'react-instantsearch-core';
import { Dimensions, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Input, View, XStack } from 'tamagui';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import HomeListings from '../../../components/home/Listings';
import { config } from '../../../config/config';
import { LISTINGS_COLLECTION } from '../../../constants/listing';
import { useRefresh } from '../../../hooks/useRefresh';
import { Env } from '../../../types';
import { delay, isCloseToBottom } from '../../../utils/common';
import { isAndroid } from '../../../utils/platform';

const env = process.env.EXPO_PUBLIC_ENVIRONMENT as Env;
const { searchClient } = new TypesenseInstantsearchAdapter(config[env].typesense);

const HomeScreen = () => {
  const [isViewCloseToBottom, setIsViewCloseToBottom] = useState(false);
  const { refreshing, refreshKey, handleRefresh } = useRefresh(delay, searchClient);

  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  const setCloseToBottomFalse = useCallback(() => {
    setIsViewCloseToBottom(false);
  }, []);

  const ScreenWidth = Dimensions.get('window').width;

  const iconClassname = isAndroid ? 'p-0 pl-2 pb-1' : 'p-0 pl-2';

  return (
    <View className="flex-1 items-center">
      <InstantSearch key={refreshKey} indexName={LISTINGS_COLLECTION} searchClient={searchClient}>
        <Stack.Screen
          options={{
            contentStyle: { paddingVertical: 5 },
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
                <TouchableOpacity className="ml-1 p-2 ">
                  <MaterialCommunityIcons name="tune-variant" size={25} />
                </TouchableOpacity>
              </XStack>
            ),
          }}
        />
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          ref={scrollRef}
          className="flex-1"
          keyboardDismissMode="on-drag"
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) setIsViewCloseToBottom(true);
          }}
          scrollEventThrottle={1000}>
          <HomeListings
            setCloseToBottomFalse={setCloseToBottomFalse}
            isViewCloseToBottom={isViewCloseToBottom}
          />
        </ScrollView>
      </InstantSearch>
    </View>
  );
};

export default HomeScreen;
