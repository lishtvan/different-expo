import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop } from '@react-navigation/native';
import { Stack, router, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useInstantSearch } from 'react-instantsearch-core';
import { Dimensions, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Input, XStack } from 'tamagui';

import HomeListings from '../../../components/home/Listings';
import { useRefresh } from '../../../hooks/useRefresh';
import { delay, isCloseToBottom } from '../../../utils/common';
import { isAndroid } from '../../../utils/platform';

const HomeScreen = () => {
  const [isViewCloseToBottom, setIsViewCloseToBottom] = useState(false);
  const navigation = useNavigation();
  // const { refresh } = useInstantSearch();
  const { refreshing, handleRefresh, refreshKey } = useRefresh(() => delay(100));
  const scrollRef = useRef(null);

  useScrollToTop(scrollRef);

  const setCloseToBottomFalse = useCallback(() => {
    setIsViewCloseToBottom(false);
  }, []);

  const ScreenWidth = Dimensions.get('window').width;

  const iconClassname = isAndroid ? 'p-0 pl-2 pb-1' : 'p-0 pl-2';
  console.log('render');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (scrollRef?.current) {
        console.log('scroll to top');
        // @ts-ignore
        scrollRef.current.scrollTo({
          y: 0,
          animated: true,
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  // TODO: Use flatlist for perf
  return (
    <ScrollView
      key={refreshKey}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            // refresh();
            handleRefresh();
          }}
        />
      }
      ref={scrollRef}
      className="flex-1 w-full"
      keyboardDismissMode="on-drag"
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) setIsViewCloseToBottom(true);
      }}
      scrollEventThrottle={1000}>
      <Stack.Screen
        options={{
          contentStyle: { paddingVertical: 7 },
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
      <HomeListings
        setCloseToBottomFalse={setCloseToBottomFalse}
        isViewCloseToBottom={isViewCloseToBottom}
      />
    </ScrollView>
  );
};

export default HomeScreen;
