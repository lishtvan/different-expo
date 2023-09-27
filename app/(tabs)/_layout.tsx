import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "../../constants/Colors";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { fetcher } from "../utils/fetcher";
import { useQuery } from "@tanstack/react-query";

export default function TabLayout() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth_check"],
    queryFn: () => fetcher({ route: "/auth/check", method: "GET" }),
  });

  if (isLoading) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Головна",
          tabBarIcon: ({ color }) => (
            <Entypo
              size={31}
              name="home"
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: "Продати",
          headerTitle: "Створіть нове оголошення",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              size={32}
              name="add-circle-outline"
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Замовлення",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={31}
              name="handshake-o"
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Повідомлення",
          tabBarIcon: ({ color }) => (
            <Feather
              size={32}
              name="message-circle"
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: {
            pathname: "/profile",
            params: { nickname: user?.nickname || "" },
          },
          title: "Профіль",
          headerTitle: user?.nickname || "",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 19,
          },
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              size={35}
              name="account-circle"
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
