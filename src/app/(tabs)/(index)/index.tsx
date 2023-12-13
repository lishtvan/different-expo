import { useScrollToTop } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { InstantSearch } from 'react-instantsearch-core';
import { RefreshControl, ScrollView } from 'react-native';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import HomeListings from '../../../components/home/Listings';
import { config } from '../../../config/config';
import { LISTINGS_COLLECTION } from '../../../constants/listing';
import { useRefresh } from '../../../hooks/useRefresh';
import { Env } from '../../../types';
import { delay, isCloseToBottom } from '../../../utils/common';

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

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      ref={scrollRef}
      className="flex-1"
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) setIsViewCloseToBottom(true);
      }}
      scrollEventThrottle={1000}>
      <InstantSearch key={refreshKey} indexName={LISTINGS_COLLECTION} searchClient={searchClient}>
        <HomeListings
          setCloseToBottomFalse={setCloseToBottomFalse}
          isViewCloseToBottom={isViewCloseToBottom}
        />
      </InstantSearch>
    </ScrollView>
  );
};

export default HomeScreen;
