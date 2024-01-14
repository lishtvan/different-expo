import React, { FC, useEffect } from 'react';
import { useClearRefinements, useInfiniteHits, useRefinementList } from 'react-instantsearch-core';
import { Spinner, Text, View } from 'tamagui';

import { TListing } from '../../types';
import Listing from '../listings/Listing';
import Delayed from '../wrappers/Delayed';

interface Props {
  isViewCloseToBottom: boolean;
  setCloseToBottomFalse: () => void;
  showSold: boolean;
  sellerId: string;
}

const UserListings: FC<Props> = ({
  isViewCloseToBottom,
  setCloseToBottomFalse,
  sellerId,
  showSold,
}) => {
  const { hits, isLastPage, showMore, results } = useInfiniteHits<TListing>();

  const { refine: refineStatus } = useRefinementList({ attribute: 'status' });
  const { refine: refineSeller } = useRefinementList({ attribute: 'sellerId' });
  const clear = useClearRefinements();

  useEffect(() => {
    if (!sellerId) return;
    clear.refine();
    if (showSold) refineStatus('SOLD');
    refineSeller(sellerId.toString());
  }, [sellerId, showSold]);

  useEffect(() => {
    if (results?.nbHits && isViewCloseToBottom && !isLastPage) {
      showMore();
      setTimeout(() => {
        setCloseToBottomFalse();
      }, 200);
    }
  }, [isViewCloseToBottom]);

  return (
    <Delayed waitBeforeShow={100}>
      <View>
        <View className="flex flex-row flex-wrap justify-between gap-y-4 ">
          {hits.map((listing) => (
            <View className="w-[49.4%]" key={listing.id}>
              <Listing listing={listing} />
            </View>
          ))}
        </View>
        {!isLastPage && <Spinner className="mb-10 mt-10" size="large" />}
        {results && !results.nbHits ? (
          <View className="mt-32 flex-1 items-center justify-center">
            <Text className=" text-lg font-semibold">
              {showSold ? 'Ще немає проданих товарів' : 'Оголошень ще немає'}
            </Text>
          </View>
        ) : null}
      </View>
    </Delayed>
  );
};

export default UserListings;
