import { EvilIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Button, Input, Separator, Text, View, XStack } from 'tamagui';

import { fixedEncodeURIComponent } from '../../utils/common';
import { searchCity } from '../../utils/novaposhta';
import { isAndroid } from '../../utils/platform';

interface City {
  DeliveryCity: string;
  Present: string;
  Ref: string;
}

const RenderDesigner = ({ item, listingId }: { item: City; listingId: string }) => (
  <Link
    href={{
      pathname: '/create_order/select_department',
      params: {
        cityRef: item.DeliveryCity,
        listingId,
        cityName: fixedEncodeURIComponent(item.Present),
      },
    }}
    asChild>
    <TouchableOpacity className="p-2">
      <Text className="text-lg">{item.Present}</Text>
    </TouchableOpacity>
  </Link>
);

export default function SelectCity() {
  const params = useLocalSearchParams<{ listingId: string }>();
  const [searchText, onChangeSearch] = useState('');

  const { data, isLoading } = useQuery<City[]>({
    queryKey: ['search_city', searchText],
    queryFn: () => searchCity(searchText || 'К'),
  });

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
          placeholder="Пошук"
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
        data={isLoading || !data ? [] : data}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={(object) => <RenderDesigner item={object.item} listingId={params.listingId} />}
        keyExtractor={(item) => item.Ref}
      />
    </View>
  );
}
