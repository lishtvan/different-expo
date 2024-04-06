import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { EventArg } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { WS_URL } from 'config';
import Colors from 'constants/colors';
import { Tabs, router, usePathname } from 'expo-router';
import { useSession } from 'hooks/useSession';
import { useEffect, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { fetcher } from 'utils/fetcher';

const WebsocketConnection = ({ refetch, session }: { refetch: () => void; session: string }) => {
  const { sendJsonMessage, readyState } = useWebSocket(`${WS_URL}/chat/message`, {
    share: true,
    onMessage: () => {
      refetch();
    },
    options: { headers: { Cookie: `token=${session}` } },
  });

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return;
    sendJsonMessage({ connect: true });
  }, [readyState]);

  return null;
};

export default function TabLayout() {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  const session = useSession();

  const onAuthTabPress = (e: EventArg<'tabPress', true, undefined>) => {
    if (user) return;
    e.preventDefault();
    router.navigate('/auth');
  };

  const path = usePathname();
  const hideTabBar = useMemo(
    () => path.includes('chat') || path.includes('/messages/user'),
    [path]
  );

  if (isLoading) return null;

  return (
    <>
      {session && user && <WebsocketConnection session={session} refetch={refetch} />}
      <Tabs
        screenOptions={{
          tabBarStyle: { display: hideTabBar ? 'none' : 'flex' },
          tabBarActiveTintColor: Colors['light'].tint,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          tabBarHideOnKeyboard: true,
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
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                size={36}
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
              <Ionicons
                size={35}
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
            tabBarBadge: user?.chatNotificationCount || undefined,
            headerShown: false,
            title: 'Повідомлення',
            tabBarIcon: ({ color }) => (
              <Feather size={33} name="message-circle" color={color} style={{ marginBottom: -3 }} />
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
    </>
  );
}
