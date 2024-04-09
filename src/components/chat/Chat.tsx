import { Entypo, EvilIcons, SimpleLineIcons } from '@expo/vector-icons';
import { WS_URL } from 'config';
import { mainColor } from 'constants/colors';
import { Stack, useLocalSearchParams, Link, useSegments } from 'expo-router';
import { useSession } from 'hooks/useSession';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import {
  Bubble,
  Composer,
  Day,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { Avatar, Spinner } from 'tamagui';
import { Message, Participants } from 'types';
import { avatarFb } from 'utils/avatarUrlFallback';
import { formatDateToUkrainian } from 'utils/date';
import { isAndroid } from 'utils/platform';

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

const { containerStyle } = StyleSheet.create({
  containerStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
});
const { textStyle } = StyleSheet.create({
  textStyle: {
    fontSize: 10,
    textAlign: 'right',
  },
});

const styles = {
  left: StyleSheet.create({
    container: { ...containerStyle },
    text: { color: '#8c8c91', ...textStyle },
  }),
  right: StyleSheet.create({
    container: { ...containerStyle },
    text: { color: 'white', ...textStyle },
  }),
};

const getFontSizeStyle = (fontSize: number) => {
  return { left: { fontSize }, right: { fontSize } };
};

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const insets = useSafeAreaInsets();
  const ref = useRef<any>(null);
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [participants, setParticipants] = useState<Participants>();
  const segments = useSegments();

  const session = useSession();

  const {
    sendJsonMessage,
    lastJsonMessage: msg,
    readyState,
  } = useWebSocket(`${WS_URL}/chat/message`, {
    share: true,
    options: { headers: { Cookie: `token=${session}` } },
  });

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return;
    sendJsonMessage({ chatId, enterChat: true });
  }, [chatId, readyState]);

  useEffect(() => {
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
      if (msg.senderId !== participants?.sender.id) {
        sendJsonMessage({ messageSeen: true, chatId });
      }
    }
  }, [msg]);

  const onSend = useCallback((messages: IMessage[] = []) => {
    const { text } = messages[0];
    sendJsonMessage({ text, chatId });
    if (ref.current) {
      ref.current._listRef._scrollRef.scrollTo({ y: 0, animated: true });
    }
  }, []);

  const userLink =
    `/${segments[1]}/user/${participants?.recipient.nickname}` as `${string}:${string}`;

  const headerClassname = isAndroid ? 'pl-4' : 'pb-2 pl-4';

  if (!participants) {
    return (
      <View className="flex-1 justify-center items-center">
        <Spinner size="large" />
      </View>
    );
  }

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
                  {participants.recipient.nickname}
                </Text>
              </TouchableOpacity>
            </Link>
          ),
          headerRight: () => (
            <Link asChild href={userLink}>
              <TouchableOpacity className={headerClassname}>
                <Avatar circular size="$3.5">
                  <Avatar.Image src={avatarFb(participants.recipient.avatarUrl)} />
                </Avatar>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <KeyboardAvoidingView style={{ flex: 1, paddingBottom: isAndroid ? 10 : 0 }}>
        <GiftedChat
          forceGetKeyboardHeight={false}
          scrollToBottomComponent={() => <Entypo size={23} name="chevron-thin-down" />}
          scrollToBottom
          scrollToBottomStyle={{ backgroundColor: '#eeefe9' }}
          messages={messages}
          keyboardShouldPersistTaps={isAndroid ? 'never' : 'handled'}
          timeTextStyle={getFontSizeStyle(11)}
          renderBubble={(props) => (
            <Bubble textStyle={getFontSizeStyle(18)} wrapperStyle={bubbleWrapperStyle} {...props} />
          )}
          renderTime={(props) => {
            return (
              <View style={styles[props.position!].container}>
                <Text style={styles[props.position!].text}>
                  {(props.currentMessage?.createdAt as Date).toLocaleTimeString('uk-UA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            );
          }}
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
                paddingTop: isAndroid ? 4 : 8.5,
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
                    marginRight: isAndroid ? 7 : 0,
                  }}>
                  {isAndroid ? (
                    <SimpleLineIcons name="arrow-up-circle" size={30} />
                  ) : (
                    <EvilIcons name="arrow-up" size={40} />
                  )}
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
          user={{ _id: participants.sender.id || 0 }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
