"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrdersWithProducts } from "../orders/orders.types";
import { Database } from "@/utils/supabase/types";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

type MonthlyOrderData = {
  name: string;
  orders: number;
};

type CategoryData = {
  name: string;
  products: number;
};

type LatestUser = {
  id: string;
  email: string;
  date: string | null;
};

type OrderItemWithProduct =
  Database["public"]["Tables"]["order_item"]["Row"] & {
    product: Database["public"]["Tables"]["product"]["Row"];
  };

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RED_SHADES = [
  "#B22222", // [0] Firebrick (Base)
  "#8B0000", // [1] Dark Red (applicable to Markers)
  "#CD5C5C", // [2] Indian Red
  "#FF6347", // [3] Tomato
  "#FF7F50", // [4] Coral
  "#FF4500", // [5] Orange Red (applicable to Bar Chart and Zoom Area)
  "#FFB6C1", // [6] Light Pink
];

const PageComponent = ({
  monthlyOrders,
  categoryData,
  latestUsers,
  allOrders,
  allOrderItems,
}: {
  monthlyOrders: MonthlyOrderData[];
  categoryData: CategoryData[];
  latestUsers: LatestUser[];
  allOrders: OrdersWithProducts;
  allOrderItems: OrderItemWithProduct[];
}) => {
  const flavorData = allOrderItems.reduce((acc, item) => {
    const flavor = item.product.flavor;
    const existingFlavor = acc.find((entry) => entry.flavor === flavor);

    if (existingFlavor) {
      existingFlavor.value += 1; // Increment count if flavor already exists
    } else {
      acc.push({ flavor, value: 1 }); // Add new flavor entry
    }

    return acc;
  }, [] as { flavor: string; value: number }[]);

  return (
    <div className="flex-1 px-32 py-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#C41B1B" name={"Orders"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Products Chart */}
        {/* Flavor Distribution (Pie) */}
        <Card>
          <CardHeader>
            <CardTitle>Flavor Distribution (Chicken)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={flavorData}
                  dataKey="value"
                  nameKey="flavor"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RED_SHADES[index % RED_SHADES.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category To products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Products per Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="products" fill="#B22222" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Latest Users */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestUsers.map(
                  (user) =>
                    user.date && (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {format(
                            toZonedTime(parseISO(user.date), "Asia/Manila"),
                            "MMMM dd,  yyyy hh:mm:ss aa"
                          )}
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageComponent;
