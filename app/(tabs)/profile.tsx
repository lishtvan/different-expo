import React from "react";
import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";

export default function ProfileScreen() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetcher({ route: "/auth/check", method: "GET" }),
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>profile</Text>
    </View>
  );
}
