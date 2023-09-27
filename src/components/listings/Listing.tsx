import React, { FC } from "react";
import { Link } from "expo-router";
import { TListing } from "../../types";
import { Image, Text, View } from "tamagui";
import { SHORT_SIZES } from "../../constants/listing";

interface Props {
  listing: TListing;
}

const Listing: FC<Props> = ({ listing }) => {
  return (
    <Link href={`/listing/${listing.id}`}>
      <View>
        <Image
          className="aspect-[8.5/10] w-full object-cover "
          source={{ uri: `${listing.imageUrls[0]}` }}
          alt="item"
        />
        <View className="px-2">
          <View className="mt-3 w-full flex flex-row justify-between">
            <Text className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold">
              {listing.designer}
            </Text>
            <Text className="ml-1 whitespace-nowrap text-sm">
              {SHORT_SIZES[listing.size]}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm"
          >
            {listing.title}
          </Text>
          <Text
            className={`my-2  text-sm font-bold ${
              listing.status === "SOLD" && "text-main"
            }`}
          >
            {listing.price} ₴ {listing.status === "SOLD" && "(Ціна продажі)"}
          </Text>
        </View>
      </View>
    </Link>
  );
};

export default Listing;
