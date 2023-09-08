import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center mb-20">
      <Text>Home</Text>
      <Link href="/auth">Auth</Link>
    </SafeAreaView>
  );
};

export default HomeScreen;
