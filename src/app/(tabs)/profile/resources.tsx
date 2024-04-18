import { Entypo } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router, useNavigation } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
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

  const openConfirmationModal = () => {
    Alert.alert('Ви впевнені, що хочете вийти?', '', [
      { text: 'Ні', onPress: () => {}, style: 'cancel' },
      { text: 'Так', onPress: () => mutation.mutate() },
    ]);
  };

  return (
    <TouchableOpacity onPress={openConfirmationModal}>
      <Text className="mt-10 text-lg text-blue-500">Вийти з аккаунта</Text>
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

  const openConfirmationModal = () => {
    Alert.alert('Ви впевнені, що хочете видалити аккаунт?', '', [
      { text: 'Ні', onPress: () => {}, style: 'cancel' },
      { text: 'Так', onPress: () => mutation.mutate() },
    ]);
  };

  return (
    <TouchableOpacity onPress={openConfirmationModal}>
      <Text className="mt-2 text-lg text-red-500">Видалити аккаунт</Text>
    </TouchableOpacity>
  );
};

const Resources = () => {
  return (
    <View className="p-3 gap-y-2">
      <Text className="text-lg font-semibold">Допомога</Text>
      <View className="mb-2">
        <Text className="text-base">
          Ви можете зв'язатися з нами якщо у вас є будь які проблеми, питання чи пропозиції.
        </Text>
        <TouchableOpacity className="flex-row items-center mt-1" onPress={() => {}}>
          <Text className="text-base">Telegram: </Text>
          <TouchableOpacity
            onPress={() => WebBrowser.openBrowserAsync(`https://t.me/DifferentMarketplace`)}>
            <Text className="text-base text-blue-500">@DifferentMarketplace</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <View className="flex-row items-center mt-1">
          {/* TODO: test it on iphone 5s, test email opening */}
          <Text className="text-base">Email: </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:hello.different.marketplace@gmail.com')}>
            <Text className="text-base text-blue-500">hello.different.marketplace@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity className="flex-row justify-between items-center">
        <Text className="text-lg">Політика конфіденційності</Text>
        <Entypo name="chevron-thin-right" size={15} />
      </TouchableOpacity>
      <TouchableOpacity className="flex-row justify-between items-center">
        <Text className="text-lg">Умови використання</Text>
        <Entypo name="chevron-thin-right" size={15} />
      </TouchableOpacity>
      <View>
        <SignOut />
        <DeleteAccount />
      </View>
    </View>
  );
};

export default Resources;
