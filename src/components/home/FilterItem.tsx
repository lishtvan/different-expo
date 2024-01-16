import { FC, memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'tamagui';

interface RefinementListItem {
  value: string;
  label: string;
  isRefined: boolean;
  count: number;
}

interface Props {
  item: RefinementListItem;
  refine: (value: string) => void;
}

const MyFilterItem: FC<Props> = ({ item, refine }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        refine(item.value);
      }}
      className="flex-row justify-between px-2 py-2.5">
      <Text className={`text-base ${item.isRefined ? 'font-semibold text-main' : 'text-black'}`}>
        {item.label}
      </Text>
      <View className="flex-row gap-x-2.5">
        <View className={`rounded-full px-2 ${item.isRefined ? 'bg-main' : 'bg-[#ebebeb]'}`}>
          <Text className={`mr-0.5 text-base ${item.isRefined ? 'text-white' : 'text-black'}`}>
            {item.count}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FilterItem = memo(MyFilterItem);
export default FilterItem;
