import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Text, View } from 'tamagui';

import {
  CATEGORIES,
  EU_SIZES,
  SECTIONS,
  SHORT_SIZES,
  SIZES,
  Section,
} from '../../constants/listing';

// TODO: fix link and use it in sell page
const SelectCategoryAndSize = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedSection, setSelectedSection] = useState<Section | ''>('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { listingId } = useLocalSearchParams();

  return (
    <ScrollView ref={scrollRef} className="flex-1 px-1">
      <View>
        <Text className="font-medium text-xl pl-3 mb-3">Секція</Text>
        <View className="flex-row flex-wrap gap-3 mx-auto">
          {SECTIONS.map((section) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedSection(section);
                setSelectedCategory('');
              }}
              className={`w-[45%] h-16 items-center justify-center rounded-xl border-[0.8px] ${section === selectedSection ? 'bg-main' : 'bg-white'}`}
              key={section}>
              <Text
                className={`font-bold text-base ${section === selectedSection ? 'text-white' : 'text-[#737373]'}`}>
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {selectedSection && (
        <Animated.View entering={FadeIn.duration(300)}>
          <Text className="font-medium text-xl pl-3 mb-3 mt-3">Категорія</Text>
          <View className="flex-row flex-wrap gap-3 mx-auto">
            {CATEGORIES[selectedSection].map((category) => (
              <TouchableOpacity
                onPress={() => {
                  if (selectedSection === 'Аксесуари') {
                    router.navigate({
                      pathname: '/edit_listing',
                      params: { listingId, size: 'ONE SIZE', category },
                    });
                    return;
                  }
                  setSelectedCategory(category);
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 200);
                }}
                className={`w-[45%] h-16 items-center justify-center rounded-xl border-[0.8px] ${category === selectedCategory ? 'bg-main' : 'bg-white'}`}
                key={category}>
                <Text
                  className={`font-bold text-base ${category === selectedCategory ? 'text-white' : 'text-[#737373]'}`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
      {selectedCategory && (
        <View className="mb-20 w-full">
          <Text className="font-medium text-xl pl-3 mb-3 mt-3">Розмір</Text>
          <View className="flex-row flex-wrap gap-2 px-3">
            {SIZES[selectedSection as Section].map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() =>
                  router.navigate({
                    pathname: '/edit_listing',
                    params: { listingId, size, category: selectedCategory },
                  })
                }
                className="h-16 w-16 flex-col items-center justify-center rounded-lg border-[0.4px] bg-white">
                <Text className="text-base font-medium">
                  {SHORT_SIZES[size as keyof typeof SHORT_SIZES]}
                </Text>

                {EU_SIZES[size as keyof typeof EU_SIZES] && (
                  <View className="mt-1">
                    <Text className="text-xs  text-gray-600">
                      {EU_SIZES[size as keyof typeof EU_SIZES]}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SelectCategoryAndSize;
