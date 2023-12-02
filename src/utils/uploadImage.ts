import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset, PermissionResponse, PermissionStatus } from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

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

export const uploadImages = async (images: ImagePickerAsset[]) => {
  const imageUploadPromises = images.map((image) => uploadImage(image));
  const imagesUrls = await Promise.all(imageUploadPromises);
  return imagesUrls;
};

export const verifyPermission = async (
  permission: PermissionResponse | null,
  requestPermission: () => Promise<PermissionResponse>
): Promise<boolean> => {
  if (!permission || permission.status === PermissionStatus.UNDETERMINED) {
    const permissionResponse = await requestPermission();
    return permissionResponse.granted;
  }
  if (permission.status === PermissionStatus.DENIED) {
    await Linking.openSettings();
    return false;
  }
  return true;
};

export const validateMultipleImagesSize = (images: ImagePickerAsset[]) => {
  for (const image of images) {
    if (image.fileSize && image.fileSize > 10000000) {
      return false;
    }
  }
  return true;
};

export const validateSingleImageSize = (image: ImagePickerAsset) => {
  if (image.fileSize && image.fileSize > 10000000) return false;
  return true;
};
