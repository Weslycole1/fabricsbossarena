import { supabase } from "../../lib/supabase";
import type { DbOrder, Order, OrderStatus, PaymentStatus } from "../../types/order";
import { appendStatusEvent, mapDbOrder } from "../../types/order";

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbOrder[]).map(mapDbOrder);
}

export async function fetchOrderById(id: number): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw error ?? new Error("Order not found.");
  return mapDbOrder(data as DbOrder);
}

export async function fetchOrderStats() {
  const [{ count: totalOrders }, { count: pendingOrders }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    totalOrders: totalOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
  };
}

/** Updates an order's status and appends the change to its status history. */
export async function updateOrderStatus(
  id: number,
  currentHistory: Order["statusHistory"],
  status: OrderStatus
): Promise<Order> {
  const nextHistory = appendStatusEvent(currentHistory, status);

  const { data, error } = await supabase
    .from("orders")
    .update({ status, status_history: nextHistory })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to update order status.");
  return mapDbOrder(data as DbOrder);
}

export async function updatePaymentStatus(
  id: number,
  paymentStatus: PaymentStatus
): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to update payment status.");
  return mapDbOrder(data as DbOrder);
}

export async function updateOrderNotes(id: number, notes: string): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .update({ order_notes: notes })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to update order notes.");
  return mapDbOrder(data as DbOrder);
}

export async function deleteOrder(id: number): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}
