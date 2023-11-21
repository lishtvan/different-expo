import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, View, Text } from 'tamagui';

import { mainColor } from '../../tamagui.config';
import { fetcher } from '../utils/fetcher';
import { saveSession } from '../utils/secureStorage';

const AuthScreen = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (accessToken: string) =>
      fetcher({
        route: '/auth/google/mobile',
        method: 'POST',
        body: { accessToken },
      }),
    onSuccess: async ({ token }) => {
      await saveSession(token);
      await queryClient.invalidateQueries({ queryKey: ['auth_check'] });
      router.replace('/');
    },
  });

  const signIn = async () => {
    GoogleSignin.configure({
      iosClientId: '24434242390-l4r82unf87hh643nmssogggm3grvqcvq.apps.googleusercontent.com',
    });
    const hasPlayService = await GoogleSignin.hasPlayServices();
    if (!hasPlayService) return;
    await GoogleSignin.signIn();
    const { accessToken } = await GoogleSignin.getTokens();
    mutation.mutate(accessToken);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-between ">
      <View className="flex-1 items-center justify-around">
        <View className="items-center">
          <Image
            style={{ width: 250, height: 50 }}
            source={require('../../assets/images/logo.jpeg')}
          />
          <View className=" px-4 my-10">
            <Text className="text-xl font-medium">
              Увійдіть, щоб створити оголошення або придбати те, що вам потрібно.
            </Text>
          </View>
        </View>
        <Button
          onPress={signIn}
          size="$4"
          icon={
            <Image
              style={{ width: 30, height: 30 }}
              source={require('../../assets/images/google.jpeg')}
            />
          }
          pressStyle={{ backgroundColor: 'white', borderColor: mainColor }}
          className="w-full border border-black bg-white justify-start"
          borderRadius="$main">
          <Text fontSize="$7">Увійти за допомогою Google</Text>
        </Button>
      </View>
      <Link className="mb-10" href="/" replace>
        <Text className="text-blue-500  text-base">Повернутись на головну сторінку</Text>
      </Link>
    </SafeAreaView>
  );
};

export default AuthScreen;
