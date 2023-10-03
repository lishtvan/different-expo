import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import { Alert } from 'react-native';

import { getSession } from './secureStorage';

export const uploadImage = async (image: ImagePickerAsset) => {
  const token = await getSession();
  const uploadResult = await FileSystem.uploadAsync(
    `${process.env.EXPO_PUBLIC_API_URL}/images/upload`,
    image.uri,
    {
      httpMethod: 'POST',
      headers: { Cookie: `token=${token}` },
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'image',
    }
  );

  const { statusCode, imageUrl } = JSON.parse(uploadResult.body);
  if (statusCode === 413) Alert.alert('', 'Розмір фото не повинен перевищувати 10 Мб');
  else return imageUrl;
};
