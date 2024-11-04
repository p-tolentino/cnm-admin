import { getCategoryData } from "@/app/actions/categories";
import {
  getAllOrderItems,
  getMonthlyOrders,
  getOrdersWithProducts,
} from "@/app/actions/orders";
import PageComponent from "./page-component";
import { getLatestUsers } from "@/app/actions/auth";

const Dashboard = async () => {
  const monthlyOrders = await getMonthlyOrders();
  const categoryData = await getCategoryData();
  const latestUsers = await getLatestUsers();
  const allOrders = await getOrdersWithProducts();
  const allOrderItems = await getAllOrderItems();

  return (
    <PageComponent
      latestUsers={latestUsers}
      monthlyOrders={monthlyOrders}
      categoryData={categoryData}
      allOrders={allOrders}
      allOrderItems={allOrderItems}
    />
  );
};

export default Dashboard;
