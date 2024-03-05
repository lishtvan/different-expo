import * as FileSystem from 'expo-file-system';
import {
  ImagePickerAsset,
  PermissionResponse,
  PermissionStatus,
  getCameraPermissionsAsync,
} from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

import { getSession } from './secureStorage';
import { API_URL } from '../config/config';

export const uploadImage = async (image: ImagePickerAsset) => {
  const token = await getSession();
  const uploadResult = await FileSystem.uploadAsync(`${API_URL}/images/upload`, image.uri, {
    httpMethod: 'POST',
    headers: { Cookie: `token=${token}` },
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: 'image',
  });

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
  requestPermission: () => Promise<PermissionResponse>
): Promise<boolean> => {
  const permission = await getCameraPermissionsAsync();
  if (permission.status === PermissionStatus.UNDETERMINED) {
    const permissionResponse = await requestPermission();
    return permissionResponse.granted;
  } else if (permission.status === PermissionStatus.DENIED) {
    Alert.alert('', 'Потрібно надати доступ до камери', [
      { text: 'Скасувати', onPress: () => {}, style: 'cancel' },
      { text: 'Надати доступ', onPress: () => Linking.openSettings() },
    ]);
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
