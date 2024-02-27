import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { FC } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Text, View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import { SelectedImage } from '../../types';
import { isAndroid } from '../../utils/platform';
import {
  uploadImages,
  validateMultipleImagesSize,
  verifyPermission,
} from '../../utils/uploadImage';
import { InputValidationError } from '../ui/InputValidationErrors';

interface Props {
  updateSelectedImages: (images: SelectedImage[]) => void;
  selectedImages: SelectedImage[];
  error?: string;
}

const Photos: FC<Props> = ({ updateSelectedImages, selectedImages, error }) => {
  const [, requestPermission] = ImagePicker.useCameraPermissions();

  const pickImages = async () => {
    const hasPermission = await verifyPermission(requestPermission);
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [1, 10],
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 8 - selectedImages.length,
      });
      if (!result.assets?.length) return;
      const images = result.assets;
      const isValidSize = validateMultipleImagesSize(images);
      if (!isValidSize) {
        Alert.alert('', 'Розмір фото не повинен перевищувати 10 Мб');
        return;
      }

      updateSelectedImages([
        ...selectedImages,
        ...images.map((img) => ({ imageUrl: img.uri, isPreview: true })),
      ]);

      const imagesUrls = await uploadImages(images);
      updateSelectedImages([
        ...selectedImages,
        ...imagesUrls.map((url) => ({ imageUrl: url, isPreview: false })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePhoto = (img: SelectedImage) => {
    const newSelectedImages = selectedImages.filter((i) => img.imageUrl !== i.imageUrl);
    updateSelectedImages(newSelectedImages);
  };

  const deleteAllPhotos = () => {
    updateSelectedImages([]);
  };

  const blurRadius = isAndroid ? 2 : 40;

  return (
    <View>
      <View className="mb-3 ml-2 flex-row items-center justify-between">
        <Text className="text-base">Фото *</Text>
        {selectedImages.length > 0 && (
          <TouchableOpacity onPress={deleteAllPhotos}>
            <View className="mt-1 flex-row items-center gap-x-1">
              <Text className="text-red-500">Видалити всі</Text>
              <MaterialCommunityIcons name="camera-outline" size={22} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      {error && selectedImages.length === 0 && <InputValidationError message={error} />}

      {selectedImages.length === 0 ? (
        <TouchableOpacity onPress={pickImages}>
          <View className="h-28 w-full items-center justify-center rounded-xl border-[0.5px] border-main">
            <MaterialIcons name="add-a-photo" size={32} color={mainColor} />
          </View>
        </TouchableOpacity>
      ) : (
        <View className="flex-row flex-wrap items-center gap-x-2 gap-y-2">
          {selectedImages.map((img) => (
            <View
              onPress={() => deletePhoto(img)}
              key={img.imageUrl}
              className="h-28 w-[22.7%] items-center justify-center rounded-lg">
              <Image
                className="aspect-[8.5/10] h-28 w-full rounded-lg object-cover"
                source={{ uri: img.imageUrl }}
                alt="item"
                blurRadius={img.isPreview ? blurRadius : 0}
              />
            </View>
          ))}
          {selectedImages.length < 8 && (
            <TouchableOpacity
              onPress={pickImages}
              className="h-28 w-[22.7%] items-center justify-center rounded-lg border-[0.5px] border-main">
              <MaterialIcons name="add-circle" size={20} color={mainColor} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default Photos;
