import { EvilIcons } from '@expo/vector-icons';
import { useScrollToTop } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { FC, memo, useEffect, useRef } from 'react';
import {
  useInfiniteHits,
  useInstantSearch,
  useRefinementList,
  useToggleRefinement,
} from 'react-instantsearch-core';
import { FlatList, RefreshControl, RefreshControlProps } from 'react-native';
import { Avatar, Button, Spinner, Switch, Text, View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import { useRefresh } from '../../hooks/useRefresh';
import { TListing, TUser } from '../../types';
import { fetcher } from '../../utils/fetcher';
import { shareLink } from '../../utils/share';
import Listing from '../listings/Listing';
import Delayed from '../wrappers/Delayed';

const User = () => {
  const params = useLocalSearchParams<{ nickname: string }>();
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user', params.nickname],
    queryFn: () => fetcher({ body: { nickname: params.nickname }, route: '/user/get' }),
  });

  const { refreshing, handleRefresh } = useRefresh(refetch);
  const { refresh, setUiState } = useInstantSearch();

  if (isLoading || refreshing) return null;

  return (
    <UserContent
      user={user}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setUiState((state) => {
              state.listings.page = 0;
              return state;
            });
            refresh();
            handleRefresh();
          }}
        />
      }
    />
  );
};

interface Props {
  refreshControl: React.ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >;
  user: TUser;
}

const renderItem = ({ item }: { item: TListing }) => {
  return (
    <View className="w-[49.5%]">
      <Listing listing={item} />
    </View>
  );
};

interface StatusSwitcherProps {
  value: { isRefined: boolean };
  refine: (value: { isRefined: boolean }) => void;
}

const StatusSwitcher: FC<StatusSwitcherProps> = ({ value, refine }) => {
  return (
    <View className="flex-row items-center mb-4 mt-1 px-3 gap-x-4">
      <Text className="text-lg">Показати продані речі</Text>
      <Switch
        size="$3"
        checked={value.isRefined}
        backgroundColor={value.isRefined ? mainColor : '$gray7'}
        onCheckedChange={() => refine({ isRefined: value.isRefined })}>
        <Switch.Thumb backgroundColor="white" animation="bouncy" />
      </Switch>
    </View>
  );
};

const MyHeader = ({ user }: { user: TUser }) => {
  const { refine, value } = useToggleRefinement({
    attribute: 'status',
    on: 'SOLD',
    off: 'AVAILABLE',
  });

  return (
    <View>
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
              продано
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
      {user.soldListingsCount > 0 && <StatusSwitcher value={value} refine={refine} />}
    </View>
  );
};

const Header = memo(MyHeader);

const UserContent: FC<Props> = ({ refreshControl, user }) => {
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  const { hits, isLastPage, showMore } = useInfiniteHits<TListing>();

  const { refine: refineSeller } = useRefinementList({ attribute: 'sellerId' });

  useEffect(() => {
    refineSeller(user.id.toString());
  }, []);

  return (
    <Delayed waitBeforeShow={100}>
      <FlatList
        ref={scrollRef}
        data={hits}
        refreshControl={refreshControl}
        ListHeaderComponent={<Header user={user} />}
        onEndReached={() => {
          if (!isLastPage) showMore();
        }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        numColumns={2}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => !isLastPage && <Spinner className="mb-10 mt-10" size="large" />}
      />
    </Delayed>
  );
};

export default User;
