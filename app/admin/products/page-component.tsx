"use client";

import { FC, useState } from "react";
import { PlusCircle } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ProductsWithCategoriesResponse } from "@/app/admin/products/products.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@/app/admin/categories/categories.types";
import {
  createOrUpdateProductSchema,
  CreateOrUpdateProductSchema,
} from "@/app/admin/products/schema";
import { imageUploadHandler } from "@/app/actions/categories";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products";

import { ProductForm } from "@/app/admin/products/product-form";
import { ProductTableRow } from "@/app/admin/products/product-table-row";

type Props = {
  categories: Category[];
  productsWithCategories: ProductsWithCategoriesResponse;
};

export const ProductPageComponent: FC<Props> = ({
  categories,
  productsWithCategories,
}) => {
  const [currentProduct, setCurrentProduct] =
    useState<CreateOrUpdateProductSchema | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const form = useForm<CreateOrUpdateProductSchema>({
    resolver: zodResolver(createOrUpdateProductSchema),
    defaultValues: {
      flavor: "",
      category: undefined,
      price: undefined,
      size: undefined,
      heroImage: undefined,
      intent: "create",
    },
  });

  const router = useRouter();

  const productCreateUpdateHandler = async (
    data: CreateOrUpdateProductSchema
  ) => {
    const {
      category,
      size,
      price,
      flavor,
      heroImage,
      slug,
      intent = "create",
    } = data;

    const uploadFile = async (file: File) => {
      const uniqueId = uuid();
      const fileName = `product/product-${uniqueId}-${file.name}`;
      const formData = new FormData();
      formData.append("file", file, fileName);
      return imageUploadHandler(formData);
    };

    let heroImageUrl: string | undefined;

    if (heroImage) {
      const imagePromise = Array.from(heroImage).map((file) =>
        uploadFile(file as File)
      );
      try {
        [heroImageUrl] = await Promise.all(imagePromise);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
        return;
      }
    }

    switch (intent) {
      case "create": {
        if (heroImageUrl) {
          await createProduct({
            category: Number(category),
            heroImage: heroImageUrl,
            size,
            price: Number(price),
            flavor,
          });
          form.reset();
          router.refresh();
          setIsProductModalOpen(false);
          toast.success("Product created successfully");
        }
        break;
      }
      case "update": {
        if (heroImageUrl && slug) {
          await updateProduct({
            category: Number(category),
            heroImage: heroImageUrl!,
            size,
            price: Number(price),
            flavor,
            slug,
          });
          form.reset();
          router.refresh();
          setIsProductModalOpen(false);
          toast.success("Product updated successfully");
        }
        break;
      }

      default:
        console.error("Invalid intent");
    }
  };

  const deleteProductHandler = async () => {
    if (currentProduct?.slug) {
      await deleteProduct(currentProduct.slug);
      router.refresh();
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products</h1>

          <Dialog
            open={isProductModalOpen}
            onOpenChange={() => setIsProductModalOpen(!isProductModalOpen)}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => {
                  setCurrentProduct(null);
                  setIsProductModalOpen(true);
                }}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                form={form}
                onSubmit={productCreateUpdateHandler}
                categories={categories}
                defaultValues={currentProduct}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flavor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Product Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsWithCategories.map((product) => (
              <ProductTableRow
                setIsProductModalOpen={setIsProductModalOpen}
                key={product.id}
                product={product}
                setCurrentProduct={setCurrentProduct}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
              />
            ))}
          </TableBody>
        </Table>

        {/* Product Modal */}

        {/* Delete Product Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <p className="flex">
              Are you sure you want to delete
              <span className="font-bold ml-1">
                {currentProduct?.flavor} ({currentProduct?.size})
              </span>
              ?
            </p>
            <DialogFooter>
              <Button variant="destructive" onClick={deleteProductHandler}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};
