import { Link } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center mb-20 ">
      <Text>Home</Text>
      <Link href={"/listing/1"}>go to listing</Link>
      <Link href={"/listing/2"}>go to listing</Link>
    </SafeAreaView>
  );
};

export default HomeScreen;
