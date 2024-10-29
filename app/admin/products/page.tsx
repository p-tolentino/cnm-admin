import { getCategoriesWithProducts } from "@/app/actions/categories";
import { getProductsWithCategories } from "@/app/actions/products";
import { ProductPageComponent } from "@/app/admin/products/page-component";

export default async function Products() {
  const categories = await getCategoriesWithProducts();
  const productsWithCategories = await getProductsWithCategories();

  return (
    <ProductPageComponent
      categories={categories}
      productsWithCategories={productsWithCategories}
    />
  );
}
