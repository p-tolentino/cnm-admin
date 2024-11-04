"use client";

import { format } from "date-fns";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { OrdersWithProducts } from "@/app/admin/orders/orders.types";
import { updateOrderStatus } from "@/app/actions/orders";
import { cn, formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const statusOptions = ["Pending", "Paid", "In-Transit", "Delivered"];

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

export default function PageComponent({ ordersWithProducts }: Props) {
  const { theme, systemTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const orderedItems = ordersWithProducts.flatMap((order) => {
    const { order_items } = order;

    return order_items.map((item) => {
      const { order, product, quantity } = item;
      return { order_id: order, product, quantity };
    });
  });

  orderedItems.map((item) => console.log(item));

  const handleStatusChange = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const statusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": {
        if (
          theme === "dark" ||
          (theme === "system" && systemTheme === "dark")
        ) {
          return "text-red-300 bg-red-950 border-red-900";
        }
        return "text-red-700 bg-red-200";
      }
      case "paid": {
        if (
          theme === "dark" ||
          (theme === "system" && systemTheme === "dark")
        ) {
          return "text-yellow-300 bg-yellow-950 border-yellow-900";
        }
        return "text-yellow-700 bg-yellow-200";
      }
      case "in-transit": {
        if (
          theme === "dark" ||
          (theme === "system" && systemTheme === "dark")
        ) {
          return "text-blue-300 bg-blue-950 border-blue-900";
        }
        return "text-blue-700 bg-blue-200";
      }
      case "delivered": {
        if (
          theme === "dark" ||
          (theme === "system" && systemTheme === "dark")
        ) {
          return "text-green-300 bg-green-950 border-green-900";
        }
        return "text-green-700 bg-green-200";
      }

      default:
        return;
    }
  };

  return (
    <div className="mx-4 my-4 p-4 md:mx-10 md:p-10">
      <h1 className="text-2xl font-bold mb-6">Sales Orders</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Order Date</TableHead>
              <TableHead className="whitespace-nowrap">Customer Name</TableHead>
              <TableHead className="whitespace-nowrap">Delivery Date</TableHead>
              <TableHead className="whitespace-nowrap">Delivery Time</TableHead>
              <TableHead className="whitespace-nowrap">
                Delivery Address
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Contact Number
              </TableHead>
              <TableHead className="whitespace-nowrap">Total Price</TableHead>
              <TableHead className="whitespace-nowrap">Total Items</TableHead>
              <TableHead className="whitespace-nowrap">Products</TableHead>
              <TableHead className="whitespace-nowrap">
                Proof of Payment
              </TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersWithProducts.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="whitespace-nowrap">
                  {order.slug}
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      handleStatusChange(order.id, value)
                    }
                    defaultValue={order.status}
                  >
                    <SelectTrigger
                      className={cn("w-[120px]", statusStyle(order.status))}
                    >
                      <SelectValue>{order.status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(order.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.userName}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {format(new Date(order.delivery_date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{order.delivery_time}</TableCell>
                <TableCell>{order.delivery_address}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {`0` + order.phone}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.order_items.length} item
                  {order.order_items.length > 1 ? "s" : ""}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Products
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Ordered Products</DialogTitle>
                        <DialogDescription>
                          Summary of ordered products in this order.
                        </DialogDescription>
                      </DialogHeader>
                      <Separator />
                      <div className="max-h-[60vh] overflow-y-auto">
                        {orderedItems
                          .filter((item) => item.order_id === order.id)
                          .map((item) => (
                            <div key={item.product.id} className="py-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">
                                    x{item.quantity}
                                  </span>
                                  <div>
                                    <span className="font-semibold">
                                      {item.product.flavor} ({item.product.size}
                                      )
                                    </span>
                                    <span className="block text-sm text-gray-600">
                                      {formatCurrency(item.product.price)}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  ={" "}
                                  {formatCurrency(
                                    item.product.price * item.quantity
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm pt-2">
                        <span>Total:</span>
                        <span className="font-semibold">
                          {formatCurrency(order.totalPrice)}
                        </span>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Dialog modal>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="p-2">
                        <DialogTitle>Proof of Payment</DialogTitle>
                        <DialogDescription className="flex flex-col">
                          View the proof of payment for Order ID:{" "}
                          <span>{order.slug.toUpperCase()}</span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative aspect-square w-full">
                        {isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Skeleton className="w-full h-full" />
                          </div>
                        )}
                        {!hasError ? (
                          <Image
                            src={order.proofOfPayment}
                            alt={`proof-of-payment_${order.slug}`}
                            className={`object-contain ${
                              isLoading ? "opacity-0" : "opacity-100"
                            }`}
                            fill
                            priority
                            onLoadStart={() => setIsLoading(true)}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-red-500">
                            Failed to load image. Please try again later.
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
