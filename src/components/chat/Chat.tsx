import { Entypo, EvilIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, Link, useSegments } from 'expo-router';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import {
  Bubble,
  Composer,
  Day,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  Time,
} from 'react-native-gifted-chat';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { Avatar, Text } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import { useSession } from '../../hooks/useSession';
import { Message, Participants } from '../../types';
import { avatarFb } from '../../utils/avatarUrlFallback';

const BUBBLE_WRAPPER_RADIUS = 14;
const bubbleWrapperStyle = {
  right: {
    backgroundColor: mainColor,
    borderTopLeftRadius: BUBBLE_WRAPPER_RADIUS,
    borderBottomLeftRadius: BUBBLE_WRAPPER_RADIUS,
    borderBottomRightRadius: BUBBLE_WRAPPER_RADIUS,
    borderTopRightRadius: BUBBLE_WRAPPER_RADIUS,
  },
  left: {
    borderTopLeftRadius: BUBBLE_WRAPPER_RADIUS,
    borderBottomLeftRadius: BUBBLE_WRAPPER_RADIUS,
    borderBottomRightRadius: BUBBLE_WRAPPER_RADIUS,
    borderTopRightRadius: BUBBLE_WRAPPER_RADIUS,
  },
};

const months = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
];

function formatDateToUkrainian(date: Date) {
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

const getFontSizeStyle = (fontSize: number) => {
  return { left: { fontSize }, right: { fontSize } };
};

const Chat = ({ token }: { token: string }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const insets = useSafeAreaInsets();
  const ref = useRef<any>(null);
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [participants, setParticipants] = useState<Participants>();
  const segments = useSegments();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    'ws://localhost:8000/chat/message',
    { share: true, options: { headers: { Cookie: `token=${token}` } } }
  );

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return;
    sendJsonMessage({ chatId, isConnect: true });
  }, [chatId, readyState]);

  useEffect(() => {
    if (!lastMessage.data) return;
    const msg = JSON.parse(lastMessage.data);
    if (msg.chat) {
      setMessages(
        msg.chat.Messages.map((m: Message) => ({
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.createdAt),
          user: {
            _id: m.senderId,
          },
        }))
      );
      setParticipants(msg.chat.Users);
    }
    if (msg.text) {
      setMessages([
        {
          _id: msg.id,
          text: msg.text,
          createdAt: new Date(msg.createdAt),
          user: { _id: msg.senderId },
        },
        ...messages,
      ]);
    }
  }, [lastMessage]);

  const onSend = useCallback((messages: IMessage[] = []) => {
    const { text } = messages[0];
    sendJsonMessage({ text, chatId });
    if (ref.current) {
      ref.current._listRef._scrollRef.scrollTo({ y: 0, animated: true });
    }
  }, []);

  const userLink =
    `/${segments[1]}/user/${participants?.recipient.nickname}` as `${string}:${string}`;

  return (
    <SafeAreaView
      style={{ paddingBottom: 0 }}
      edges={['right', 'left', 'bottom']}
      className="flex-1">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Link asChild href={userLink}>
              <TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                  {participants?.recipient.nickname}
                </Text>
              </TouchableOpacity>
            </Link>
          ),
          headerRight: () => (
            <Link asChild href={userLink}>
              <TouchableOpacity className="pb-2 pl-4">
                <Avatar circular size="$3.5">
                  <Avatar.Image src={avatarFb(participants?.recipient.avatarUrl)} />
                </Avatar>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GiftedChat
          forceGetKeyboardHeight={false}
          scrollToBottomComponent={() => <Entypo size={23} name="chevron-thin-down" />}
          scrollToBottom
          scrollToBottomStyle={{ backgroundColor: '#eeefe9' }}
          messages={messages}
          timeTextStyle={getFontSizeStyle(11)}
          renderBubble={(props) => (
            <Bubble textStyle={getFontSizeStyle(18)} wrapperStyle={bubbleWrapperStyle} {...props} />
          )}
          renderTime={(props) => (
            <Time
              timeFormat={(props.currentMessage?.createdAt as Date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {...props}
            />
          )}
          bottomOffset={insets.bottom - 10}
          renderDay={(props) => (
            <Day
              dateFormat={formatDateToUkrainian(props.currentMessage?.createdAt as Date)}
              {...props}
            />
          )}
          messageContainerRef={ref}
          placeholder="Напишіть повідомлення..."
          onSend={(messages) => onSend(messages)}
          renderAvatar={null}
          maxInputLength={800}
          renderComposer={(props) => (
            <Composer
              {...props}
              textInputStyle={{
                paddingTop: 8.5,
                paddingHorizontal: 12,
                marginLeft: 0,
              }}
            />
          )}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              renderSend={(props) => (
                <Send
                  {...props}
                  containerStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0,
                  }}>
                  <EvilIcons name="arrow-up" size={40} />
                </Send>
              )}
              primaryStyle={{
                borderColor: '#E8E8E8',
                borderWidth: 2,
                marginHorizontal: 10,
                borderRadius: 20,
              }}
              containerStyle={{
                paddingTop: 1,
                borderTopWidth: 0,
              }}
            />
          )}
          user={{ _id: participants?.sender.id || 0 }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ChatScreen = () => {
  const token = useSession();
  if (!token) return;

  return <Chat token={token} />;
};

export default ChatScreen;
