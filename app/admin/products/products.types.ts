import { Category } from '@/app/admin/categories/categories.types';

export type ProductWithCategory = {
  category: Category;
  created_at: string;
  heroImage: string;
  id: number;
  size: string;
  price: number | null;
  slug: string;
  flavor: string;
};

export type ProductsWithCategoriesResponse = ProductWithCategory[];

export type UpdateProductSchema = {
  category: number;
  heroImage: string;
  size: string;
  price: number;
  slug: string;
  flavor: string;
};