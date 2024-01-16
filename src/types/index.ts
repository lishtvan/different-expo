import { SHORT_SIZES } from '../constants/listing';

export interface User {
  id: number;
  nickname: string;
  avatarUrl?: string;
  bio: string;
  location: string;
  phone?: string;
}

export type TListing = {
  imageUrls: string[];
  designer: string;
  size: keyof typeof SHORT_SIZES;
  title: string;
  price: number;
  status: 'AVAILABLE' | 'SOLD';
  id: string;
};

export interface SelectedImage {
  isPreview: boolean;
  imageUrl: string;
}
