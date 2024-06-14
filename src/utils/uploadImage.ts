import { API_URL } from 'config';
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import { Alert } from 'react-native';
import { getSession } from 'utils/secureStorage';

const MB_10 = 10000000;

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

export const validateMultipleImagesSize = (images: ImagePickerAsset[]) => {
  for (const image of images) {
    if (image.fileSize && image.fileSize > MB_10) {
      return false;
    }
  }
  return true;
};

export const validateSingleImageSize = (image: ImagePickerAsset) => {
  if (image.fileSize && image.fileSize > MB_10) return false;
  return true;
};
