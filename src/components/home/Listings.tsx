import React, { FC, useEffect } from 'react';
import { useInfiniteHits } from 'react-instantsearch-core';
import { Spinner, View } from 'tamagui';

import { TListing } from '../../types';
import Listing from '../listings/Listing';

interface Props {
  isViewCloseToBottom: boolean;
  setCloseToBottomFalse: () => void;
}

const HomeListings: FC<Props> = ({ isViewCloseToBottom, setCloseToBottomFalse }) => {
  const { hits, isLastPage, showMore, results } = useInfiniteHits<TListing>();

  useEffect(() => {
    if (results?.nbHits && isViewCloseToBottom && !isLastPage) {
      showMore();
      setTimeout(() => {
        setCloseToBottomFalse();
      }, 200);
    }
  }, [isViewCloseToBottom]);

  return (
    <View>
      <View className="flex justify-between flex-row flex-wrap gap-y-4">
        {hits.map((listing) => (
          <View className="w-[49.4%]" key={listing.id}>
            <Listing listing={listing} />
          </View>
        ))}
      </View>
      {!isLastPage && <Spinner className="mt-10 mb-10" size="large" />}
    </View>
  );
};

export default HomeListings;
