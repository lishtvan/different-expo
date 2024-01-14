import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { useScrollToTop } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { InstantSearch } from 'react-instantsearch-core';
import { RefreshControl } from 'react-native';
import { Avatar, Button, ScrollView, Tabs, Text, View } from 'tamagui';

import UserListings from './Listings';
import { mainColor } from '../../../tamagui.config';
import { LISTINGS_COLLECTION } from '../../constants/listing';
import { useRefresh } from '../../hooks/useRefresh';
import { isCloseToBottom } from '../../utils/common';
import { fetcher } from '../../utils/fetcher';
import { shareLink } from '../../utils/share';
import { searchClient } from '../../utils/typesense';

const User = () => {
  const params = useLocalSearchParams<{ nickname: string }>();
  const [currentTab, setCurrentTab] = useState('available');
  const [isViewCloseToBottom, setIsViewCloseToBottom] = useState(false);

  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user', params.nickname],
    queryFn: () => fetcher({ body: { nickname: params.nickname }, route: '/user/get' }),
  });

  // TODO: add refresh search
  const { refreshing, refreshKey, handleRefresh } = useRefresh(refetch);

  const setCloseToBottomFalse = useCallback(() => {
    setIsViewCloseToBottom(false);
  }, []);

  if (isLoading) return <Stack.Screen options={{ headerTitle: params.nickname }} />;

  if (refreshing) return null;

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      ref={scrollRef}
      stickyHeaderIndices={[4]}
      className="flex-1"
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) setIsViewCloseToBottom(true);
      }}
      scrollEventThrottle={1000}>
      <Stack.Screen
        options={{
          headerTitle: params.nickname,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 19 },
        }}
      />
      <View className="flex flex-row gap-x-4 px-2 ">
        <Avatar circular size="$10">
          <Avatar.Image
            src={
              user.avatarUrl ||
              'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
            }
          />
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

      <View>
        {user.location && (
          <View className="mt-2 flex-row items-center px-1.5">
            <EvilIcons size={25} style={{ padding: 0, opacity: 0.6 }} name="location" />
            <Text opacity={0.6} fontSize="$6">
              {user.location}
            </Text>
          </View>
        )}
        {user.bio && (
          <Text fontSize="$6" className="mt-2 px-3">
            {user.bio.replace(/\n+/g, '\n')}
          </Text>
        )}
      </View>
      <View className="mb-3 mt-4 w-full flex-row items-center gap-x-4 px-2">
        <Button
          onPress={() => router.push(user.isOwnAccount ? '/(tabs)/profile/settings' : '/')}
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
        onValueChange={(value) => {
          setIsViewCloseToBottom(false);
          setCurrentTab(value);
        }}
        orientation="horizontal"
        flexDirection="column"
        borderRadius="$4">
        <Tabs.List unstyled>
          <Tabs.Tab
            borderBottomWidth={currentTab === 'available' ? '$1' : '$0'}
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
            borderBottomWidth={currentTab === 'sold' ? '$1' : '$0'}
            backgroundColor="white"
            flex={1}
            value="sold"
            unstyled>
            <AntDesign size={25} name="closecircleo" />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <View className="mt-1">
        <InstantSearch key={refreshKey} indexName={LISTINGS_COLLECTION} searchClient={searchClient}>
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
