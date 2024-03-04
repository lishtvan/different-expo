import { EvilIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { FC, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Button, Input, Separator, Text, View, XStack } from 'tamagui';

import { fixedEncodeURIComponent } from '../../utils/common';
import { DepartmentNP, searchDepartments } from '../../utils/novaposhta';
import { isAndroid } from '../../utils/platform';

interface Props {
  item: DepartmentNP;
  listingId: string;
  cityRef: string;
  cityName: string;
}

const RenderDesigner: FC<Props> = ({ item, listingId, cityRef, cityName }) => (
  <Link
    href={{
      pathname: '/create_order',
      params: {
        listingId,
        cityRef,
        cityName: fixedEncodeURIComponent(cityName),
        departmentName: fixedEncodeURIComponent(item.Description),
        departmentRef: item.Ref,
      },
    }}
    asChild>
    <TouchableOpacity className="p-2">
      <Text className="text-lg">{item.Description}</Text>
    </TouchableOpacity>
  </Link>
);

export default function SelectDepartment() {
  const [searchText, onChangeSearch] = useState('');
  const params = useLocalSearchParams<Omit<Props, 'item'>>();
  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentNP[]>([]);

  const { data } = useQuery<DepartmentNP[]>({
    queryKey: ['search_department', params.cityRef],
    queryFn: () => searchDepartments(params.cityRef),
  });

  useEffect(() => {
    if (!data) return;
    if (!searchText) {
      setFilteredDepartments(data);
      return;
    }
    const filtered = data.filter((item) =>
      item.Description.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredDepartments(filtered);
  }, [searchText, data]);

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
        data={filteredDepartments}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={(object) => (
          <RenderDesigner
            cityName={params.cityName}
            cityRef={params.cityRef}
            item={object.item}
            listingId={params.listingId}
          />
        )}
        keyExtractor={(item) => item.Ref}
      />
    </View>
  );
}
