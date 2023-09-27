import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button, Text, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { fetcher } from "./utils/fetcher";
import { saveSession } from "./utils/secureStorage";
import { Link, router } from "expo-router";

const AuthScreen = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (accessToken: string) =>
      fetcher({
        route: "/auth/google/mobile",
        method: "POST",
        body: { accessToken },
      }),
    onSuccess: async ({ token }) => {
      await saveSession(token);
      await queryClient.invalidateQueries({ queryKey: ["auth_check"] });
      router.replace("/");
    },
  });

  const signIn = async () => {
    GoogleSignin.configure({
      iosClientId:
        "24434242390-l4r82unf87hh643nmssogggm3grvqcvq.apps.googleusercontent.com",
    });
    const hasPlayService = await GoogleSignin.hasPlayServices();
    if (!hasPlayService) return;
    await GoogleSignin.signIn();
    const { accessToken } = await GoogleSignin.getTokens();
    mutation.mutate(accessToken);
  };

  return (
    <View className="flex-1 justify-center items-center mb-20">
      <Text>Auth</Text>
      <Button title={"Sign in with Google"} onPress={signIn} />
      <Link href="/" replace>
        <Text className="text-main">Повернутись на головну сторінку</Text>
      </Link>
    </View>
  );
};

export default AuthScreen;
