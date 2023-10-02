import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Keyboard, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, Avatar, Input, View } from 'tamagui';

import TextArea from '../components/ui/TextArea';
import { fetcher } from '../utils/fetcher';

const InputValidationError = ({ message }: { message: string }) => (
  <Text className="my-1 ml-2 text-red-600">{message}</Text>
);

const validationErrors = {
  required: <InputValidationError message="Це поле є обов`язковим." />,
  pattern: <InputValidationError message="Дозволено лише a-z, 0-9 та підкреслення." />,
  minLength: <InputValidationError message="Занадто коротко." />,
  maxLength: <InputValidationError message="Занадто довго." />,
};

const SettingsScreen = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth_check'],
    queryFn: () => fetcher({ route: '/auth/check', method: 'GET' }),
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nickname: user?.nickname,
      bio: user?.bio,
      location: user?.location,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: unknown) =>
      fetcher({
        route: '/user/update',
        method: 'POST',
        body: data,
      }),
    onSuccess: async () => {
      const { nickname } = getValues();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['auth_check'] }),
        queryClient.invalidateQueries({ queryKey: ['user', nickname] }),
      ]);

      router.push({ pathname: '/profile', params: { nickname } });
    },
  });

  const onSubmit = (data: unknown) => mutation.mutate(data);

  if (isLoading) return null;

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
              <Text className="text-base">Зберегти</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="gap-y-3 flex-1 px-3">
          <Avatar circular size="$10" className="mb-2 mx-auto">
            <Avatar.Image src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" />
            <Avatar.Fallback bc="green" delayMs={5000} />
          </Avatar>
          <View className="gap-y-3">
            <Controller
              control={control}
              rules={{ required: true, minLength: 2, maxLength: 20, pattern: /^[a-z0-9_]+$/ }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  size="$4"
                  borderRadius="$main"
                  autoCapitalize="none"
                  placeholder="Нікнейм"
                  className="w-full"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="nickname"
            />
            {errors.nickname &&
              validationErrors[errors.nickname.type as keyof typeof validationErrors]}
          </View>

          <View>
            <Controller
              control={control}
              rules={{ maxLength: 150 }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  placeholder="Про себе"
                  className="w-full"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="bio"
            />
            {errors.bio && validationErrors[errors.bio.type as keyof typeof validationErrors]}
          </View>

          <View>
            <Controller
              control={control}
              rules={{ maxLength: 32 }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  size="$4"
                  borderRadius="$main"
                  placeholder="Місце знаходження"
                  className="w-full"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="location"
            />
            {errors.location &&
              validationErrors[errors.location.type as keyof typeof validationErrors]}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SettingsScreen;
