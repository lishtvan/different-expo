import { useQuery } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { fetcher } from 'utils/fetcher';

export const unstable_settings = { initialRouteName: 'index' };

export default function ProfileLayoutNav() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  if (error) throw error;
  if (isLoading) return null;

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        fullScreenGestureEnabled: true,
      }}>
      <Stack.Screen
        initialParams={{ nickname: user?.nickname }}
        name="index"
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="listing/[listingId]"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-base">Скасувати</Text>
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="resources"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
