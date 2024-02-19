import { AntDesign } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Circle } from 'tamagui';

export const unstable_settings = { initialRouteName: 'index' };

export default function SellLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'simple_push',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Circle backgroundColor="#e1e1e1" size="$2">
                  <AntDesign size={18} name="close" />
                </Circle>
              </TouchableOpacity>
            );
          },
          headerTitle: 'Редагувати оголошення',
        }}
      />
      <Stack.Screen
        name="designer_search"
        options={{
          headerBackTitleVisible: false,
          headerTitle: 'Оберіть дизайнера',
        }}
      />
    </Stack>
  );
}
