export interface Product {
  id: string;
  title: string;
  brand?: string;
  price: number;
  currency?: string;
  tags?: string[];
  materials?: string[];
  images?: string[];
  rating?: number;
}