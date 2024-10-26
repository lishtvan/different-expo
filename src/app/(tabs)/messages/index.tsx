import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useRefresh } from 'hooks/useRefresh';
import { useRefreshOnFocus } from 'hooks/useRefreshOnFocus';
import { RefreshControl } from 'react-native';
import { Avatar, Text, View } from 'tamagui';
import { Chat } from 'types';
import { avatarFb } from 'utils/avatarUrlFallback';
import { getLastMsgDate } from 'utils/date';
import { fetcher } from 'utils/fetcher';

interface GetChatsResponse {
  chats: Chat[];
  userId: number;
}

const RenderChat = ({ item }: { item: Chat }) => {
  const user = item.Users[0];
  const message = item.Messages[0];
  const notificationsCount = item._count.ChatNotification;
  return (
    <Link asChild href={{ pathname: '/chatf', params: { chatId: item.id } }}>
      <View pressStyle={{ backgroundColor: '#f1f1f1' }} className="flex-row items-center">
        <View className="px-3 py-2">
          <Avatar circular size={57}>
            <Avatar.Image src={avatarFb(user.avatarUrl)} />
          </Avatar>
        </View>
        <View className="h-20 w-full flex-1 justify-center border-b border-gray-200">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-base font-medium">{user.nickname}</Text>
            <Text className="mr-2 text-xs text-gray-600">
              {getLastMsgDate(new Date(message.createdAt))}
            </Text>
          </View>
          {notificationsCount > 0 ? (
            <View className="flex-row items-center justify-between">
              <Text numberOfLines={2} className="w-[85%]">
                {message.text}
              </Text>
              <View className="mr-1.5 rounded-full bg-main px-2">
                <Text className="text-base text-white">{notificationsCount}</Text>
              </View>
            </View>
          ) : (
            <Text numberOfLines={2} className="pr-3">
              {message.text}
            </Text>
          )}
        </View>
      </View>
    </Link>
  );
};

export default function MessagesScreen() {
  const { data, isLoading, refetch, error } = useQuery<GetChatsResponse>({
    queryKey: ['chats'],
    queryFn: () => fetcher({ route: '/chat/getMany' }),
  });
  const { refreshing, handleRefresh } = useRefresh(refetch);

  useRefreshOnFocus(refetch);

  if (error) throw error;
  if (isLoading || !data) return null;

  const { chats } = data;

  if (!chats.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="rounded-3xl bg-[#ebebeb] px-4 py-1.5">
          <Text className="text-lg ">Повідомлення відсутні</Text>
        </View>
      </View>
    );
  }

  return (
    <FlashList
      data={chats}
      estimatedItemSize={80}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      contentContainerStyle={{ paddingTop: 12, paddingBottom: 90 }}
      renderItem={RenderChat}
      keyExtractor={(item) => item.id}
    />
  );
}
