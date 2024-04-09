import { useQuery } from '@tanstack/react-query';
import { mainColor } from 'constants/colors';
import * as React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { fetcher } from 'utils/fetcher';

const BuyOrders = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Buy orders</Text>
    </View>
  );
};

const SellOrders = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Sell orders</Text>
    </View>
  );
};

const renderScene = SceneMap({
  first: BuyOrders,
  second: SellOrders,
});

export default function TabViewExample() {
  const { isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetcher({ route: '/order/getMany' }),
  });

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  if (isLoading) return null;

  return (
    <TabView
      renderTabBar={(props) => (
        <TabBar
          {...props}
          labelStyle={{
            color: 'black',
            textTransform: 'capitalize',
            fontSize: 16,
          }}
          inactiveColor="#666666"
          pressOpacity={0.5}
          indicatorStyle={{ backgroundColor: mainColor }}
          style={{ backgroundColor: 'white' }}
        />
      )}
      navigationState={{
        index,
        routes: [
          { key: 'first', title: 'Покупки' },
          { key: 'second', title: 'Продажі' },
        ],
      }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
