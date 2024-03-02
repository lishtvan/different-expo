import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { RefreshControl } from 'react-native';
import { Avatar, Text, View } from 'tamagui';

import { useRefresh } from '../../../hooks/useRefresh';
import { Chat } from '../../../types';
import { avatarFb } from '../../../utils/avatarUrlFallback';
import { getLastMsgDate } from '../../../utils/date';
import { fetcher } from '../../../utils/fetcher';

interface GetChatsResponse {
  chats: Chat[];
  userId: number;
}

const RenderChat = ({ item }: { item: Chat }) => {
  return (
    <Link asChild href={{ pathname: '/messages/chat', params: { chatId: item.id } }}>
      <View pressStyle={{ backgroundColor: '#f1f1f1' }} className="flex-row items-center">
        <View className="px-3 py-2">
          <Avatar circular size={57}>
            <Avatar.Image src={avatarFb(item.Users[0].avatarUrl)} />
          </Avatar>
        </View>
        <View className="w-full flex-1 h-20 border-b justify-center border-gray-200">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-base font-medium">{item.Users[0].nickname}</Text>
            <Text className="mr-2 text-xs text-gray-600">
              {getLastMsgDate(new Date(item.Messages[0].createdAt))}
            </Text>
          </View>
          <Text numberOfLines={2} className="pr-3">
            {item.Messages[0].text}
          </Text>
        </View>
      </View>
    </Link>
  );
};

export default function MessagesScreen() {
  const { data, isLoading, refetch } = useQuery<GetChatsResponse>({
    queryKey: ['chats'],
    queryFn: () => fetcher({ route: '/chat/getMany' }),
  });
  const { refreshing, handleRefresh } = useRefresh(refetch);

  if (isLoading || !data) return null;

  const { chats } = data;

  // TODO: implement epty messages screen
  if (!chats.length) return null;

  return (
    <FlashList
      data={chats}
      estimatedItemSize={80}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      contentContainerStyle={{ paddingTop: 12 }}
      renderItem={RenderChat}
      keyExtractor={(item) => item.id}
    />
  );
}
