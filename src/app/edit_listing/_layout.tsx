import { AntDesign } from '@expo/vector-icons';
import { toastConfig } from 'components/ui/toastConfig';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Circle } from 'tamagui';

export const unstable_settings = { initialRouteName: 'index' };

export default function EditListingLayoutNav() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          animation: 'simple_push',
          headerTitleAlign: 'center',
          fullScreenGestureEnabled: true,
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
        <Stack.Screen
          name="select_category_and_size"
          options={{
            headerBackTitleVisible: false,
            headerTitle: 'Оберіть категорію та розмір',
          }}
        />
      </Stack>
      <Toast topOffset={0} config={toastConfig} />
    </>
  );
}
