import { CATEGORIES, EU_SIZES, SECTIONS, SHORT_SIZES, SIZES, Section } from 'constants/listing';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Text, View } from 'tamagui';

const SelectCategoryAndSize = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedSection, setSelectedSection] = useState<Section | ''>('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { listingId } = useLocalSearchParams();

  const pathname = listingId ? '/edit_listing' : '/sell';

  return (
    <ScrollView ref={scrollRef} className="flex-1 px-1">
      <View>
        <Text className="mb-3 pl-3 text-xl font-medium">Секція</Text>
        <View className="mx-auto flex-row flex-wrap gap-3">
          {SECTIONS.map((section) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedSection(section);
                setSelectedCategory('');
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 200);
              }}
              className={`h-16 w-[45%] items-center justify-center rounded-xl border-[0.8px] ${section === selectedSection ? 'bg-main' : 'bg-white'}`}
              key={section}>
              <Text
                className={`text-base font-bold ${section === selectedSection ? 'text-white' : 'text-[#737373]'}`}>
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {selectedSection && (
        <Animated.View entering={FadeIn.duration(300)}>
          <Text className="mb-3 mt-3 pl-3 text-xl font-medium">Категорія</Text>
          <View className="mx-auto mb-1 flex-row flex-wrap gap-3">
            {CATEGORIES[selectedSection].map((category) => (
              <TouchableOpacity
                onPress={() => {
                  if (selectedSection === 'Аксесуари') {
                    router.navigate({
                      pathname,
                      params: { listingId, size: 'ONE SIZE', category },
                    });
                    return;
                  }
                  setSelectedCategory(category);
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 200);
                }}
                className={`h-16 w-[45%] items-center justify-center rounded-xl border-[0.8px] ${category === selectedCategory ? 'bg-main' : 'bg-white'}`}
                key={category}>
                <Text
                  className={`text-base font-bold ${category === selectedCategory ? 'text-white' : 'text-[#737373]'}`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
      {selectedCategory && (
        <View className="mb-3 w-full">
          <Text className="mb-3 mt-3 pl-3 text-xl font-medium">Розмір</Text>
          <View className="flex-row flex-wrap gap-2 px-3">
            {SIZES[selectedSection as Section].map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() =>
                  router.navigate({
                    pathname,
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
