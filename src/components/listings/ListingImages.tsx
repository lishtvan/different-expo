import { Image } from 'expo-image';
import React, { FC, useRef, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  Text,
} from 'react-native';
// @ts-expect-error pinchable problem
import Pinchable from 'react-native-pinchable';

const { width: screenWidth } = Dimensions.get('window');
const aspectRatio = 0.83;

interface ListingImagesProps {
  imageUrls: string[];
}

// Create animated FlatList component
const AnimatedFlatList = Animated.createAnimatedComponent<any>(FlatList);

const ListingImages: FC<ListingImagesProps> = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Create extended data array for infinite scroll
  const extendedData = [...imageUrls, imageUrls[0]];

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: true,
  });

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);

      // Handle loop scroll
      if (newIndex === extendedData.length - 1) {
        // When we reach the last item (duplicate of first), scroll to the real first item without animation
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
        setCurrentIndex(0);
      } else {
        setCurrentIndex(newIndex);
      }
    },
    [extendedData.length]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: screenWidth,
      offset: screenWidth * index,
      index,
    }),
    []
  );

  const renderImage = useCallback(
    ({ item }: { item: string }) => (
      <View style={styles.imageContainer}>
        <Pinchable maximumZoomScale={6} style={styles.image}>
          <Image style={styles.image} source={{ uri: item }} contentFit="cover" />
        </Pinchable>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        ref={flatListRef}
        data={extendedData}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews
      />
      {imageUrls.length > 1 && (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{imageUrls.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    width: screenWidth,
    height: screenWidth / aspectRatio,
  },
  image: {
    flex: 1,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ListingImages;
