import { Image } from 'expo-image';
import { useState } from 'react';
import { Dimensions } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import Carousel from 'react-native-reanimated-carousel';
import { View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';

export default function ListingPage() {
  const width = Dimensions.get('window').width;
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View className="flex-1">
      <Carousel
        loop
        width={width}
        height={width}
        data={[
          'https://media-assets.grailed.com/prd/listing/temp/e6248b8b4d964283900d1f695ab31901?h=1400&fit=clip&q=20&auto=format',
          'https://s3.eu-central-1.amazonaws.com/different.dev/PqO9YhJ4SvmVIIV6GINY7w-0000000029:w=4608&h=3456',
          'https://s3.eu-central-1.amazonaws.com/different.dev/PqO9YhJ4SvmVIIV6GINY7w-0000000030:w=4608&h=3456',
          'https://s3.eu-central-1.amazonaws.com/different.dev/PqO9YhJ4SvmVIIV6GINY7w-0000000031:w=4608&h=3456',
          'https://s3.eu-central-1.amazonaws.com/different.dev/PqO9YhJ4SvmVIIV6GINY7w-0000000032:w=3456&h=4608',
          'https://s3.eu-central-1.amazonaws.com/different.dev/Ry4oHWJ8TrqgphwAyBq0_w-0000000045:w=1278&h=1278',
          'https://s3.eu-central-1.amazonaws.com/different.dev/Ry4oHWJ8TrqgphwAyBq0_w-0000000048:w=1278&h=1278',
          'https://s3.eu-central-1.amazonaws.com/different.dev/Ry4oHWJ8TrqgphwAyBq0_w-0000000049:w=1278&h=1278',
        ]}
        scrollAnimationDuration={300}
        onScrollEnd={(i) => setCurrentIndex(i)}
        renderItem={({ item }) => <Image className="flex-1" source={{ uri: item }} alt="item" />}
      />

      <View className="absolute w-full">
        <View className="mx-auto mt-4">
          <AnimatedDotsCarousel
            length={8}
            currentIndex={currentIndex}
            maxIndicators={4}
            activeIndicatorConfig={{ color: mainColor, margin: 3, opacity: 1, size: 8 }}
            inactiveIndicatorConfig={{ color: 'gray', margin: 3, opacity: 0.5, size: 8 }}
            decreasingDots={[
              { config: { color: 'gray', margin: 3, opacity: 0.5, size: 6 }, quantity: 1 },
              { config: { color: 'gray', margin: 3, opacity: 0.5, size: 4 }, quantity: 1 },
            ]}
          />
        </View>
      </View>
    </View>
  );
}
