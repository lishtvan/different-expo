import { AntDesign } from '@expo/vector-icons';
import { useScrollToTop } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { InstantSearch } from 'react-instantsearch-core';
import { NativeScrollEvent } from 'react-native';
import { Avatar, Button, ScrollView, Tabs, Text, View } from 'tamagui';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import UserListings from './Listings';
import { mainColor } from '../../../tamagui.config';
import { config } from '../../config/config';
import { LISTINGS_COLLECTION } from '../../constants/listing';
import { Env } from '../../types';
import { fetcher } from '../../utils/fetcher';
import { shareLink } from '../../utils/share';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const User = () => {
  const params = useLocalSearchParams();
  const [currentTab, setCurrentTab] = useState('available');
  const [isViewCloseToBottom, setIsViewCloseToBottom] = useState(false);

  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', params.nickname],
    queryFn: () => fetcher({ body: { nickname: params.nickname }, route: '/user/get' }),
  });

  const { searchClient } = useMemo(() => {
    const env = process.env.EXPO_PUBLIC_ENVIRONMENT as Env;
    return new TypesenseInstantsearchAdapter(config[env].typesense);
  }, []);

  const setCloseToBottomFalse = useCallback(() => {
    setIsViewCloseToBottom(false);
  }, []);

  if (isLoading) return null;

  return (
    <ScrollView
      ref={scrollRef}
      stickyHeaderIndices={[4]}
      className="flex-1 "
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          setIsViewCloseToBottom(true);
        }
      }}
      scrollEventThrottle={1000}>
      <Stack.Screen options={{ headerTitle: user.nickname }} />
      <View className="flex flex-row gap-x-4 px-2 ">
        <Avatar circular size="$10">
          <Avatar.Image
            src={
              user.avatarUrl ||
              'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
            }
          />
          <Avatar.Fallback bc="green" delayMs={5000} />
        </Avatar>
        <View className="flex flex-row items-center gap-x-6">
          <View className="flex items-center">
            <Text className="font-bold" fontSize="$6">
              {user.availableListingsCount}
            </Text>
            <Text className="font-medium" fontSize="$6">
              оголошень
            </Text>
          </View>
          <View className="flex items-center">
            <Text className="font-bold" fontSize="$6">
              {user.soldListingsCount}
            </Text>
            <Text className="font-medium" fontSize="$6">
              проданих
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-2 px-3">
        <Text fontSize="$6">{user.description}</Text>
      </View>
      <View className="flex-row mt-4 px-2 mb-3 items-center gap-x-4 w-full">
        <Button
          onPress={() => router.push(user.isOwnAccount ? '/settings' : '/')}
          size="$3"
          theme="active"
          className="w-[47%]"
          fontSize="$5"
          borderRadius="$main">
          {user.isOwnAccount ? 'Редагувати' : 'Повідомлення'}
        </Button>
        <Button
          onPress={() => shareLink(user.nickname)}
          size="$3"
          className="w-[47%]"
          fontSize="$5"
          borderRadius="$main">
          Поділитися
        </Button>
      </View>
      <Tabs
        defaultValue="available"
        onValueChange={(value) => {
          setIsViewCloseToBottom(false);
          setCurrentTab(value);
        }}
        orientation="horizontal"
        flexDirection="column"
        borderRadius="$4">
        <Tabs.List unstyled>
          <Tabs.Tab
            borderBottomWidth={currentTab === 'available' && '$1'}
            borderColor={mainColor}
            backgroundColor="white"
            borderRadius="$0"
            flex={1}
            value="available"
            unstyled>
            <AntDesign size={25} name="checkcircleo" />
          </Tabs.Tab>
          <Tabs.Tab
            borderColor={mainColor}
            borderRadius="$0"
            borderBottomWidth={currentTab === 'sold' && '$1'}
            backgroundColor="white"
            flex={1}
            value="sold"
            unstyled>
            <AntDesign size={25} name="closecircleo" />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <View className="mt-1">
        <InstantSearch indexName={LISTINGS_COLLECTION} searchClient={searchClient}>
          <UserListings
            sellerId={user.id}
            showSold={currentTab === 'sold'}
            setCloseToBottomFalse={setCloseToBottomFalse}
            isViewCloseToBottom={isViewCloseToBottom}
          />
        </InstantSearch>
      </View>
    </ScrollView>
  );
};

export default User;
