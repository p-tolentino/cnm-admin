import { getCategoryData } from "@/app/actions/categories";
import { getMonthlyOrders } from "@/app/actions/orders";
import PageComponent from "./page-component";
import { getLatestUsers } from "@/app/actions/auth";

const Dashboard = async () => {
  const monthlyOrders = await getMonthlyOrders();
  const categoryData = await getCategoryData();
  const latestUsers = await getLatestUsers();

  return (
    <PageComponent
      latestUsers={latestUsers}
      monthlyOrders={monthlyOrders}
      categoryData={categoryData}
    />
  );
};

export default Dashboard;
