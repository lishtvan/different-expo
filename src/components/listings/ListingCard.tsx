import { SHORT_SIZES } from 'constants/listing';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { FC, memo } from 'react';
import { Text, View } from 'tamagui';
import { TListing } from 'types';

interface Props {
  listing: TListing;
  segment?: string;
}

const MyListing: FC<Props> = ({ listing, segment }) => {
  const link = segment
    ? `/${segment}/listing/${listing.id}`
    : {
        pathname: '/listingr',
        params: { listingId: listing.id },
      };
  return (
    // @ts-expect-error expo problem
    <Link push href={link} asChild>
      <View>
        <Image
          className="aspect-[0.83] w-full object-cover"
          source={listing.imageUrls[0]}
          alt="item"
          transition={200}
        />
        <View className="px-2">
          <View className="mt-3 flex w-full flex-row justify-between">
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
    </Link>
  );
};

const ListingCard = memo(MyListing);

export default ListingCard;
