import { useFonts } from "expo-font";
import { SplashScreen, Stack, router } from "expo-router";
import { useEffect } from "react";
import "../../global.css";
import { AppStateStatus, Platform } from "react-native";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { TamaguiProvider, Theme } from "tamagui";
import { useOnlineManager } from "../hooks/useOnlineManager";
import { useAppState } from "../hooks/useAppState";
import tamaguiConfig from "../../tamagui.config";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = { initialRouteName: "(tabs)" };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
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
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof Error) {
        if (err.cause === 404) router.replace("/404");
        if (err.cause === 500) router.replace("/500");
        if (err.cause === 401) router.replace("/auth");
      }
    },
  }),
  defaultOptions: { queries: { retry: false } },
});

function RootLayoutNav() {
  useOnlineManager();

  useAppState(onAppStateChange);

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <Theme name={"light"}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="auth"
              options={{
                headerTitle: "",
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="listing/[listingId]"
              options={{
                headerTitle: "",
                headerShadowVisible: false,
              }}
            />
          </Stack>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
