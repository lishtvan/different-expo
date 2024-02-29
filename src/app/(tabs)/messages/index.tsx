import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text, View } from 'tamagui';

import { fetcher } from '../../../utils/fetcher';

export default function MessagesScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => fetcher({ route: '/chat/getMany' }),
  });
  if (isLoading || !data) return null;

  const { chats } = data;

  return (
    <ScrollView className="p-7">
      <Link
        href={{
          pathname: '/rchat',
          params: { chatId: chats[0].id },
        }}>
        <View className="flex-row gap-x-2">
          <Image
            source={chats[0].Users[0].avatarUrl}
            className="w-12 h-12 rounded-full"
            alt="avatar"
          />
          <Text className="text-xl">{chats[0].Users[0].nickname}</Text>
        </View>
      </Link>
      <Link
        href={{
          pathname: '/messages/chat',
          params: { chatId: chats[0].id },
        }}>
        <View className="flex-row gap-x-2">
          <Image
            source={chats[0].Users[0].avatarUrl}
            className="w-12 h-12 rounded-full"
            alt="avatar"
          />
          <Text className="text-xl">{chats[0].Users[0].nickname}</Text>
        </View>
      </Link>
    </ScrollView>
  );
}
