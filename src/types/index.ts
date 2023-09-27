import { SHORT_SIZES } from '../constants/listing';

export type Env = 'local' | 'production';

export interface User {
  id: number;
  nickname: string;
  avatarUrl?: string;
  bio: string;
  location: string;
  phone?: string;
}

export interface Message {
  text: string;
  id: number;
  senderId: number;
  relatedListingId: string;
  relatedListingTitle: string;
  createdAt: string;
}

export interface Chats {
  id: string;
  notification: boolean;
  Users: User[];
  Messages: Message[];
}

export interface Participants {
  recipient: User;
  sender: User;
}

// export interface ChatContext {
//   sendMessage: SendMessage;
//   readyState: ReadyState;
//   lastMessage: MessageEvent<any> | null;
// }

export type TListing = {
  imageUrls: string[];
  designer: string;
  size: keyof typeof SHORT_SIZES;
  title: string;
  price: number;
  status: 'AVAILABLE' | 'SOLD';
  id: string;
};

export interface RootLoaderData {
  ENV: Env;
  user: User | null;
}
