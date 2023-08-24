import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "../../constants/Colors";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
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
          title: "Профіль",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              size={34}
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
