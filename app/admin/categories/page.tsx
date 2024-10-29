import { getCategoriesWithProducts } from "@/app/actions/categories";
import CategoryPageComponent from "./page-component";

export default async function Categories() {
  const categories = await getCategoriesWithProducts();

  return <CategoryPageComponent categories={categories} />;
}
