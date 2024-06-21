import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'tamagui';
import { fetcher } from 'utils/fetcher';
import { isAndroid } from 'utils/platform';
import { saveSession } from 'utils/secureStorage';

const AuthScreen = () => {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const signInMutation = useMutation({
    mutationFn: (mutationParams: {
      route: '/auth/google/mobile' | '/auth/apple';
      accessToken: string;
    }) =>
      fetcher({
        route: mutationParams.route,
        method: 'POST',
        body: { accessToken: mutationParams.accessToken },
      }),
    onSuccess: async ({ token }) => {
      await saveSession(token);
      await queryClient.invalidateQueries({ queryKey: ['auth_me'] });
      await queryClient.invalidateQueries({ queryKey: ['notications'] });

      if (params.listingId) {
        await queryClient.invalidateQueries({ queryKey: ['listing', params.listingId] });
      }
      router.back();
    },
  });

  const signInWithGoogle = async () => {
    GoogleSignin.configure({
      iosClientId: '24434242390-l4r82unf87hh643nmssogggm3grvqcvq.apps.googleusercontent.com',
    });
    const hasPlayService = await GoogleSignin.hasPlayServices();
    if (!hasPlayService) return;
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) await GoogleSignin.signOut();
    try {
      await GoogleSignin.signIn();
    } catch (e) {
      console.log(e);
      return;
    }
    const { accessToken } = await GoogleSignin.getTokens();
    signInMutation.mutate({ accessToken, route: '/auth/google/mobile' });
  };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      if (!credential.identityToken) return;
      signInMutation.mutate({ accessToken: credential.identityToken, route: '/auth/apple' });
    } catch (e) {
      console.log(e);
    }
  };
  if (signInMutation.error) throw signInMutation.error;

  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="flex-1 items-center justify-around">
        <View className="items-center">
          <Image
            style={{ width: 250, height: 50 }}
            source={require('../../assets/images/logo.jpeg')}
          />
          <View className="my-10 px-4">
            <Text className="text-xl font-medium">
              Увійдіть, щоб створити оголошення або придбати те, що вам потрібно.
            </Text>
          </View>
        </View>
        <View className="gap-y-3.5">
          {!isAndroid && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={10}
              className="h-10"
              onPress={signInWithApple}
            />
          )}
          <GoogleSigninButton
            onPress={signInWithGoogle}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
          />
        </View>
      </View>
      <View className="px-2.5 pb-5">
        <Text>
          Продовжуючи, ви погоджуєтесь з нашою{'\n'}
          <Text
            onPress={() =>
              WebBrowser.openBrowserAsync(
                `https://different-marketplace.notion.site/6518326323454c0cb934574e5fe59420`
              )
            }
            pressStyle={{ opacity: 0.5 }}
            className="text-blue-500">
            політикою конфіденційності{' '}
          </Text>
          та{' '}
          <Text
            onPress={() =>
              WebBrowser.openBrowserAsync(
                `https://different-marketplace.notion.site/5ff3aa4eeefa4e1886ed4cafe087517e`
              )
            }
            pressStyle={{ opacity: 0.5 }}
            className="text-blue-500">
            умовами використання.
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
