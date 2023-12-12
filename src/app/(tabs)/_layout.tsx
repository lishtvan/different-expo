import { Entypo, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Tabs } from 'expo-router';

import Colors from '../../constants/Colors';
import { fetcher } from '../../utils/fetcher';

export default function TabLayout() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  if (isLoading) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        headerTitleAlign: 'center',
      }}>
      <Tabs.Screen
        name="(index)"
        options={{
          headerShown: false,
          title: 'Головна',
          tabBarIcon: ({ color }) => (
            <Entypo size={31} name="home" color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Замовлення',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={35}
              name="truck-delivery-outline"
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Продати',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              size={32}
              name="add-circle-outline"
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Повідомлення',
          tabBarIcon: ({ color }) => (
            <Feather size={32} name="message-circle" color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: {
            pathname: '/profile',
            params: { nickname: user?.nickname || '' },
          },
          title: 'Профіль',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              size={35}
              name="account-circle"
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
