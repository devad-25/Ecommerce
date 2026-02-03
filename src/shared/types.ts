// src/types.ts
export type Product = {
  id: string; // always string
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  category?: string;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  productCount: number;
};
