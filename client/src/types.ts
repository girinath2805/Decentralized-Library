import { ethers } from 'ethers'

export interface BookType {
  id: string
  title: string
  author: string
  coverUrl: string
  year: number
  genre: string
}

export interface StoreBookType extends BookType {
  price: number
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
