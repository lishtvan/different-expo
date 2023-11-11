import { Entypo } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Alert,
  Keyboard,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import { Text, Avatar, Input, View } from 'tamagui';

import { mainColor } from '../../tamagui.config';
import { InputValidationError, validationErrors } from '../components/ui/InputValidationErrors';
import TextArea from '../components/ui/TextArea';
import { fetcher } from '../utils/fetcher';
import { uploadImage } from '../utils/uploadImage';

const SettingsScreen = () => {
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>();
  const [isUploading, setIsUploading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string>();

  const [status, requestPermission] = ImagePicker.useCameraPermissions();
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
    onSuccess: async (res) => {
      if (res.error) return;
      const { nickname } = getValues();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['auth_check'] }),
        queryClient.invalidateQueries({ queryKey: ['user', nickname] }),
      ]);

      router.push({ pathname: '/profile', params: { nickname } });
    },
  });

  useEffect(() => {
    if (!status) (async () => await requestPermission())();
  }, [status]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const onSubmit = (data: Record<string, unknown>) => {
    mutation.mutate({ ...data, avatarUrl: newAvatarUrl });
  };

  const pickImage = async () => {
    if (!status?.granted) {
      Alert.alert('', 'Потрібно надати доступ до галереї в налаштуваннях вашого девайсу.');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [1, 10],
        quality: 1,
        allowsEditing: true,
      });
      if (isModalVisible) setTimeout(() => closeModal(), 50);
      if (!result.assets?.length) return;
      const image = result.assets[0];
      if (image.fileSize && image.fileSize > 10000000) {
        Alert.alert('', 'Розмір фото не повинен перевищувати 10 Мб');
        return;
      }
      setPreviewImage(image.uri);
      setIsUploading(true);

      const imageUrl = await uploadImage(image);
      setNewAvatarUrl(imageUrl);
      setIsUploading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAvatar = () => {
    closeModal();
    setTimeout(() => setNewAvatarUrl(null), 500);
  };

  const getCurrentAvatarUrl = () => {
    if (isUploading) return previewImage;
    const defaultAvatarUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
    if (newAvatarUrl === null) return defaultAvatarUrl;
    return newAvatarUrl || user.avatarUrl || defaultAvatarUrl;
  };

  if (isLoading) return null;
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity disabled={isUploading} onPress={handleSubmit(onSubmit)}>
              <Text className="text-base">{isUploading ? 'Завантаження...' : 'Зберегти'}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="gap-y-3 flex-1 px-3">
          <View className="mx-auto">
            <Pressable
              disabled={isUploading}
              className="w-[110px] h-[110px] relative items-center justify-center"
              onPress={() => {
                if (newAvatarUrl || user.avatarUrl) toggleModal();
                else pickImage();
              }}>
              <Avatar circular size="$10" className="mx-auto">
                <Avatar.Image blurRadius={isUploading ? 100 : 0} src={getCurrentAvatarUrl()} />
                <Avatar.Fallback bc="red" delayMs={5000} />
              </Avatar>
              {!isUploading && (
                <View className="absolute right-3 bottom-1 bg-white rounded-full">
                  <Entypo size={26} name="circle-with-plus" color={mainColor} />
                </View>
              )}
            </Pressable>
          </View>
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
            {mutation.data?.error && (
              <InputValidationError message={mutation.data.errors.nickname} />
            )}
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
          <Modal
            style={{ justifyContent: 'flex-end', margin: 0 }}
            onBackdropPress={closeModal}
            isVisible={isModalVisible}
            backdropOpacity={0.3}
            swipeDirection={['down']}
            onSwipeComplete={closeModal}>
            <View className="mx-4 mb-16 bg-white rounded-2xl">
              <TouchableOpacity
                onPress={pickImage}
                className="p-4 border-b-2 border-b-[#eeeeee] flex-row justify-center">
                <Text className="text-xl">Обрати фото</Text>
              </TouchableOpacity>
              {(newAvatarUrl || user.avatarUrl) && (
                <TouchableOpacity
                  onPress={deleteAvatar}
                  className="p-4 border-b-2 border-b-[#eeeeee] flex-row justify-center">
                  <Text className="text-xl text-red-600">Видалити фото</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={closeModal} className="p-4 flex-row justify-center">
                <Text className="text-xl">Скасувати</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SettingsScreen;
