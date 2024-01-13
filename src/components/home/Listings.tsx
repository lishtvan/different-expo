import { useScrollToTop } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteHits } from 'react-instantsearch-core';
import { FlatList, RefreshControlProps } from 'react-native';
import { Spinner, Text, View } from 'tamagui';

import { TListing } from '../../types';
import Listing from '../listings/Listing';

const renderItem = ({ item }: { item: TListing }) => {
  return (
    <View className="w-[49.5%]">
      <Listing listing={item} />
    </View>
  );
};

interface Props {
  refreshControl: React.ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >;
}

const HomeListings: React.FC<Props> = ({ refreshControl }) => {
  const scrollRef = useRef<FlatList>(null);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

  const { hits, isLastPage, showMore, results } = useInfiniteHits<TListing>();

  useScrollToTop(scrollRef);

  useEffect(() => {
    setShouldScrollToTop(true);
  }, [results?.nbHits]);

  useFocusEffect(
    useCallback(() => {
      if (shouldScrollToTop) {
        scrollRef?.current?.scrollToOffset({ offset: 0, animated: true });
        setShouldScrollToTop(false);
      }
    }, [shouldScrollToTop])
  );

  return (
    <FlatList
      ref={scrollRef}
      data={hits}
      refreshControl={refreshControl}
      keyboardDismissMode="on-drag"
      ListHeaderComponent={() => (
        <View className="px-2 py-1">
          <Text className=" text-lg font-semibold">{results?.nbHits} оголошень в наявновсті</Text>
        </View>
      )}
      onEndReached={() => {
        if (!isLastPage) showMore();
      }}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      numColumns={2}
      ItemSeparatorComponent={() => <View className="h-3" />}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListFooterComponent={() => !isLastPage && <Spinner className="mt-10 mb-10" size="large" />}
    />
  );
};

export default HomeListings;
