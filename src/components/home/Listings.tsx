import { useScrollToTop } from '@react-navigation/native';
import ListingCard from 'components/listings/ListingCard';
import Delayed from 'components/wrappers/Delayed';
import { useFocusEffect, useSegments } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteHits } from 'react-instantsearch-core';
import { FlatList, RefreshControlProps } from 'react-native';
import { Spinner, Text, View } from 'tamagui';
import { TListing } from 'types';
import { getDynamicEndingForListingsCount } from 'utils/common';

const RenderItem = ({
  item,
  segment,
  blockedUsers,
}: {
  item: TListing;
  segment?: string;
  blockedUsers: any[];
}) => {
  const isBlocked = blockedUsers.find((i) => item.sellerId === i.blockedId.toString());
  if (isBlocked) return null;
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
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const segments = useSegments();

  const { hits, isLastPage, showMore, results } = useInfiniteHits<TListing>();

  useScrollToTop(scrollRef);

  useEffect(() => {
    setShouldScrollToTop(true);
  }, [results?.nbHits]);

  useFocusEffect(
    useCallback(() => {
      if (shouldScrollToTop) {
        scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
        setShouldScrollToTop(false);
      }
    }, [shouldScrollToTop])
  );

  const listingsCountString = useMemo(() => {
    if (!results) return '';
    const refinements = results.getRefinements();
    const isShowSold = refinements.find((i) => i.attributeName === 'status')?.name === 'SOLD';
    return getDynamicEndingForListingsCount(results.nbHits, isShowSold);
  }, [results]);

  return (
    <Delayed waitBeforeShow={100}>
      <FlatList
        ref={scrollRef}
        data={hits}
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
        renderItem={(object) => (
          <RenderItem item={object.item} blockedUsers={blockedUsers || []} segment={segments[1]} />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => !isLastPage && <Spinner className="mb-10 mt-10" size="large" />}
      />
    </Delayed>
  );
};

export default HomeListings;
