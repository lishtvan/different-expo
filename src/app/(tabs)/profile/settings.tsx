import { Entypo } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InputValidationError, validationErrors } from 'components/ui/InputValidationErrors';
import TextArea from 'components/ui/TextArea';
import { toastConfig } from 'components/ui/toastConfig';
import { mainColor } from 'constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
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
import Toast from 'react-native-toast-message';
import { Text, Avatar, Input, View } from 'tamagui';
import { DEFAULT_AVATAR } from 'utils/avatarUrlFallback';
import { fetcher } from 'utils/fetcher';
import { uploadImage, validateSingleImageSize, verifyPermission } from 'utils/uploadImage';

const blurRadius = 10;

const SettingsScreen = () => {
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>();
  const [isUploading, setIsUploading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string>();

  const [, requestPermission] = ImagePicker.useCameraPermissions();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
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
        queryClient.invalidateQueries({ queryKey: ['auth_me'] }),
        queryClient.invalidateQueries({ queryKey: ['user', nickname] }),
      ]);

      router.navigate({ pathname: '/(tabs)/profile', params: { nickname } });
    },
  });

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
    const hasPermission = await verifyPermission(requestPermission);
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });
      if (isModalVisible) setTimeout(() => closeModal(), 50);
      if (!result.assets?.length) return;
      const image = result.assets[0];
      const isValidImageSize = validateSingleImageSize(image);
      if (!isValidImageSize) {
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
    if (newAvatarUrl === null) return DEFAULT_AVATAR;
    return newAvatarUrl || user.avatarUrl || DEFAULT_AVATAR;
  };

  if (isLoading) return null;
  if (error) throw error;
  if (mutation.error) throw mutation.error;
  return (
    <SafeAreaView className="flex-1">
      <Toast config={toastConfig} />
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
        <View className="gap-y-3 px-3">
          <View className="mx-auto">
            <Pressable
              disabled={isUploading}
              className="relative h-[110px] w-[110px] items-center justify-center"
              onPress={() => {
                if (newAvatarUrl || user.avatarUrl) toggleModal();
                else pickImage();
              }}>
              <Avatar circular size="$10" className="mx-auto">
                <Avatar.Image
                  blurRadius={isUploading ? blurRadius : 0}
                  src={getCurrentAvatarUrl()}
                />
              </Avatar>
              {!isUploading && (
                <View className="absolute bottom-1 right-3 rounded-full bg-white">
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
                  autoCorrect={false}
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
                  autoCorrect={false}
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
            <View className="mx-4 mb-16 rounded-2xl bg-white">
              <TouchableOpacity
                onPress={pickImage}
                className="flex-row justify-center border-b-2 border-b-[#eeeeee] p-4">
                <Text className="text-xl">Обрати фото</Text>
              </TouchableOpacity>
              {(newAvatarUrl || user.avatarUrl) && (
                <TouchableOpacity
                  onPress={deleteAvatar}
                  className="flex-row justify-center border-b-2 border-b-[#eeeeee] p-4">
                  <Text className="text-xl text-red-600">Видалити фото</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={closeModal} className="flex-row justify-center p-4">
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
