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
import { AppStateStatus, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { TamaguiProvider, Theme } from 'tamagui';

import tamaguiConfig, { mainColor } from '../../tamagui.config';
import { toastConfig } from '../components/ui/ToastConfig';
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

interface ErrActions {
  [key: string]: (() => void) | undefined;
}

const erorrActions: ErrActions = {
  404: () => router.replace('/404'),
  500: () => router.replace('/500'),
  401: () => router.replace('/auth'),
};

const globalErrorHandler = (err: Error) => {
  const errAction = erorrActions[err.cause as string];
  if (errAction) errAction();
  else throw err;
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
            </Stack>
            <Toast config={toastConfig} />
          </ThemeProvider>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
