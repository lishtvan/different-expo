import { Entypo } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router, useNavigation } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { openConfirmationModal } from 'utils/confirmationModal';
import { fetcher } from 'utils/fetcher';
import { destroySession } from 'utils/secureStorage';

const SignOut = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const mutation = useMutation({
    mutationFn: () => fetcher({ route: '/auth/logout', method: 'POST' }),
    onSuccess: async () => {
      await Promise.all([
        destroySession(),
        queryClient.invalidateQueries({ queryKey: ['auth_me'] }),
      ]);
      navigation.dispatch(CommonActions.reset({ routes: [{ key: '(tabs)', name: '(tabs)' }] }));
      router.navigate('/');
    },
  });

  return (
    <TouchableOpacity
      className="rounded-2xl bg-card p-3"
      onPress={() => openConfirmationModal('Ви впевнені, що хочете вийти?', mutation.mutate)}>
      <Text className="text-center text-lg text-blue-500">Вийти з аккаунта</Text>
    </TouchableOpacity>
  );
};

const DeleteAccount = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const mutation = useMutation({
    mutationFn: () => fetcher({ route: '/user/delete', method: 'POST' }),
    onSuccess: async (res) => {
      if (res.errors) {
        Toast.show({
          props: { height: 70, paddingHorizontal: 20 },
          type: 'error',
          text1: res.errors.message,
        });
        return;
      }
      await Promise.all([
        destroySession(),
        queryClient.invalidateQueries({ queryKey: ['auth_me'] }),
      ]);
      navigation.dispatch(CommonActions.reset({ routes: [{ key: '(tabs)', name: '(tabs)' }] }));
      router.navigate('/');
    },
  });

  return (
    <TouchableOpacity
      className="mt-2 rounded-2xl bg-card p-3 "
      onPress={() =>
        openConfirmationModal('Ви впевнені, що хочете видалити аккаунт?', mutation.mutate)
      }>
      <Text className="text-center text-lg text-red-500">Видалити аккаунт</Text>
    </TouchableOpacity>
  );
};

const Resources = () => {
  return (
    <View className="flex-1 p-3">
      <View className="flex-1 flex-col gap-y-2 ">
        <Text className="text-lg font-semibold">Допомога</Text>
        <View className="mb-2">
          <Text className="text-base">
            Ви можете зв'язатися з нами якщо у вас є будь які проблеми, питання чи пропозиції.
          </Text>
          <TouchableOpacity className="mt-1 flex-row items-center" onPress={() => {}}>
            <Text className="text-base">Telegram: </Text>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync(`https://t.me/DifferentMarketplace`)}>
              <Text className="text-base text-blue-500">@DifferentMarketplace</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <View className="mt-1 flex-row items-center">
            {/* TODO: test it on iphone 5s, test email opening */}
            <Text className="text-base">Email: </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:hello.different.marketplace@gmail.com')}>
              <Text className="text-base text-blue-500">hello.different.marketplace@gmail.com</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            WebBrowser.openBrowserAsync(
              `https://different-marketplace.notion.site/6518326323454c0cb934574e5fe59420`
            )
          }
          className="flex-row items-center justify-between">
          <Text className="text-lg">Політика конфіденційності</Text>
          <Entypo name="chevron-thin-right" size={15} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between">
          <Text
            onPress={() =>
              WebBrowser.openBrowserAsync(
                `https://different-marketplace.notion.site/5ff3aa4eeefa4e1886ed4cafe087517e`
              )
            }
            className="text-lg">
            Умови використання
          </Text>
          <Entypo name="chevron-thin-right" size={15} />
        </TouchableOpacity>
      </View>

      <View>
        <SignOut />
        <DeleteAccount />
      </View>
    </View>
  );
};

export default Resources;
