import { Entypo } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect } from 'react';
import { Bubble, Day, GiftedChat, IMessage, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'tamagui';

import { mainColor } from '../../tamagui.config';

const msgs = Array.from({ length: 20 }, (_, index) => ({
  _id: index + 1,
  text: 'Hello developer',
  createdAt: new Date(),
  user: {
    _id: 2,
  },
}));

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

export default function MessagesScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setMessages(msgs);
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  return (
    <SafeAreaView
      style={{ paddingBottom: 0 }}
      edges={['right', 'left', 'bottom']}
      className="flex-1">
      <View className="flex-1">
        <GiftedChat
          scrollToBottomComponent={() => <Entypo size={23} name="chevron-thin-down" />}
          scrollToBottom
          scrollToBottomStyle={{ backgroundColor: '#eeefe9' }}
          messages={messages}
          renderBubble={(props) => <Bubble wrapperStyle={bubbleWrapperStyle} {...props} />}
          bottomOffset={insets.bottom}
          renderDay={(props) => <Day {...props} />}
          placeholder="Напишіть повідомлення..."
          onSend={(messages) => onSend(messages)}
          renderAvatar={null}
          isKeyboardInternallyHandled
          renderInputToolbar={(props) => <InputToolbar {...props} />}
          user={{ _id: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}
