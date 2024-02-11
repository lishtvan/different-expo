import { SHORT_SIZES } from '../constants/listing';

export interface TUser {
  id: number;
  nickname: string;
  avatarUrl?: string;
  bio: string;
  location: string;
  phone?: string;
  availableListingsCount: number;
  soldListingsCount: number;
  isOwnAccount: boolean;
}

export type TListing = {
  imageUrls: string[];
  designer: string;
  size: keyof typeof SHORT_SIZES;
  title: string;
  price: number;
  status: 'AVAILABLE' | 'SOLD';
  condition: string;
  id: string;
  tags: string[];
  description: string;
  User: {
    nickname: string;
    avatarUrl: string;
  };
};

export interface SelectedImage {
  isPreview: boolean;
  imageUrl: string;
}

export interface RefinementListItem {
  value: string;
  label: string;
  isRefined: boolean;
  count: number;
}
