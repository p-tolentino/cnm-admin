'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendNotification } from './notifications';

const statusDisplayText: { [key: string]: string } = {
  Pending: "Pending",
  Completed: "Completed",
  Shipped: "Shipped",
  InTransit: "In Transit",
};

export const getOrdersWithProducts = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('order')
    .select('*, order_items:order_item(*, product(*)), user(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('order')
    .update({ status })
    .eq('id', orderId);

  if (error) throw new Error(error.message);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("User session not found.");
  }

  const userId = session.user.id;

  await sendNotification(userId, statusDisplayText[status] + ' 🚀');

  revalidatePath('/admin/orders');
};

export const getMonthlyOrders = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('order').select('created_at');

  if (error) throw new Error(error.message);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const ordersByMonth = data.reduce(
    (acc: Record<string, number>, order: { created_at: string }) => {
      const date = new Date(order.created_at);
      const month = monthNames[date.getUTCMonth()]; // Get the month name

      // Increment the count for this month
      if (!acc[month]) acc[month] = 0;
      acc[month]++;

      return acc;
    },
    {}
  );

  return Object.keys(ordersByMonth).map(month => ({
    name: month,
    orders: ordersByMonth[month],
  }));
};