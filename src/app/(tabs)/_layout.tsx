import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { EventArg } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { WS_URL } from 'config/config';
import Colors from 'constants/colors';
import { Tabs, router } from 'expo-router';
import { useSession } from 'hooks/useSession';
import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { fetcher } from 'utils/fetcher';
import { registerForPushNotificationsAsync } from 'utils/notifications';

export { ErrorBoundary } from 'components/errors/ErrorBoundary';

const WebsocketConnection = ({ refetch, userId }: { refetch: () => void; userId: string }) => {
  const session = useSession();

  const { sendJsonMessage, readyState } = useWebSocket(`${WS_URL}/chat/message`, {
    share: true,
    shouldReconnect: () => true,
    onMessage: (msg) => {
      if (!msg.data) return;
      const jsonMsg = JSON.parse(msg.data);
      if (jsonMsg.text && jsonMsg.senderId === userId) return;
      refetch();
    },
    options: { headers: { Cookie: `token=${session}` } },
  });

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return;
    sendJsonMessage({ connect: true });
  }, [readyState, sendJsonMessage]);

  return null;
};

export default function TabLayout() {
  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  useQuery({
    queryKey: ['notications'],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: () => registerForPushNotificationsAsync({ shouldOpenModalIfNotGranted: false }),
  });

  const onAuthTabPress = (e: EventArg<'tabPress', true, undefined>) => {
    if (user) return;
    e.preventDefault();
    router.navigate('/auth');
  };

  if (error) throw error;
  if (isLoading) return null;

  return (
    <>
      {user && <WebsocketConnection refetch={refetch} userId={user.id} />}
      <Tabs
        screenOptions={{
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
            tabBarBadge: user?._count.OrderNotification || undefined,
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
            tabBarBadge: user?._count.ChatNotification || undefined,
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
