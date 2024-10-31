import { Dispatch, SetStateAction } from "react";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { ProductWithCategory } from "@/app/admin/products/products.types";
import { CreateOrUpdateProductSchema } from "@/app/admin/products/schema";
import { formatCurrency } from "@/lib/utils";

type Props = {
  product: ProductWithCategory;
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentProduct: Dispatch<
    SetStateAction<CreateOrUpdateProductSchema | null>
  >;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ProductTableRow = ({
  product,
  setIsProductModalOpen,
  setCurrentProduct,
  setIsDeleteModalOpen,
}: Props) => {
  const handleEditClick = (product: CreateOrUpdateProductSchema) => {
    setCurrentProduct({
      flavor: product.flavor,
      category: product.category,
      price: product.price,
      size: product.size,
      heroImage: product.heroImage,
      slug: product.slug,
      intent: "update",
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteClick = () => {
    setCurrentProduct({
      flavor: product.flavor,
      category: product.category.id.toString(),
      price: product.price?.toString() ?? "",
      size: product.size,
      slug: product.slug,
      intent: "update",
    });
    setIsDeleteModalOpen(true);
  };

  return (
    <TableRow key={product.id}>
      <TableCell>{product.flavor}</TableCell>
      <TableCell>{product.category.name}</TableCell>
      <TableCell>{formatCurrency(product.price)}</TableCell>
      <TableCell>{product.size}</TableCell>
      <TableCell>
        {product.heroImage && (
          <Image
            width={40}
            height={40}
            src={product.heroImage}
            alt="Hero"
            className="w-10 h-10 object-cover"
          />
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuItem
              onClick={() =>
                handleEditClick({
                  flavor: product.flavor,
                  category: product.category.id.toString(),
                  price: product.price?.toString() ?? "",
                  size: product.size,
                  slug: product.slug,
                  intent: "update",
                })
              }
            >
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClick}>
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
