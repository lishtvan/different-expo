import { Entypo, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { EventArg } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Tabs, router } from 'expo-router';

import Colors from '../../constants/Colors';
import { fetcher } from '../../utils/fetcher';

export default function TabLayout() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });
  const onAuthTabPress = (e: EventArg<'tabPress', true, undefined>) => {
    if (user) return;
    e.preventDefault();
    router.navigate('/auth');
  };

  if (isLoading) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        headerShadowVisible: false,
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
        listeners={{ tabPress: onAuthTabPress }}
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
        listeners={{ tabPress: onAuthTabPress }}
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
        listeners={{ tabPress: onAuthTabPress }}
        options={{
          title: 'Повідомлення',
          tabBarIcon: ({ color }) => (
            <Feather size={32} name="message-circle" color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        listeners={{ tabPress: onAuthTabPress }}
        options={{
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
