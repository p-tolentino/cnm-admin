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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { OrdersWithProducts } from "@/app/admin/orders/orders.types";
import { updateOrderStatus } from "@/app/actions/orders";
import { cn, formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";

const statusOptions = ["Pending", "Paid", "In-Transit", "Delivered"];

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

export default function PageComponent({ ordersWithProducts }: Props) {
  const { theme, systemTheme } = useTheme();

  const orderedItems = ordersWithProducts.flatMap((order) => {
    const { order_items } = order;

    return order_items.map((item) => {
      const { order, product, quantity } = item;
      return { order_id: order, product, quantity };
    });
  });

  const handleStatusChange = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  const statusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": {
        if (
          theme === "dark" ||
          (theme === "system" && systemTheme === "dark")
        ) {
          return "text-orange-300 bg-orange-950 border-orange-900";
        }
        return "text-orange-700 bg-orange-200";
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
    //border border-[#C41B1B]/20 rounded-3xl shadow-md
    <div className=" mx-10 my-4 p-10 ">
      <h1 className="text-2xl font-bold mb-6">Sales Orders</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Delivery Address</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Total Items</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Proof of Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersWithProducts.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.slug}</TableCell>
              <TableCell>
                <Select
                  onValueChange={(value) => handleStatusChange(order.id, value)}
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
              <TableCell>
                {format(new Date(order.created_at), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{order.userName}</TableCell>

              <TableCell>
                {format(new Date(order.delivery_date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{order.delivery_time}</TableCell>
              <TableCell>{order.delivery_address}</TableCell>
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ordered Products</DialogTitle>
                    </DialogHeader>
                    <Separator />

                    {orderedItems.map(({ product, quantity }) => (
                      <div key={product.id}>
                        <div className="px-2">
                          <div className="flex items-center space-x-4 h-full">
                            <div className="w-full flex items-end justify-between">
                              <div className="flex space-x-1">
                                <span className="flex text-sm text-gray-500">
                                  x{quantity}
                                </span>
                                <div>
                                  <span className="flex font-semibold">
                                    {product.flavor} ({product.size})
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {product.price.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="flex text-sm text-gray-500">
                                  = {(product.price * quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between  text-sm">
                      Total:
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
                  <DialogContent className="h-auto w-[80vw] max-w-4xl">
                    <DialogTitle>Proof of Payment</DialogTitle>
                    <div className="h-[80vh] flex flex-col items-center gap-4 rounded-lg justify-between ">
                      <Separator className="my-1" />
                      <Image
                        src={order.proofOfPayment}
                        alt={`proof-of-payment_${order.slug}`}
                        fill
                        className="h-10 w-10 p-20 object-contain"
                        priority
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
