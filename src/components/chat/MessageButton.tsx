import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Button, ButtonProps } from 'tamagui';

import { fetcher } from '../../utils/fetcher';

interface MessageButtonProps extends ButtonProps {
  recipientId: number;
  pathname: string;
}

const MessageButton = (props: MessageButtonProps) => {
  const createChatMutation = useMutation({
    mutationFn: () =>
      fetcher({
        route: '/chat/create',
        method: 'POST',
        body: { recipientId: props.recipientId },
      }),
    onSuccess: (res) => {
      router.navigate({
        pathname: props.pathname,
        params: { chatId: res.chatId },
      });
    },
  });

  return (
    <Button {...props} onPress={() => createChatMutation.mutate()}>
      {props.children}
    </Button>
  );
};

export default MessageButton;
