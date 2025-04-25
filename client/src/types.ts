import { ethers } from 'ethers'

export interface BookType {
  id: string
  title: string
  author: string
  coverUrl: string
  year: number
  genre: string
  rating: number
}

export interface StoreBookType extends BookType {
  price: number
  stock: number
}

export interface CollectionBookType extends BookType {
  dateAdded: string
  notes?: string
  readStatus: "unread" | "reading" | "completed"
}

export interface CartItem {
  book: StoreBookType
  quantity: number
}

;

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider & {
      on(eventName: string, listener: (...args: any[]) => void): void;
      removeListener(eventName: string, listener: (...args: any[]) => void): void;
      isConnected?: boolean;
      selectedAddress?: string;
    };
  }
}

export {}
