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

export interface Participants {
  recipient: TUser;
  sender: TUser;
}

export type ListingStatus = 'AVAILABLE' | 'SOLD' | 'ORDER';

export type TListing<IdType = string> = {
  imageUrls: string[];
  designer: string;
  size: keyof typeof SHORT_SIZES;
  category: string;
  title: string;
  price: number;
  status: ListingStatus;
  condition: string;
  id: IdType;
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

export type RFunc = Record<string, () => void>;

export interface ListingResponse {
  listing: TListing<number>;
  isOwnListing: boolean;
  sellerSoldListingsCount: boolean;
  sellerAvailableListingsCount: boolean;
}

export type EditListingParams = {
  designer?: string;
  listingId: string;
  size?: string;
  category?: string;
};

export interface Message {
  text: string;
  id: number;
  senderId: number;
  relatedListingId: string;
  relatedListingTitle: string;
  createdAt: string;
}
