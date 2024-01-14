import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { FC, memo } from 'react';
import { Text, View } from 'tamagui';

import { SHORT_SIZES } from '../../constants/listing';
import { TListing } from '../../types';

interface Props {
  listing: TListing;
}

const MyListing: FC<Props> = ({ listing }) => {
  return (
    <View onPress={() => router.push(`/listing/${listing.id}`)}>
      <Image
        className="aspect-[0.83] w-full object-cover "
        source={listing.imageUrls[0]}
        alt="item"
      />
      <View className="px-2">
        <View className="mt-3 w-full flex flex-row justify-between">
          <Text numberOfLines={1} className="w-10/12 text-sm font-bold">
            {listing.designer}
          </Text>
          <Text className="ml-1 text-sm">{SHORT_SIZES[listing.size]}</Text>
        </View>
        <Text numberOfLines={1} className="mt-1.5 text-sm">
          {listing.title}
        </Text>
        <Text className={`my-2  text-sm font-bold ${listing.status === 'SOLD' && 'text-main'}`}>
          {listing.price} ₴ {listing.status === 'SOLD' && '(Ціна продажі)'}
        </Text>
      </View>
    </View>
  );
};

const Listing = memo(MyListing);

export default Listing;
