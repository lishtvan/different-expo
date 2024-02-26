import { EvilIcons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Button, Input, Text, View, XStack } from 'tamagui';

import { DESIGNERS } from '../../constants/listing';
import { isAndroid } from '../../utils/platform';

const RenderDesigner = ({ item, listingId }: { item: string; listingId?: string }) => (
  <Link
    href={{
      pathname: listingId ? '/edit_listing/' : '/sell',
      params: { designer: item, listingId: listingId || '' },
    }}
    asChild>
    <TouchableOpacity className="p-2">
      <Text className="text-lg">{item}</Text>
    </TouchableOpacity>
  </Link>
);

export default function DesignerSearch() {
  const [searchText, onChangeSearch] = useState('');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const params = useLocalSearchParams<{ listingId?: string }>();
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

  const iconClassname = isAndroid ? 'p-0 pl-2 pb-1 bg-[#f8f8f8]' : 'p-0 pl-2  bg-[#f8f8f8]';

  return (
    <View className="flex-1 px-3 py-1">
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
        renderItem={(object) => <RenderDesigner item={object.item} listingId={params.listingId} />}
        keyExtractor={(item) => item}
      />
    </View>
  );
}
