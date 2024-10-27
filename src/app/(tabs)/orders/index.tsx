import { Entypo } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { mainColor } from 'constants/colors';
import { STATUS_MAPPER } from 'constants/order';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useRefreshOnFocus } from 'hooks/useRefreshOnFocus';
import { FC, useState } from 'react';
import { RefreshControl, RefreshControlProps, Text, useWindowDimensions } from 'react-native';
import { Badge } from 'react-native-elements';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Separator, View } from 'tamagui';
import { TListing } from 'types';
import { fetcher } from 'utils/fetcher';

interface Order {
  status: 'PAYMENT' | 'HANDLING' | 'SHIPPING' | 'FINISHED' | 'CANCELED';
  id: string;
  Listing: TListing;
  OrderNotification: OrderNotification[];
}

interface Props {
  orders: Order[];
  type: 'buy' | 'sell';
  refreshControl: React.ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >;
}

interface OrderNotification {
  id: string;
  orderId: string;
  userId: string;
}

const RenderOrder = ({ item }: { item: Order }) => {
  const { statusColor, statusText } = STATUS_MAPPER[item.status];

  return (
    <Link asChild href={{ pathname: '/orders/order', params: { orderId: item.id } }}>
      <View className="flex-row gap-x-3">
        <Image
          className="aspect-[0.83] w-20 rounded-lg"
          source={item.Listing.imageUrls[0]}
          alt="item"
          contentFit="cover"
          transition={200}
        />
        <View className="w-full flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold">{item.Listing.designer}</Text>
            <View className="flex-row items-center">
              {item.OrderNotification.length > 0 && (
                <View className="mr-1">
                  <Badge value="1" status="error" />
                </View>
              )}
              <Entypo name="chevron-thin-right" size={15} />
            </View>
          </View>
          <Text className="mt-2" numberOfLines={2}>
            {item.Listing.title}
          </Text>
          <View className="mt-auto flex-row items-center justify-between">
            <Text className={statusColor}>{statusText}</Text>
            <Text className="mb-0.5 text-base font-bold">{item.Listing.price} грн</Text>
          </View>
        </View>
      </View>
    </Link>
  );
};

const Orders: FC<Props> = ({ orders, type, refreshControl }) => {
  if (!orders.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="rounded-3xl bg-[#ebebeb] px-4 py-1.5">
          <Text className="text-base">
            {type === 'sell' ? 'Продажі відсутні' : 'Покупки відсутні'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FlashList
      data={orders}
      estimatedItemSize={96}
      refreshControl={refreshControl}
      contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 12 }}
      renderItem={RenderOrder}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => (
        <View className="mt-3 h-3">
          <Separator />
        </View>
      )}
    />
  );
};

function Tabs({ renderScene, buyNotificationCount, sellNotificationCount }: any) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'buy', title: 'Покупки' },
    { key: 'sell', title: 'Продажі' },
  ]);

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
          renderBadge={({ route }) => {
            const badgeCount = route.key === 'buy' ? buyNotificationCount : sellNotificationCount;
            if (!badgeCount) return null;
            return (
              <Text style={{ marginTop: 18, marginRight: 36 }}>
                <Badge
                  value={badgeCount}
                  textStyle={{ color: 'black' }}
                  badgeStyle={{ backgroundColor: '#ebebeb' }}
                  status="warning"
                />
              </Text>
            );
          }}
          indicatorStyle={{ backgroundColor: mainColor }}
          style={{ backgroundColor: 'white' }}
        />
      )}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

const OrdersScreen = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetcher({ route: '/order/getMany' }),
  });

  useRefreshOnFocus(refetch);

  if (error) throw error;
  if (isLoading || !data) return null;

  return (
    <Tabs
      sellNotificationCount={data.sellNotificationCount}
      buyNotificationCount={data.buyNotificationCount}
      renderScene={SceneMap({
        buy: () => (
          <Orders
            orders={data.buyOrders}
            refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
            type="buy"
          />
        ),
        sell: () => (
          <Orders
            orders={data.sellOrders}
            refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
            type="sell"
          />
        ),
      })}
    />
  );
};

export default OrdersScreen;
