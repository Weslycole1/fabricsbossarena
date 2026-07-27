import type { BadgeVariant } from "../admin/components/ui/Badge";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "ready_for_delivery",
  "delivered",
  "cancelled",
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  ready_for_delivery: "Ready for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

// Badge variant per status — kept here so list + detail views stay in sync.
export const ORDER_STATUS_BADGE_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: "warning",
  confirmed: "info",
  processing: "gold",
  ready_for_delivery: "outline",
  delivered: "success",
  cancelled: "danger",
};

export const PAYMENT_STATUS_BADGE_VARIANT: Record<PaymentStatus, BadgeVariant> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "neutral",
};

export interface OrderLineItem {
  id: number;
  name: string;
  price: number;
  img_url: string;
  qty: number;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  changed_at: string;
}

/** Raw shape as stored in / returned from the `orders` table. */
export interface DbOrder {
  id: number | string;
  user_id: string | null;
  reference: string;
  items: OrderLineItem[] | null;
  subtotal: number | string | null;
  total: number | string;
  status: string | null;
  payment_status: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_address: string;
  customer_city: string | null;
  customer_state: string | null;
  order_notes: string | null;
  status_history: OrderStatusEvent[] | null;
  created_at: string;
  updated_at: string | null;
}

/** Normalized Order shape used throughout the admin UI. */
export interface Order {
  id: number;
  userId: string | null;
  reference: string;
  items: OrderLineItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  orderNotes: string;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
  updatedAt: string | null;
}

const isOrderStatus = (value: string | null | undefined): value is OrderStatus =>
  !!value && (ORDER_STATUSES as string[]).includes(value);

const isPaymentStatus = (value: string | null | undefined): value is PaymentStatus =>
  !!value && (PAYMENT_STATUSES as string[]).includes(value);

export const mapDbOrder = (row: DbOrder): Order => ({
  id: Number(row.id),
  userId: row.user_id,
  reference: row.reference,
  items: Array.isArray(row.items) ? row.items : [],
  subtotal: Number(row.subtotal ?? row.total ?? 0),
  total: Number(row.total ?? 0),
  status: isOrderStatus(row.status) ? row.status : "pending",
  paymentStatus: isPaymentStatus(row.payment_status) ? row.payment_status : "pending",
  customerName: row.customer_name ?? "",
  customerEmail: row.customer_email ?? "",
  customerPhone: row.customer_phone ?? "",
  customerAddress: row.customer_address ?? "",
  customerCity: row.customer_city ?? "",
  customerState: row.customer_state ?? "",
  orderNotes: row.order_notes ?? "",
  statusHistory: Array.isArray(row.status_history) ? row.status_history : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Generates a unique, human-readable order reference. Combines a base-36
 * timestamp with a short random suffix so references are both unique and
 * short enough for a customer to read back over WhatsApp/phone.
 * Must be called from an event handler (not render) — it's intentionally impure.
 */
export function generateOrderReference(): string {
  const timePart = Date.now().toString(36).toUpperCase();
  const randPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FBA-${timePart}-${randPart}`;
}

/** Appends a new status-change event to an order's status history. */
export function appendStatusEvent(
  history: OrderStatusEvent[],
  status: OrderStatus
): OrderStatusEvent[] {
  return [...history, { status, changed_at: new Date().toISOString() }];
}
