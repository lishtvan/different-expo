import { EvilIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Button, Input, Text, View, XStack } from 'tamagui';

import { DESIGNERS } from '../../../constants/listing';
import { isAndroid } from '../../../utils/platform';

export default function DesignerSearchScreen() {
  const [searchText, onChangeSearch] = useState('');
  const [filteredData, setFilteredData] = useState<string[]>([]);

  useEffect(() => {
    if (!searchText) {
      setFilteredData(DESIGNERS);
      return;
    }
    const filtered = DESIGNERS.filter((item) =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredData(filtered);
  }, [searchText]);

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="p-2"
      onPress={() => {
        router.push({ pathname: '/sell', params: { designer: item } });
      }}>
      <Text className="text-lg">{item}</Text>
    </TouchableOpacity>
  );

  const iconClassname = isAndroid ? 'p-0 pl-2 pb-1 bg-[#f8f8f8]' : 'p-0 pl-2  bg-[#f8f8f8]';

  return (
    <View className="p-3 flex-1">
      <XStack alignItems="center">
        <Button
          size="$4"
          icon={<EvilIcons name="search" size={30} />}
          className={iconClassname}
          borderTopLeftRadius="$main"
          borderBottomLeftRadius="$main"
          borderTopRightRadius="$0"
          borderBottomRightRadius="$0"
          borderWidth="$0"
          borderRightWidth="$0"
        />
        <Input
          autoFocus
          autoCorrect={false}
          placeholder="Введіть назву дизайнера"
          flex={1}
          paddingLeft={6}
          borderWidth="$0"
          onChangeText={(newText) => onChangeSearch(newText)}
          borderRadius="$0"
          borderTopRightRadius="$main"
          borderBottomRightRadius="$main"
        />
      </XStack>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </View>
  );
}
