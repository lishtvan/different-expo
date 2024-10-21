import { useScrollToTop } from '@react-navigation/native';
import ListingCard from 'components/listings/ListingCard';
import Delayed from 'components/wrappers/Delayed';
import { useSegments } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { useInfiniteHits } from 'react-instantsearch-core';
import { FlatList, RefreshControlProps } from 'react-native';
import { Spinner, Text, View } from 'tamagui';
import { TListing } from 'types';
import { getDynamicEndingForListingsCount } from 'utils/common';

const RenderItem = ({ item, segment }: { item: TListing; segment?: string }) => {
  return (
    <View className="w-[49.5%]">
      <ListingCard segment={segment} listing={item} />
    </View>
  );
};

interface Props {
  blockedUsers?: any[];
  refreshControl: React.ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >;
}

const HomeListings: React.FC<Props> = ({ refreshControl, blockedUsers }) => {
  const scrollRef = useRef<FlatList>(null);
  const segments = useSegments();
  useScrollToTop(scrollRef);

  const { hits, isLastPage, showMore, results } = useInfiniteHits<TListing>();

  const listingsCountString = useMemo(() => {
    if (!results) return '';
    const refinements = results.getRefinements();
    const isShowSold = refinements.find((i) => i.attributeName === 'status')?.name === 'SOLD';
    return getDynamicEndingForListingsCount(results.nbHits, isShowSold);
  }, [results]);

  const listings = blockedUsers
    ? hits.filter((item) => {
        const isBlocked = blockedUsers.find((i) => item.sellerId === i.blockedId.toString());
        return !isBlocked;
      })
    : hits;

  return (
    <Delayed waitBeforeShow={100}>
      <FlatList
        ref={scrollRef}
        data={listings}
        refreshControl={refreshControl}
        keyboardDismissMode="on-drag"
        ListHeaderComponent={() => (
          <View className="px-2 py-1">
            <Text className="text-lg font-semibold">{listingsCountString}</Text>
          </View>
        )}
        onEndReached={() => {
          if (!isLastPage) showMore();
        }}
        style={{ height: '100%' }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        numColumns={2}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={(object) => <RenderItem item={object.item} segment={segments[1]} />}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => !isLastPage && <Spinner className="mb-10 mt-10" size="large" />}
      />
    </Delayed>
  );
};

export default HomeListings;
