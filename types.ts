export enum Category {
  ALL = 'All',
  CLOTHES = 'Clothes',
  ART = 'Art',
  MISC = 'Miscellaneous Products',
  ACCESSORIES = 'Accessories'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: Category;
  description: string;
  detailedHistory: string;
  imageUrl: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}