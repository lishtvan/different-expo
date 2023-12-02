import { ThemeProvider } from '@react-navigation/native';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { useEffect } from 'react';
import '../../global.css';
import { AppStateStatus, Platform, TouchableOpacity } from 'react-native';
import { TamaguiProvider, Text, Theme } from 'tamagui';

import tamaguiConfig, { mainColor } from '../../tamagui.config';
import { useAppState } from '../hooks/useAppState';
import { useOnlineManager } from '../hooks/useOnlineManager';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const erorrActions = {
  404: () => router.replace('/404'),
  500: () => router.replace('/500'),
  401: () => router.replace('/auth'),
};

const globalErrorHandler = (err: unknown) => {
  if (err instanceof Error) {
    const errAction = erorrActions[err.cause as keyof typeof erorrActions];
    if (errAction) errAction();
    else throw err;
  }
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: globalErrorHandler }),
  mutationCache: new MutationCache({ onError: globalErrorHandler }),
  defaultOptions: { queries: { retry: false } },
});

function RootLayoutNav() {
  useOnlineManager();

  useAppState(onAppStateChange);

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <Theme name="light">
          <ThemeProvider
            value={{
              dark: false,
              colors: {
                primary: mainColor,
                background: 'white',
                card: 'rgb(255, 255, 255)',
                text: 'rgb(28, 28, 30)',
                border: 'rgb(216, 216, 216)',
                notification: 'rgb(255, 59, 48)',
              },
            }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="auth"
                options={{
                  headerTitle: '',
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="listing/[listingId]"
                options={{
                  headerTitle: '',
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  presentation: 'fullScreenModal',
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                      <Text className="text-base">Скасувати</Text>
                    </TouchableOpacity>
                  ),
                  headerTitle: '',
                  headerShadowVisible: false,
                }}
              />
            </Stack>
          </ThemeProvider>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
