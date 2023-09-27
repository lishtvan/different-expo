import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import User from "../components/user/User";

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  if (!params?.nickname) {
    return <Redirect href="/auth" />;
  }
  return <User />;
}
